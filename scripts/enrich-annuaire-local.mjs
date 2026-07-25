/**
 * Script local — Enrichissement Annuaire Santé FHIR
 * Usage : node scripts/enrich-annuaire-local.mjs <prospects_export.csv>
 *
 * Entrée  : CSV exporté depuis EchoScribe (colonnes rpps_number, first_name, last_name)
 * Sortie  : enrichissement.csv (rpps_number, phone, address)
 * Upload  : bouton "Enrichir CSV" dans /admin/prospects
 */

import { createReadStream, createWriteStream } from "fs";
import { createInterface } from "readline";
import { resolve } from "path";

const INPUT  = process.argv[2];
const OUTPUT = "enrichissement.csv";
const DELAY  = 300; // ms entre chaque appel (évite le rate-limit ANS)

if (!INPUT) {
  console.error("Usage: node scripts/enrich-annuaire-local.mjs <prospects_export.csv>");
  process.exit(1);
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function fetchFHIR(rpps) {
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

    const phone = p.telecom
      ?.filter(t => t.system === "phone" || t.system === "tel")
      .map(t => t.value)
      .find(Boolean) ?? "";

    const addr = p.address?.[0];
    const address = addr
      ? [addr.line?.join(" "), addr.postalCode, addr.city].filter(Boolean).join(", ")
      : "";

    return { phone, address };
  } catch {
    return null;
  }
}

async function main() {
  const inputPath = resolve(INPUT);
  const rl = createInterface({ input: createReadStream(inputPath), crlfDelay: Infinity });

  const lines = [];
  for await (const line of rl) lines.push(line);

  if (lines.length < 2) { console.error("Fichier vide"); process.exit(1); }

  const sep = lines[0].includes(";") ? ";" : ",";
  const headers = lines[0].split(sep).map(h => h.trim().replace(/^"|"$/g, "").toLowerCase());
  const iRpps = headers.indexOf("rpps_number");

  if (iRpps === -1) { console.error("Colonne rpps_number introuvable"); process.exit(1); }

  const out = createWriteStream(OUTPUT);
  out.write("rpps_number,phone,address\n");

  const rows = lines.slice(1)
    .map(l => l.split(sep).map(c => c.trim().replace(/^"|"$/g, "")))
    .filter(c => c[iRpps]);

  console.log(`${rows.length} prospects à enrichir…`);
  let found = 0;

  for (let i = 0; i < rows.length; i++) {
    const rpps = rows[i][iRpps];
    const data = await fetchFHIR(rpps);
    if (data) {
      const phone   = (data.phone   || "").replace(/,/g, " ");
      const address = (data.address || "").replace(/,/g, " ");
      if (phone || address) {
        out.write(`${rpps},${phone},"${address}"\n`);
        found++;
      }
    }
    if ((i + 1) % 50 === 0) console.log(`  ${i + 1}/${rows.length} (${found} trouvés)`);
    await sleep(DELAY);
  }

  out.end();
  console.log(`\nTerminé : ${found}/${rows.length} enrichis → ${OUTPUT}`);
}

main();
