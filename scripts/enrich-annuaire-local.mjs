/**
 * Enrichissement Google Places — script local
 * Lit dans Supabase, appelle Google Places API, met à jour directement.
 *
 * Usage : node scripts/enrich-annuaire-local.mjs <GOOGLE_PLACES_API_KEY>
 *
 * Obtenir une clé gratuite :
 * 1. console.cloud.google.com → créer projet
 * 2. APIs & Services → Enable APIs → "Places API (New)"
 * 3. Credentials → Create API Key
 * (Google offre 300$ de crédit gratuit = ~17 000 requêtes)
 */

import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PLACES_KEY = process.argv[2];

if (!PLACES_KEY) {
  console.error("Usage: node scripts/enrich-annuaire-local.mjs <GOOGLE_PLACES_API_KEY>");
  console.error("\nObtenir une clé : console.cloud.google.com → APIs & Services → Places API (New) → Credentials");
  process.exit(1);
}

// Charge .env.local
const env = {};
try {
  readFileSync(resolve(__dirname, "../.env.local"), "utf-8").split(/\r?\n/).forEach(line => {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m) env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, "");
  });
} catch {
  console.error(".env.local introuvable"); process.exit(1);
}

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY  = env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SERVICE_KEY) { console.error("SUPABASE keys manquantes dans .env.local"); process.exit(1); }

const BATCH = 50;
const DELAY = 200;
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function dbFetch(path, opts = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1${path}`, {
    ...opts,
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      "Content-Type": "application/json",
      Prefer: opts.method === "PATCH" ? "return=minimal" : "return=representation",
      ...(opts.headers || {}),
    },
  });
  return res;
}

async function searchPlace(query) {
  try {
    const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": PLACES_KEY,
        "X-Goog-FieldMask": "places.formattedAddress,places.nationalPhoneNumber",
      },
      body: JSON.stringify({ textQuery: query, languageCode: "fr", regionCode: "FR", maxResultCount: 1 }),
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) {
      const txt = await res.text();
      console.error(`Google Places erreur ${res.status}: ${txt.slice(0, 100)}`);
      return null;
    }
    const json = await res.json();
    const place = json.places?.[0];
    if (!place) return null;
    return { phone: place.nationalPhoneNumber ?? null, address: place.formattedAddress ?? null };
  } catch (e) {
    return null;
  }
}

async function main() {
  const countRes = await dbFetch(
    `/prospects?select=id&phone=is.null&rpps_number=not.is.null`,
    { headers: { Prefer: "count=exact", Range: "0-0" } }
  );
  const total = parseInt(countRes.headers.get("content-range")?.split("/")[1] ?? "0");
  console.log(`${total} prospects sans téléphone à enrichir via Google Places\n`);
  if (!total) { console.log("Rien à faire."); return; }

  let enriched = 0;
  let offset   = 0;

  while (offset < total) {
    const batchRes = await dbFetch(
      `/prospects?select=id,first_name,last_name,specialty,city,phone,address&phone=is.null&rpps_number=not.is.null&order=id&limit=${BATCH}&offset=${offset}`
    );
    const prospects = await batchRes.json();
    if (!Array.isArray(prospects) || !prospects.length) break;

    for (const p of prospects) {
      const spec  = (p.specialty ?? "médecin").split(" ").slice(0, 2).join(" ");
      const query = `Dr ${p.first_name} ${p.last_name} ${spec} ${p.city} France`;
      const data  = await searchPlace(query);
      if (!data?.phone && !data?.address) { await sleep(DELAY); continue; }

      const patch = { updated_at: new Date().toISOString() };
      if (data.phone   && !p.phone)   patch.phone   = data.phone;
      if (data.address && !p.address) patch.address = data.address;

      if (Object.keys(patch).length > 1) {
        await dbFetch(`/prospects?id=eq.${p.id}`, { method: "PATCH", body: JSON.stringify(patch) });
        enriched++;
      }
      await sleep(DELAY);
    }

    offset += prospects.length;
    process.stdout.write(`\r${offset}/${total} traités — ${enriched} enrichis`);
  }

  console.log(`\n\n✓ Terminé : ${enriched}/${total} prospects enrichis`);
}

main().catch(err => { console.error(err); process.exit(1); });
