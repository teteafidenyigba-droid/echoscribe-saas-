import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { sendProspectEmail } from "@/lib/resend";

export const dynamic = "force-dynamic";

const HARDCODED_ADMINS = ["eliasco2018@gmail.com", "tete.afidenyigba@gmail.com", "komlanserge@hotmail.com", "contact@echoscribe.fr"];

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

// POST /api/admin/campaign
// body: { ids: string[], subject: string, body: string }
export async function POST(request: NextRequest) {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { ids, subject, body: emailBody } = await request.json();
  if (!Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json({ error: "Aucun prospect sélectionné" }, { status: 400 });
  }
  if (!subject?.trim() || !emailBody?.trim()) {
    return NextResponse.json({ error: "Sujet et corps du message requis" }, { status: 400 });
  }

  const db = createServiceClient();
  const { data: prospects, error } = await db
    .from("prospects")
    .select("id, first_name, last_name, email, status")
    .in("id", ids);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const results = { sent: 0, skipped: 0, errors: 0 };
  const sentIds: string[] = [];

  for (const prospect of prospects ?? []) {
    if (!prospect.email) { results.skipped++; continue; }
    if (prospect.status === "unsubscribed" || prospect.status === "invalid") {
      results.skipped++;
      continue;
    }
    try {
      await sendProspectEmail(
        prospect.email,
        `${prospect.first_name} ${prospect.last_name}`,
        subject,
        emailBody
      );
      results.sent++;
      sentIds.push(prospect.id);
    } catch (e) {
      console.error("[campaign] error sending to", prospect.email, e);
      results.errors++;
    }
  }

  // Marquer les envois réussis
  if (sentIds.length > 0) {
    await db.from("prospects").update({
      status: "contacted",
      last_contacted_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }).in("id", sentIds);
  }

  return NextResponse.json(results);
}
