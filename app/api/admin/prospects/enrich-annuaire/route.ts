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

type FHIRTelecom = { system: string; value: string; use?: string };
type FHIRAddress = { line?: string[]; city?: string; postalCode?: string };
type FHIRPractitioner = { resourceType: string; telecom?: FHIRTelecom[]; address?: FHIRAddress[] };
type FHIRBundle = { resourceType: string; entry?: { resource: FHIRPractitioner }[] };

// Essaie plusieurs formats d'URL ANS FHIR jusqu'à obtenir un résultat
async function fetchAnnuaire(rpps: string): Promise<{ phone?: string; address?: string; debug?: string } | null> {
  const urls = [
    `https://api.annuaire.sante.fr/fhir/v1/Practitioner?identifier=urn:oid:1.2.250.1.71.4.2.1%7C${rpps}`,
    `https://api.annuaire.sante.fr/fhir/v1/Practitioner?identifier=${rpps}`,
    `https://api.esante.gouv.fr/apis/annuaire-sante/v1/fhir/Practitioner?identifier=${rpps}`,
  ];

  for (const url of urls) {
    try {
      const res = await fetch(url, {
        headers: { Accept: "application/fhir+json", "Cache-Control": "no-cache" },
        signal: AbortSignal.timeout(6000),
      });
      if (!res.ok) continue;
      const bundle = await res.json() as FHIRBundle & { total?: number };
      if (!bundle.entry?.length) continue;

      const practitioner = bundle.entry[0].resource;
      const phone = practitioner.telecom
        ?.filter(t => t.system === "phone")
        .map(t => t.value)
        .find(Boolean);
      const addr = practitioner.address?.[0];
      const address = addr
        ? [addr.line?.join(" "), addr.postalCode, addr.city].filter(Boolean).join(", ")
        : undefined;

      return { phone, address };
    } catch {
      continue;
    }
  }
  return null;
}

// GET /api/admin/prospects/enrich-annuaire?debug=1 — teste l'API FHIR avec le 1er RPPS trouvé
export async function GET(request: NextRequest) {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  if (searchParams.get("debug") !== "1") {
    return NextResponse.json({ info: "Ajoutez ?debug=1 pour tester l'API FHIR" });
  }

  const db = createServiceClient();
  const { data: sample } = await db
    .from("prospects")
    .select("id, rpps_number, first_name, last_name")
    .not("rpps_number", "is", null)
    .limit(3);

  if (!sample?.length) return NextResponse.json({ error: "Aucun prospect avec RPPS" });

  const results = [];
  for (const p of sample) {
    const rpps = p.rpps_number!;
    const urlsToTest = [
      `https://api.annuaire.sante.fr/fhir/v1/Practitioner?identifier=urn:oid:1.2.250.1.71.4.2.1%7C${rpps}`,
      `https://api.annuaire.sante.fr/fhir/v1/Practitioner?identifier=${rpps}`,
      `https://api.esante.gouv.fr/apis/annuaire-sante/v1/fhir/Practitioner?identifier=urn:oid:1.2.250.1.71.4.2.1%7C${rpps}`,
    ];
    const urlResults = [];
    for (const url of urlsToTest) {
      try {
        const res = await fetch(url, {
          headers: { Accept: "application/fhir+json" },
          signal: AbortSignal.timeout(6000),
        });
        const body = await res.json();
        urlResults.push({ url, status: res.status, total: body.total, entryCount: body.entry?.length ?? 0, firstEntry: body.entry?.[0]?.resource ?? null });
      } catch (e) {
        urlResults.push({ url, error: String(e) });
      }
    }
    results.push({ rpps, name: `${p.first_name} ${p.last_name}`, urls: urlResults });
  }

  return NextResponse.json({ results });
}

// POST /api/admin/prospects/enrich-annuaire
// Body: { batch?: number, specialties?: string[] }
export async function POST(request: NextRequest) {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const batchSize = Math.min(parseInt(body.batch ?? "50"), 200);

  const db = createServiceClient();
  const { data: prospects, error } = await db
    .from("prospects")
    .select("id, rpps_number, phone")
    .is("phone", null)
    .not("rpps_number", "is", null)
    .or("specialty.ilike.%radio%,specialty.ilike.%imagerie%,specialty.ilike.%echograph%")
    .limit(batchSize);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!prospects?.length) return NextResponse.json({ enriched: 0, total: 0 });

  let enriched = 0;
  for (const p of prospects) {
    if (!p.rpps_number) continue;
    const data = await fetchAnnuaire(p.rpps_number);
    if (!data?.phone && !data?.address) continue;
    const update: Record<string, string> = { updated_at: new Date().toISOString() };
    if (data.phone) update.phone = data.phone;
    if (data.address) update.notes = data.address;
    await db.from("prospects").update(update).eq("id", p.id);
    enriched++;
  }

  return NextResponse.json({ enriched, total: prospects.length });
}
