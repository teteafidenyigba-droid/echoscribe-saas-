/**
 * EchoScribe — Script de test end-to-end
 * Usage : node scripts/test-e2e.mjs
 *
 * Nécessite : STRIPE_WEBHOOK_SECRET dans l'env local (fichier .env.local)
 * Tests couverts :
 *   1. Pages publiques accessibles (200)
 *   2. Pages protégées redirigent vers /login (302)
 *   3. Webhook Stripe — signature valide → 200
 *   4. Webhook Stripe — signature invalide → 400
 */

import crypto from "crypto";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Charger .env.local
function loadEnv() {
  try {
    const envPath = resolve(__dirname, "../.env.local");
    const lines = readFileSync(envPath, "utf-8").split("\n");
    for (const line of lines) {
      const [key, ...rest] = line.split("=");
      if (key && rest.length) process.env[key.trim()] = rest.join("=").trim();
    }
  } catch {
    console.warn("⚠️  Pas de .env.local trouvé — utilise les vars d'env système");
  }
}
loadEnv();

const BASE_URL = process.env.TEST_BASE_URL || "https://echoscribe.fr";
const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

let passed = 0;
let failed = 0;

function ok(label) {
  console.log(`  ✅ ${label}`);
  passed++;
}

function fail(label, detail = "") {
  console.log(`  ❌ ${label}${detail ? ` — ${detail}` : ""}`);
  failed++;
}

async function checkStatus(label, url, expectedStatus) {
  try {
    const res = await fetch(url, { redirect: "manual" });
    if (res.status === expectedStatus) {
      ok(`${label} → ${res.status}`);
    } else {
      fail(label, `attendu ${expectedStatus}, reçu ${res.status}`);
    }
  } catch (e) {
    fail(label, e.message);
  }
}

function buildStripeSignature(payload, secret) {
  const timestamp = Math.floor(Date.now() / 1000);
  const toSign = `${timestamp}.${payload}`;
  const hmac = crypto.createHmac("sha256", secret.replace("whsec_", "").padEnd ? secret : secret)
    .update(toSign)
    .digest("hex");
  // Stripe utilise le secret brut après whsec_ en base64
  const secretBytes = Buffer.from(secret.replace("whsec_", ""), "base64");
  const hmacCorrect = crypto.createHmac("sha256", secretBytes)
    .update(toSign)
    .digest("hex");
  return { header: `t=${timestamp},v1=${hmacCorrect}`, timestamp };
}

async function testWebhook() {
  if (!WEBHOOK_SECRET || WEBHOOK_SECRET === "whsec_") {
    fail("Webhook — STRIPE_WEBHOOK_SECRET non configuré");
    return;
  }

  const payload = JSON.stringify({
    id: "evt_test_" + Date.now(),
    type: "customer.subscription.updated",
    data: { object: { id: "sub_test", customer: "cus_test", status: "active", items: { data: [{ price: { id: "price_test", recurring: { interval: "month" } } }] }, current_period_start: Math.floor(Date.now() / 1000), current_period_end: Math.floor(Date.now() / 1000) + 2592000, trial_start: null, trial_end: null, cancel_at_period_end: false, canceled_at: null } },
    livemode: false,
  });

  const { header } = buildStripeSignature(payload, WEBHOOK_SECRET);

  // Test 1 : signature valide
  try {
    const res = await fetch(`${BASE_URL}/api/stripe/webhook`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "stripe-signature": header },
      body: payload,
    });
    // 200 = signature ok (même si customer inconnu en base)
    // 400 = signature rejetée (mauvais secret)
    if (res.status === 200) {
      ok("Webhook signature valide → 200");
    } else if (res.status === 400) {
      const text = await res.text();
      if (text.includes("Invalid signature")) {
        fail("Webhook signature valide → 400 Invalid signature (vérifier STRIPE_WEBHOOK_SECRET dans Vercel)");
      } else {
        fail("Webhook → 400", text.slice(0, 100));
      }
    } else {
      fail("Webhook signature valide", `statut inattendu ${res.status}`);
    }
  } catch (e) {
    fail("Webhook signature valide", e.message);
  }

  // Test 2 : signature invalide → doit retourner 400
  try {
    const res = await fetch(`${BASE_URL}/api/stripe/webhook`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "stripe-signature": "t=123,v1=invalide" },
      body: payload,
    });
    if (res.status === 400) {
      ok("Webhook signature invalide → 400 (rejeté correctement)");
    } else {
      fail("Webhook signature invalide", `attendu 400, reçu ${res.status}`);
    }
  } catch (e) {
    fail("Webhook signature invalide", e.message);
  }

  // Test 3 : sans signature → 400
  try {
    const res = await fetch(`${BASE_URL}/api/stripe/webhook`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
    });
    if (res.status === 400) {
      ok("Webhook sans signature → 400 (rejeté correctement)");
    } else {
      fail("Webhook sans signature", `attendu 400, reçu ${res.status}`);
    }
  } catch (e) {
    fail("Webhook sans signature", e.message);
  }
}

async function main() {
  console.log(`\n🧪 EchoScribe — Tests end-to-end`);
  console.log(`📍 URL : ${BASE_URL}\n`);

  // ── 1. Pages publiques ──────────────────────────────
  console.log("1. Pages publiques");
  await checkStatus("Landing page /", `${BASE_URL}/`, 200);
  await checkStatus("Login /login", `${BASE_URL}/login`, 200);
  await checkStatus("Register /register", `${BASE_URL}/register`, 200);
  await checkStatus("robots.txt", `${BASE_URL}/robots.txt`, 200);
  await checkStatus("sitemap.xml", `${BASE_URL}/sitemap.xml`, 200);

  // ── 2. Pages protégées ─────────────────────────────
  console.log("\n2. Pages protégées (redirigent vers /login)");
  await checkStatus("/app redirige non-connecté", `${BASE_URL}/app`, 307);
  await checkStatus("/billing redirige non-connecté", `${BASE_URL}/billing`, 307);

  // ── 3. Webhook Stripe ──────────────────────────────
  console.log("\n3. Webhook Stripe");
  await testWebhook();

  // ── Résumé ─────────────────────────────────────────
  console.log(`\n${"─".repeat(40)}`);
  console.log(`✅ ${passed} réussis   ❌ ${failed} échoués`);
  if (failed === 0) {
    console.log("🎉 Tous les tests passent — EchoScribe est prêt !\n");
  } else {
    console.log("⚠️  Corriger les tests en échec avant le lancement.\n");
    process.exit(1);
  }
}

main().catch(console.error);
