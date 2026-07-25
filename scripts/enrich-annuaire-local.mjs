/**
 * Enrichissement Annuaire Santé FHIR — script local
 * Lit directement dans Supabase, pas besoin d'exporter un CSV.
 *
 * Usage : node scripts/enrich-annuaire-local.mjs
 */

import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, "../.env.local");

// Charge .env.local
const env = {};
try {
  readFileSync(envPath, "utf-8").split(/\r?\n/).forEach(line => {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m) env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, "");
  });
} catch {
  console.error("Fichier .env.local introuvable — vérifier que tu es dans le bon dossier");
  process.exit(1);
}

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY  = env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY manquant dans .env.local");
  process.exit(1);
}

const BATCH   = 50;   // prospects par itération
const DELAY   = 300;  // ms entre chaque appel ANS
const sleep   = ms => new Promise(r => setTimeout(r, ms));

async function dbFetch(path, opts = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1${path}`, {
    ...opts,
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
      ...(opts.headers || {}),
    },
  });
  return res;
}

async function fetchANS(rpps) {
  const url = `https://api.annuaire.sante.fr/fhir/v1/Practitioner?identifier=urn:oid:1.2.250.1.71.4.2.1%7C${rpps}`;
  try {
    const res = await fetch(url, {
      headers: { Accept: "application/fhir+json" },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const bundle = await res.json();
    if (!bundle.entry?.length) return null;
    const p = bundle.entry[0].resource;
    const phone = p.telecom?.filter(t => t.system === "phone" || t.system === "tel").map(t => t.value).find(Boolean) ?? null;
    const addr  = p.address?.[0];
    const address = addr ? [addr.line?.join(" "), addr.postalCode, addr.city].filter(Boolean).join(", ") : null;
    return { phone, address };
  } catch {
    return null;
  }
}

async function main() {
  // Compte total à enrichir
  const countRes = await dbFetch(
    `/prospects?select=id&phone=is.null&rpps_number=not.is.null`,
    { headers: { Prefer: "count=exact", Range: "0-0" } }
  );
  const total = parseInt(countRes.headers.get("content-range")?.split("/")[1] ?? "0");
  console.log(`${total} prospects sans téléphone à enrichir via ANS FHIR\n`);
  if (!total) { console.log("Rien à faire."); return; }

  let enriched = 0;
  let offset   = 0;

  while (offset < total) {
    // Récupère un batch de prospects
    const batchRes = await dbFetch(
      `/prospects?select=id,rpps_number,phone,address&phone=is.null&rpps_number=not.is.null&order=id&limit=${BATCH}&offset=${offset}`
    );
    const prospects = await batchRes.json();
    if (!Array.isArray(prospects) || !prospects.length) break;

    for (const p of prospects) {
      if (!p.rpps_number) continue;
      const data = await fetchANS(p.rpps_number);
      if (!data?.phone && !data?.address) { await sleep(DELAY); continue; }

      const patch = { updated_at: new Date().toISOString() };
      if (data.phone && !p.phone)     patch.phone   = data.phone;
      if (data.address && !p.address) patch.address = data.address;

      if (Object.keys(patch).length > 1) {
        await dbFetch(`/prospects?id=eq.${p.id}`, { method: "PATCH", body: JSON.stringify(patch) });
        enriched++;
      }
      await sleep(DELAY);
    }

    offset += prospects.length;
    console.log(`${offset}/${total} traités — ${enriched} enrichis`);
  }

  console.log(`\n✓ Terminé : ${enriched}/${total} prospects enrichis avec téléphone/adresse ANS`);
}

main().catch(err => { console.error(err); process.exit(1); });
