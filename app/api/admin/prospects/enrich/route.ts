import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export const dynamic = "force-dynamic";

const HARDCODED_ADMINS = ["eliasco2018@gmail.com", "tete.afidenyigba@gmail.com", "komlanserge@hotmail.com"];

async function getAdminUser() {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) return null;
  const envAdmins = (process.env.ADMIN_EMAILS || "").split(",").map(e => e.trim().toLowerCase()).filter(Boolean);
  const allAdmins = [...new Set([...HARDCODED_ADMINS, ...envAdmins])];
  if (!allAdmins.includes(user.email.toLowerCase())) return null;
  return user;
}

// POST /api/admin/prospects/enrich
// Body: { batch?: number }  — enrichit les N premiers prospects sans email via Dropcontact
export async function POST(request: NextRequest) {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const DROPCONTACT_KEY = process.env.DROPCONTACT_API_KEY;
  if (!DROPCONTACT_KEY) {
    return NextResponse.json({ error: "DROPCONTACT_API_KEY non configurée dans les variables d'environnement Vercel" }, { status: 500 });
  }

  const body = await request.json().catch(() => ({}));
  const batchSize = Math.min(parseInt(body.batch ?? "100"), 500);

  const db = createServiceClient();
  const { data: prospects, error: fetchError } = await db
    .from("prospects")
    .select("id, first_name, last_name, specialty, city, postal_code")
    .is("email", null)
    .limit(batchSize);

  if (fetchError) return NextResponse.json({ error: fetchError.message }, { status: 500 });
  if (!prospects?.length) return NextResponse.json({ enriched: 0, total: 0, message: "Tous les prospects ont déjà un email" });

  // Soumission batch à Dropcontact
  const dropcontactPayload = prospects.map(p => ({
    first_name: p.first_name,
    last_name: p.last_name,
    company: p.specialty ? `Dr ${p.last_name} ${p.specialty}` : `Dr ${p.last_name} médecin libéral`,
  }));

  const submitRes = await fetch("https://api.dropcontact.com/batch", {
    method: "POST",
    headers: { "X-Access-Token": DROPCONTACT_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ data: dropcontactPayload, siren: false }),
  });

  if (!submitRes.ok) {
    const txt = await submitRes.text();
    return NextResponse.json({ error: `Dropcontact erreur ${submitRes.status}: ${txt}` }, { status: 502 });
  }

  const { request_id } = await submitRes.json();
  if (!request_id) return NextResponse.json({ error: "Dropcontact: pas de request_id" }, { status: 502 });

  // Polling du résultat (max 60 s)
  let contacts: Record<string, unknown>[] | null = null;
  for (let i = 0; i < 60; i++) {
    await new Promise(r => setTimeout(r, 1000));
    const pollRes = await fetch(`https://api.dropcontact.com/batch/${request_id}`, {
      headers: { "X-Access-Token": DROPCONTACT_KEY },
    });
    const pollJson = await pollRes.json() as { success?: boolean; contacts?: Record<string, unknown>[] };
    if (pollJson.success && Array.isArray(pollJson.contacts)) { contacts = pollJson.contacts; break; }
  }

  if (!contacts) return NextResponse.json({ error: "Dropcontact: timeout (>60 s)" }, { status: 504 });

  // Mise à jour des prospects avec les emails trouvés
  let enriched = 0;
  for (let i = 0; i < prospects.length; i++) {
    const c = contacts[i] as { email?: { email: string; qualification: string }[] } | undefined;
    const emails = c?.email;
    if (!Array.isArray(emails) || !emails.length) continue;
    const best = emails.find(e => e.qualification === "verified") ?? emails[0];
    if (!best?.email) continue;
    await db.from("prospects").update({ email: best.email, updated_at: new Date().toISOString() }).eq("id", prospects[i].id);
    enriched++;
  }

  return NextResponse.json({ enriched, total: prospects.length, request_id });
}

// GET /api/admin/prospects/enrich — nombre de prospects sans email
export async function GET() {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = createServiceClient();
  const { count } = await db.from("prospects").select("id", { count: "exact", head: true }).is("email", null);
  return NextResponse.json({ without_email: count ?? 0 });
}
