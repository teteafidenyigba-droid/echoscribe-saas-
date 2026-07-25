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

type PlacesResult = {
  places?: {
    displayName?: { text: string };
    formattedAddress?: string;
    nationalPhoneNumber?: string;
    internationalPhoneNumber?: string;
  }[];
};

async function searchPlace(query: string, apiKey: string): Promise<{ address?: string; phone?: string } | null> {
  try {
    const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "places.displayName,places.formattedAddress,places.nationalPhoneNumber,places.internationalPhoneNumber",
      },
      body: JSON.stringify({
        textQuery: query,
        languageCode: "fr",
        regionCode: "FR",
        maxResultCount: 1,
      }),
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;
    const json = await res.json() as PlacesResult;
    const place = json.places?.[0];
    if (!place) return null;
    return {
      address: place.formattedAddress,
      phone: place.nationalPhoneNumber || place.internationalPhoneNumber,
    };
  } catch {
    return null;
  }
}

// POST /api/admin/prospects/enrich-places
// Body: { batch?: number, mode?: "phone" | "address" | "both" }
export async function POST(request: NextRequest) {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const PLACES_KEY = process.env.GOOGLE_PLACES_API_KEY;
  if (!PLACES_KEY) {
    return NextResponse.json({ error: "GOOGLE_PLACES_API_KEY non configurée dans Vercel" }, { status: 500 });
  }

  const body = await request.json().catch(() => ({}));
  const batchSize = Math.min(parseInt(body.batch ?? "20"), 100);
  const mode: string = body.mode ?? "both";

  const db = createServiceClient();

  // Sélectionne les prospects sans téléphone OU sans adresse selon le mode
  let query = db.from("prospects")
    .select("id, first_name, last_name, specialty, city, phone, address")
    .not("city", "is", null);

  if (mode === "phone" || mode === "both") {
    query = query.or("phone.is.null,phone.eq.");
  }

  const { data: prospects, error } = await query
    .or("specialty.ilike.%radio%,specialty.ilike.%imagerie%,specialty.ilike.%echograph%,specialty.ilike.%gynecolog%,specialty.ilike.%gynécolog%,specialty.ilike.%cardiolog%")
    .limit(batchSize);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!prospects?.length) return NextResponse.json({ enriched: 0, total: 0 });

  let enriched = 0;
  for (const p of prospects) {
    const specialty = p.specialty?.split(" ")[0] ?? "médecin";
    const query = `Dr ${p.first_name} ${p.last_name} ${specialty} ${p.city} France`;
    const result = await searchPlace(query, PLACES_KEY);
    if (!result) continue;

    const patch: Record<string, string> = { updated_at: new Date().toISOString() };
    if (result.phone && !p.phone)     patch.phone   = result.phone;
    if (result.address && !p.address) patch.address = result.address;
    if (Object.keys(patch).length === 1) continue;

    await db.from("prospects").update(patch).eq("id", p.id);
    enriched++;
  }

  return NextResponse.json({ enriched, total: prospects.length });
}
