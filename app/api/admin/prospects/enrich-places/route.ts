import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

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

type ApifyItem = {
  searchString?: string;
  title?: string;
  address?: string;
  phone?: string;
  phoneUnformatted?: string;
};

// POST /api/admin/prospects/enrich-places
// Body: { batch?: number }
export async function POST(request: NextRequest) {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const APIFY_TOKEN = process.env.APIFY_API_TOKEN;
  if (!APIFY_TOKEN) {
    return NextResponse.json({ error: "APIFY_API_TOKEN non configurée dans Vercel" }, { status: 500 });
  }

  const body = await request.json().catch(() => ({}));
  const batchSize = Math.min(parseInt(body.batch ?? "10"), 50);

  const db = createServiceClient();

  // Prospects sans téléphone ET avec ville connue
  const { data: prospects, error } = await db
    .from("prospects")
    .select("id, first_name, last_name, specialty, city, phone, address")
    .not("city", "is", null)
    .or("phone.is.null,phone.eq.")
    .or("specialty.ilike.%radio%,specialty.ilike.%imagerie%,specialty.ilike.%echograph%,specialty.ilike.%gynecolog%,specialty.ilike.%gynécolog%,specialty.ilike.%cardiolog%")
    .limit(batchSize);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!prospects?.length) return NextResponse.json({ enriched: 0, total: 0 });

  // Construit les requêtes de recherche + index pour retrouver le prospect
  const searchStrings = prospects.map(p => {
    const spec = (p.specialty ?? "médecin").split(" ").slice(0, 2).join(" ");
    return `Dr ${p.first_name} ${p.last_name} ${spec} ${p.city} France`;
  });

  // Appel Apify Actor synchrone — retourne les items du dataset directement
  const apifyUrl = `https://api.apify.com/v2/acts/compass~crawler-google-places/run-sync-get-dataset-items?token=${APIFY_TOKEN}&timeout=55&memory=256`;

  let items: ApifyItem[] = [];
  try {
    const res = await fetch(apifyUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        searchStrings,
        maxCrawledPlacesPerSearch: 1,
        language: "fr",
        countryCode: "FR",
        includeHistogramData: false,
        scrapeDirectories: false,
      }),
      signal: AbortSignal.timeout(58000),
    });
    if (!res.ok) {
      const txt = await res.text();
      return NextResponse.json({ error: `Apify erreur ${res.status}: ${txt.slice(0, 200)}` }, { status: 502 });
    }
    items = await res.json() as ApifyItem[];
  } catch (e) {
    return NextResponse.json({ error: `Apify timeout ou erreur réseau: ${String(e).slice(0, 100)}` }, { status: 504 });
  }

  // Indexe les résultats par searchString pour matcher avec le prospect
  const bySearch = new Map<string, ApifyItem>();
  for (const item of items) {
    if (item.searchString) bySearch.set(item.searchString, item);
  }

  let enriched = 0;
  for (let i = 0; i < prospects.length; i++) {
    const item = bySearch.get(searchStrings[i]);
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
