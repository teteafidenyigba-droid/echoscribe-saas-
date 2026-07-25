import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const HARDCODED_ADMINS = ["eliasco2018@gmail.com", "tete.afidenyigba@gmail.com", "komlanserge@hotmail.com"];
const APIFY_ACTOR = "compass~crawler-google-places";

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

type ApifyItem = {
  searchString?: string;
  title?: string;
  address?: string;
  phone?: string;
  phoneUnformatted?: string;
};

// POST { action: "start" }
// → Soumet tous les prospects sans téléphone à Apify (async), retourne runId
async function handleStart(token: string, db: ReturnType<typeof createServiceClient>) {
  const { data: prospects, error } = await db
    .from("prospects")
    .select("id, first_name, last_name, specialty, city, phone, address")
    .not("city", "is", null)
    .or("phone.is.null,phone.eq.")
    .or("specialty.ilike.%radio%,specialty.ilike.%imagerie%,specialty.ilike.%echograph%,specialty.ilike.%gynecolog%,specialty.ilike.%gynécolog%,specialty.ilike.%cardiolog%")
    .limit(10000);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!prospects?.length) return NextResponse.json({ total: 0, message: "Tous les prospects sont déjà enrichis" });

  const searchStringsArray = prospects.map(p => {
    const spec = (p.specialty ?? "médecin").split(" ").slice(0, 2).join(" ");
    return `Dr ${p.first_name} ${p.last_name} ${spec} ${p.city} France`;
  });

  // Run async Apify (non-bloquant)
  const res = await fetch(`https://api.apify.com/v2/acts/${APIFY_ACTOR}/runs?token=${token}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      searchStringsArray,
      maxCrawledPlacesPerSearch: 1,
      language: "fr",
      countryCode: "fr",
    }),
    signal: AbortSignal.timeout(15000),
  });

  if (!res.ok) {
    const txt = await res.text();
    return NextResponse.json({ error: `Apify erreur ${res.status}: ${txt.slice(0, 200)}` }, { status: 502 });
  }

  const json = await res.json() as { data?: { id: string; status: string } };
  const runId = json.data?.id;
  if (!runId) return NextResponse.json({ error: "Apify: pas de runId dans la réponse" }, { status: 502 });

  return NextResponse.json({ runId, total: prospects.length, status: "RUNNING" });
}

// POST { action: "status", runId }
// → Vérifie si le run Apify est terminé ; si oui, collecte et met à jour la DB
async function handleStatus(token: string, runId: string, db: ReturnType<typeof createServiceClient>) {
  // Vérif statut
  const statusRes = await fetch(`https://api.apify.com/v2/acts/${APIFY_ACTOR}/runs/${runId}?token=${token}`, {
    signal: AbortSignal.timeout(8000),
  });
  if (!statusRes.ok) return NextResponse.json({ error: "Apify: impossible de vérifier le statut" }, { status: 502 });

  const statusJson = await statusRes.json() as { data?: { status: string; datasetId?: string } };
  const runStatus = statusJson.data?.status ?? "UNKNOWN";

  if (runStatus === "RUNNING" || runStatus === "READY" || runStatus === "ABORTING") {
    return NextResponse.json({ done: false, status: runStatus });
  }

  if (runStatus !== "SUCCEEDED") {
    return NextResponse.json({ done: true, error: `Run terminé avec statut: ${runStatus}` });
  }

  // Run SUCCEEDED → télécharge les items du dataset
  const datasetId = statusJson.data?.datasetId;
  if (!datasetId) return NextResponse.json({ done: true, error: "Pas de datasetId" });

  const itemsRes = await fetch(
    `https://api.apify.com/v2/datasets/${datasetId}/items?token=${token}&format=json&limit=10000`,
    { signal: AbortSignal.timeout(30000) }
  );
  if (!itemsRes.ok) return NextResponse.json({ done: true, error: "Erreur téléchargement dataset" });

  const items = await itemsRes.json() as ApifyItem[];

  // Indexe par searchString
  const bySearch = new Map<string, ApifyItem>();
  for (const item of items) {
    if (item.searchString) bySearch.set(item.searchString, item);
  }

  // Recharge les prospects (même filtre)
  const { data: prospects } = await db
    .from("prospects")
    .select("id, first_name, last_name, specialty, city, phone, address")
    .not("city", "is", null)
    .or("phone.is.null,phone.eq.")
    .or("specialty.ilike.%radio%,specialty.ilike.%imagerie%,specialty.ilike.%echograph%,specialty.ilike.%gynecolog%,specialty.ilike.%gynécolog%,specialty.ilike.%cardiolog%")
    .limit(10000);

  let enriched = 0;
  for (const p of prospects ?? []) {
    const spec = (p.specialty ?? "médecin").split(" ").slice(0, 2).join(" ");
    const key = `Dr ${p.first_name} ${p.last_name} ${spec} ${p.city} France`;
    const item = bySearch.get(key);
    if (!item) continue;
    const patch: Record<string, string> = { updated_at: new Date().toISOString() };
    const phone = item.phone || item.phoneUnformatted;
    if (phone && !p.phone)     patch.phone   = phone;
    if (item.address && !p.address) patch.address = item.address;
    if (Object.keys(patch).length === 1) continue;
    await db.from("prospects").update(patch).eq("id", p.id);
    enriched++;
  }

  return NextResponse.json({ done: true, enriched, total: items.length });
}

export async function POST(request: NextRequest) {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const APIFY_TOKEN = process.env.APIFY_API_TOKEN;
  if (!APIFY_TOKEN) return NextResponse.json({ error: "APIFY_API_TOKEN non configurée dans Vercel" }, { status: 500 });

  const body = await request.json().catch(() => ({}));
  const db = createServiceClient();

  if (body.action === "start") return handleStart(APIFY_TOKEN, db);
  if (body.action === "status" && body.runId) return handleStatus(APIFY_TOKEN, body.runId, db);

  // Compat : ancien mode sync batch
  const batchSize = Math.min(parseInt(body.batch ?? "10"), 50);
  const { data: prospects, error } = await db
    .from("prospects")
    .select("id, first_name, last_name, specialty, city, phone, address")
    .not("city", "is", null)
    .or("phone.is.null,phone.eq.")
    .or("specialty.ilike.%radio%,specialty.ilike.%imagerie%,specialty.ilike.%echograph%,specialty.ilike.%gynecolog%,specialty.ilike.%gynécolog%,specialty.ilike.%cardiolog%")
    .limit(batchSize);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!prospects?.length) return NextResponse.json({ enriched: 0, total: 0 });

  const searchStringsArray = prospects.map(p => {
    const spec = (p.specialty ?? "médecin").split(" ").slice(0, 2).join(" ");
    return `Dr ${p.first_name} ${p.last_name} ${spec} ${p.city} France`;
  });

  const apifyUrl = `https://api.apify.com/v2/acts/${APIFY_ACTOR}/run-sync-get-dataset-items?token=${APIFY_TOKEN}&timeout=55&memory=256`;
  let items: ApifyItem[] = [];
  try {
    const res = await fetch(apifyUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ searchStringsArray, maxCrawledPlacesPerSearch: 1, language: "fr", countryCode: "fr" }),
      signal: AbortSignal.timeout(58000),
    });
    if (!res.ok) {
      const txt = await res.text();
      return NextResponse.json({ error: `Apify erreur ${res.status}: ${txt.slice(0, 200)}` }, { status: 502 });
    }
    items = await res.json() as ApifyItem[];
  } catch (e) {
    return NextResponse.json({ error: `Apify timeout: ${String(e).slice(0, 100)}` }, { status: 504 });
  }

  const bySearch = new Map<string, ApifyItem>();
  for (const item of items) {
    if (item.searchString) bySearch.set(item.searchString, item);
  }

  let enriched = 0;
  for (let i = 0; i < prospects.length; i++) {
    const item = bySearch.get(searchStringsArray[i]);
    if (!item) continue;
    const patch: Record<string, string> = { updated_at: new Date().toISOString() };
    const phone = item.phone || item.phoneUnformatted;
    if (phone && !prospects[i].phone)     patch.phone   = phone;
    if (item.address && !prospects[i].address) patch.address = item.address;
    if (Object.keys(patch).length === 1) continue;
    await db.from("prospects").update(patch).eq("id", prospects[i].id);
    enriched++;
  }

  return NextResponse.json({ enriched, total: prospects.length });
}
