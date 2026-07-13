import PDFDocument from "pdfkit";
import { createWriteStream, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, "../docs/EchoScribe-Architecture.pdf");
mkdirSync(resolve(__dirname, "../docs"), { recursive: true });

const doc = new PDFDocument({ size: "A4", margin: 50, info: { Title: "EchoScribe — Architecture Technique", Author: "EchoScribe" } });
const stream = createWriteStream(OUT);
doc.pipe(stream);

// ── Couleurs ──────────────────────────────────────────────────────────────────
const DARK = "#0d2540";
const BLUE = "#185FA5";
const GRAY = "#5F5E5A";
const CORAL = "#993C1D";
const GREEN = "#3B6D11";
const ROW_ALT = "#F7FAFD";
const HDR_BG = "#1e3a5f";

// ── Helpers ───────────────────────────────────────────────────────────────────
const W = 495; // usable width
const LEFT = 50;

function h1(text) {
  doc.moveDown(0.5)
     .font("Helvetica-Bold").fontSize(18).fillColor(DARK).text(text, LEFT, undefined, { width: W })
     .moveDown(0.3);
  doc.moveTo(LEFT, doc.y).lineTo(LEFT + W, doc.y).strokeColor("#dce6f0").lineWidth(1).stroke();
  doc.moveDown(0.4);
}

function h2(text) {
  doc.moveDown(0.4)
     .font("Helvetica-Bold").fontSize(13).fillColor(BLUE).text(text, LEFT, undefined, { width: W })
     .moveDown(0.25);
}

function h3(text) {
  doc.font("Helvetica-Bold").fontSize(11).fillColor(GRAY).text(text, LEFT, undefined, { width: W })
     .moveDown(0.2);
}

function p(text, opts = {}) {
  const { color = DARK, size = 10, bold = false } = opts;
  doc.font(bold ? "Helvetica-Bold" : "Helvetica").fontSize(size).fillColor(color)
     .text(text, LEFT, undefined, { width: W }).moveDown(0.2);
}

function bullet(text, level = 0) {
  const indent = LEFT + level * 16;
  const x = doc.x;
  doc.font("Helvetica").fontSize(10).fillColor(DARK)
     .text(`• ${text}`, indent, undefined, { width: W - (indent - LEFT) }).moveDown(0.1);
}

function table(headers, rows, colWidths) {
  const totalW = colWidths.reduce((a, b) => a + b, 0);
  const rowH = 18;
  const cellPad = 5;

  // Header
  let x = LEFT;
  const hy = doc.y;
  headers.forEach((h, i) => {
    doc.rect(x, hy, colWidths[i], rowH).fill(HDR_BG);
    doc.font("Helvetica-Bold").fontSize(9).fillColor("#ffffff")
       .text(h, x + cellPad, hy + cellPad, { width: colWidths[i] - cellPad * 2, lineBreak: false });
    x += colWidths[i];
  });
  doc.y = hy + rowH;

  // Rows
  rows.forEach((row, ri) => {
    const rowY = doc.y;
    const bg = ri % 2 === 0 ? "#ffffff" : ROW_ALT;
    let rx = LEFT;

    // Pre-calculate row height
    let maxH = rowH;
    row.forEach((cell, ci) => {
      const lines = Math.ceil(cell.length / Math.max(1, (colWidths[ci] - 10) / 5.5));
      maxH = Math.max(maxH, lines * 12 + 8);
    });

    // Check page break
    if (rowY + maxH > doc.page.height - 80) {
      doc.addPage();
    }
    const finalY = doc.y;

    row.forEach((cell, ci) => {
      doc.rect(rx, finalY, colWidths[ci], maxH).fill(bg);
      doc.rect(rx, finalY, colWidths[ci], maxH).stroke("#dce6f0");
      const isFirst = ci === 0;
      doc.font(isFirst ? "Helvetica-Bold" : "Helvetica").fontSize(9)
         .fillColor(isFirst ? BLUE : DARK)
         .text(cell, rx + cellPad, finalY + cellPad, { width: colWidths[ci] - cellPad * 2 });
      rx += colWidths[ci];
    });
    doc.y = finalY + maxH;
  });
  doc.moveDown(0.5);
}

function sep() {
  doc.moveDown(0.3).moveTo(LEFT, doc.y).lineTo(LEFT + W, doc.y).strokeColor("#dce6f0").lineWidth(0.5).stroke().moveDown(0.3);
}

// ── PAGE DE TITRE ─────────────────────────────────────────────────────────────
doc.rect(0, 0, doc.page.width, 200).fill(DARK);
doc.font("Helvetica-Bold").fontSize(36).fillColor("#ffffff").text("EchoScribe", 0, 60, { align: "center", width: doc.page.width });
doc.font("Helvetica").fontSize(16).fillColor("#93b8d8").text("Architecture Technique Complète", 0, 105, { align: "center", width: doc.page.width });
doc.font("Helvetica").fontSize(11).fillColor("#6a8eae").text("Version production · echoscribe.fr · Juillet 2026", 0, 135, { align: "center", width: doc.page.width });

doc.rect(0, 200, doc.page.width, 60).fill("#f0f6fc");
doc.font("Helvetica").fontSize(13).fillColor(DARK).text("Dictée échographique IA — SaaS médical", 0, 225, { align: "center", width: doc.page.width });

doc.addPage();

// ── 1. STACK ──────────────────────────────────────────────────────────────────
h1("1. Stack technique");
p("EchoScribe est un SaaS médical permettant la génération automatique de comptes rendus d'échographie par dictée vocale.");
doc.moveDown(0.2);
table(
  ["Couche", "Outil / Service", "Rôle"],
  [
    ["Frontend", "Next.js 14 App Router, TypeScript", "Rendu SSR/CSR, routing App Router, API routes co-localisées"],
    ["Base de données", "Supabase (PostgreSQL) + Auth", "Stockage users, abonnements, admins. RLS. Auth email."],
    ["Déploiement", "Vercel (echoscribe.fr)", "CI/CD automatique, edge middleware, serverless"],
    ["Paiement", "Stripe Checkout + Portal + Webhooks", "Sessions paiement, portail self-service, événements signés"],
    ["Emails", "Resend (echoscribe-prod)", "6 templates HTML, domaine vérifié, from: noreply@echoscribe.fr"],
    ["App IA", "echoscribe-app.html (V5)", "HTML autonome en iframe — NE JAMAIS MODIFIER"],
    ["Relais IA", "OpenAI → Mistral → Gemini", "Fallback: OpenAI 15s → Mistral → Gemini"],
    ["Transcription", "Whisper (OpenAI)", "Audio dictée → texte médical structuré"],
  ],
  [100, 175, 220]
);

// ── 2. PARCOURS UTILISATEUR ───────────────────────────────────────────────────
h1("2. Parcours utilisateur");

h2("2.1 Inscription → Accès application");
["Formulaire /register → email de confirmation Supabase",
 "Clic lien → /api/auth/callback → essai 7j créé en BDD",
 "Redirection vers /app — iframe V5 se charge"].forEach(b => bullet(b));

h2("2.2 Connexion");
["Formulaire /login → Supabase Auth",
 "/api/auth/session-init génère cookie es_sid (session unique)",
 "Middleware vérifie session à chaque requête",
 "Autre appareil détecté → /api/auth/force-signout"].forEach(b => bullet(b));

h2("2.3 Essai expiré → Abonnement");
["Middleware détecte trial_end dépassé → redirect /billing",
 "Plan Mensuel (69€) ou Annuel (799€)",
 "/api/stripe/checkout crée session Stripe",
 "Paiement → webhook → BDD status: active → accès /app"].forEach(b => bullet(b));

h2("2.4 Génération compte rendu (V5)");
["Médecin dicte → /api/relay/whisper → transcription",
 "/api/relay/openai → compte rendu (LLM primaire, timeout 15s)",
 "Si OpenAI échoue → /api/relay/mistral (mistral-large-latest)",
 "Si Mistral échoue → /api/relay/gemini (fallback final)",
 "Compte rendu affiché — export PDF ou Word"].forEach(b => bullet(b));

// ── 3. ROUTES ─────────────────────────────────────────────────────────────────
doc.addPage();
h1("3. Routes et API");
table(
  ["Route", "Type", "Rôle"],
  [
    ["/", "Page", "Landing page marketing + vidéo démo"],
    ["/login", "Page", "Connexion Supabase — layout split"],
    ["/register", "Page", "Inscription + sélection plan"],
    ["/app", "Protégée", "Iframe V5 + topbar — accès conditionné par middleware"],
    ["/billing", "Protégée", "Gestion abonnement : plans, statut, portail Stripe"],
    ["/admin", "Admin", "Dashboard backoffice (table admins Supabase)"],
    ["/api/auth/callback", "API", "Callback email → crée essai 7j en BDD"],
    ["/api/auth/session-init", "API", "Génère cookie es_sid (session unique)"],
    ["/api/stripe/checkout", "API", "Crée session Stripe Checkout"],
    ["/api/stripe/portal", "API", "Ouvre portail client Stripe"],
    ["/api/stripe/webhook", "API", "Reçoit et vérifie événements Stripe"],
    ["/api/relay/whisper", "Relay", "Proxy transcription audio → Whisper"],
    ["/api/relay/openai", "Relay", "Génération LLM primaire (timeout 15s)"],
    ["/api/relay/mistral", "Relay", "Fallback OpenAI (mistral-large-latest)"],
    ["/api/relay/gemini", "Relay", "Fallback final"],
    ["/api/cron/trial-reminders", "Cron", "Emails rappel essai J-3 (Vercel Cron)"],
    ["/api/admin/*", "API Admin", "CRUD users, stats, abonnements, support"],
  ],
  [130, 80, 285]
);

// ── 4. MIDDLEWARE ─────────────────────────────────────────────────────────────
h1("4. Middleware de sécurité");
p("S'exécute sur chaque requête vers /app, /billing et /admin. Logique dans l'ordre :");
["1. Vérification session Supabase (cookie JWT)",
 "2. Si email dans ADMIN_EMAILS → bypass total (accès libre)",
 "3. Vérification cookie es_sid (session unique, un seul appareil)",
 "4. status = active → accès autorisé",
 "4. status = trialing + trial_end non-null + dans le futur → accès autorisé",
 "4. status = canceled + current_period_end dans le futur → accès autorisé",
 "4. Sinon → redirect /billing",
 "5. Aucune subscription en BDD → crée essai 7 jours automatiquement"].forEach(b => bullet(b));
doc.moveDown(0.3);
p("⚠️ RÈGLE CRITIQUE : trial_end DOIT être non-null pour autoriser l'accès en mode trialing.", { color: CORAL, bold: true });

// ── 5. BASE DE DONNÉES ────────────────────────────────────────────────────────
doc.addPage();
h1("5. Base de données Supabase");
table(
  ["Table", "Colonnes clés", "Rôle"],
  [
    ["profiles", "id, email, stripe_customer_id, active_session_id", "Profil utilisateur. active_session_id pour session unique."],
    ["subscriptions", "user_id, status, trial_end, current_period_end, price_id", "Abonnement. status: trialing/active/canceled/past_due."],
    ["admins", "id, email", "Liste emails admin. Lookup via service role."],
    ["relay_errors", "user_id, relay, error, created_at", "Logs erreurs relais IA."],
    ["support_messages", "email, message, status", "Messages support. status: open / closed."],
  ],
  [110, 175, 210]
);

h2("5.1 Sécurité RLS");
["RLS activé sur toutes les tables",
 "Routes API admin utilisent le Service Role Key (bypass RLS)",
 "Routes utilisateur utilisent la clé anon (RLS appliqué)"].forEach(b => bullet(b));

// ── 6. EMAILS ─────────────────────────────────────────────────────────────────
h1("6. Emails");

h2("6.1 Emails transactionnels — Resend");
p("6 emails automatiques via lib/resend.ts. Expéditeur : noreply@echoscribe.fr (adresse non surveillée).");
p("Templates HTML modifiables dans le dossier emails/ — sans toucher au code TypeScript.", { color: GREEN });
p("Layout commun : emails/base.html. Variables : {{NAME}}, {{APP_URL}}, {{TRIAL_END_DATE}}, {{PLAN}}, {{END_DATE}}.");
doc.moveDown(0.2);
table(
  ["Email", "Déclencheur", "Fichier HTML"],
  [
    ["Bienvenue", "Inscription confirmée (callback)", "emails/bienvenue.html"],
    ["Essai actif", "Webhook subscription.created (trialing)", "emails/essai-actif.html"],
    ["Rappel J-3", "Webhook trial_will_end", "emails/rappel-j3.html"],
    ["Essai expiré", "Cron /api/cron/trial-reminders", "emails/essai-expire.html"],
    ["Abonnement actif", "Webhook subscription.updated (active)", "emails/abonnement-actif.html"],
    ["Annulation", "Webhook subscription.deleted", "emails/annulation.html"],
  ],
  [110, 195, 190]
);

h2("6.2 Emails d'authentification — Supabase");
p("7 templates dans Supabase → Authentication → Email Templates. Même design que les emails Resend.");
doc.moveDown(0.2);
table(
  ["Template Supabase", "Rôle"],
  [
    ["Confirm signup", "Confirmation adresse email à l'inscription"],
    ["Invite user", "Invitation à rejoindre EchoScribe"],
    ["Magic link", "Lien de connexion sans mot de passe"],
    ["Reset password", "Réinitialisation du mot de passe"],
    ["Password changed", "Notification de changement de mot de passe"],
    ["Email address changed", "Notification de changement d'adresse email"],
    ["Change email address", "Confirmation de la nouvelle adresse email"],
  ],
  [200, 295]
);

// ── 7. APP V5 ─────────────────────────────────────────────────────────────────
doc.addPage();
h1("7. Application V5 (echoscribe-app.html)");

h2("7.1 Architecture");
["Fichier HTML autonome dans /public/echoscribe-app.html",
 "Servi statiquement par Next.js",
 "Embarqué dans /app via <iframe> dans AppClient.tsx",
 "Cache-busting : ?v=v5pro85 (incrémenter à chaque changement)"].forEach(b => bullet(b));

h2("7.2 Règle ABSOLUE — Ne jamais modifier V5");
p("INTERDICTION FORMELLE de modifier le JavaScript ou HTML de echoscribe-app.html.", { color: CORAL, bold: true });
p("Modifications autorisées uniquement :", { bold: true });
["Bloc <style> CSS injecté",
 "Scripts APRÈS le dernier </script> du fichier V5",
 "Incrémentation du numéro de version dans AppClient.tsx"].forEach(b => bullet(b));

h2("7.3 Chaîne IA");
["OpenAI GPT-4o (timeout 15s) — primaire",
 "Mistral mistral-large-latest — fallback OpenAI",
 "Gemini — fallback final",
 "Whisper OpenAI — transcription audio"].forEach(b => bullet(b));

// ── 8. VARIABLES ENV ──────────────────────────────────────────────────────────
h1("8. Variables d'environnement (toutes configurées dans Vercel)");
table(
  ["Variable", "Service", "Statut"],
  [
    ["NEXT_PUBLIC_SUPABASE_URL", "Supabase", "✓ Configuré"],
    ["NEXT_PUBLIC_SUPABASE_ANON_KEY", "Supabase", "✓ Configuré"],
    ["SUPABASE_SERVICE_ROLE_KEY", "Supabase", "✓ Configuré — NE PAS EXPOSER"],
    ["STRIPE_SECRET_KEY", "Stripe", "✓ Configuré — sk_live_..."],
    ["NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY", "Stripe", "✓ Configuré — pk_live_..."],
    ["STRIPE_WEBHOOK_SECRET", "Stripe", "✓ Configuré — whsec_..."],
    ["STRIPE_PRICE_MONTHLY", "Stripe", "✓ price_... Plan mensuel 69€"],
    ["STRIPE_PRICE_YEARLY", "Stripe", "✓ price_... Plan annuel 799€"],
    ["RESEND_API_KEY", "Resend", "✓ Clé echoscribe-prod"],
    ["RESEND_FROM_EMAIL", "Resend", "✓ EchoScribe <noreply@echoscribe.fr>"],
    ["NEXT_PUBLIC_APP_URL", "App", "✓ https://echoscribe.fr"],
    ["ADMIN_EMAILS", "App", "✓ tete.afidenyigba@gmail.com"],
  ],
  [200, 90, 205]
);

// ── 9. DÉPLOIEMENT ────────────────────────────────────────────────────────────
h1("9. Déploiement");

h2("9.1 CI/CD");
["Repository GitHub → branche main → déploiement Vercel automatique (2-3 min)",
 "Domaines : echoscribe.fr + echoscribe-saas.vercel.app"].forEach(b => bullet(b));

h2("9.2 Procédure de mise à jour");
["git add + git commit + git push origin main",
 "Vercel détecte le push et redéploie automatiquement",
 "Variables d'env : Vercel → Settings → Environment Variables → Redeploy"].forEach(b => bullet(b));

h2("9.3 Dashboard admin local");
["Lancer : node scripts/admin-dashboard.mjs",
 "Ouvre http://localhost:4242",
 "Connexion directe Supabase via Service Role Key",
 "Rafraîchissement automatique toutes les 30 secondes",
 "Onglets : utilisateurs, abonnements, erreurs, support, admins"].forEach(b => bullet(b));

h2("9.4 Tests end-to-end");
["Lancer : node scripts/test-e2e.mjs",
 "Vérifie : pages publiques (200), protégées (307), webhook Stripe",
 "URL testée : https://echoscribe.fr"].forEach(b => bullet(b));

// ── PIED DE PAGE ──────────────────────────────────────────────────────────────
const range = doc.bufferedPageRange();
for (let i = range.start; i < range.start + range.count; i++) {
  doc.switchToPage(i);
  doc.font("Helvetica").fontSize(8).fillColor(GRAY)
     .text(`EchoScribe — Architecture Technique · echoscribe.fr · Juillet 2026 · Page ${i - range.start + 1} / ${range.count}`,
           LEFT, doc.page.height - 30, { width: W, align: "center" });
}

doc.end();
stream.on("finish", () => console.log(`✅ PDF généré : ${OUT}`));
