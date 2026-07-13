import {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  HeadingLevel, AlignmentType, BorderStyle, WidthType, ShadingType,
  PageBreak, Header, Footer, PageNumber
} from "docx";
import { writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, "../docs/EchoScribe-Architecture.docx");

// ── Couleurs ──────────────────────────────────────────────────────────────────
const C = {
  blue: "185FA5",
  darkBlue: "0d2540",
  green: "3B6D11",
  amber: "854F0B",
  coral: "993C1D",
  purple: "3C3489",
  gray: "5F5E5A",
  lightBlue: "E6F1FB",
  lightGreen: "EAF3DE",
  lightAmber: "FAEEDA",
  lightGray: "F1EFE8",
  white: "FFFFFF",
  border: "dce6f0",
  rowAlt: "F7FAFD",
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function cell(text, opts = {}) {
  const { bg = C.white, color = C.darkBlue, bold = false, width = 3000, align = AlignmentType.LEFT } = opts;
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    shading: { fill: bg, type: ShadingType.CLEAR },
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1, color: C.border },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: C.border },
      left: { style: BorderStyle.SINGLE, size: 1, color: C.border },
      right: { style: BorderStyle.SINGLE, size: 1, color: C.border },
    },
    children: [new Paragraph({
      alignment: align,
      children: [new TextRun({ text, bold, color, font: "Arial", size: 20 })],
    })],
  });
}

function hCell(text, width = 3000) {
  return cell(text, { bg: "1e3a5f", color: C.white, bold: true, width });
}

function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 320, after: 160 },
    children: [new TextRun({ text, font: "Arial", size: 32, bold: true, color: C.darkBlue })],
  });
}

function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 280, after: 120 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: C.border, space: 4 } },
    children: [new TextRun({ text, font: "Arial", size: 26, bold: true, color: "185FA5" })],
  });
}

function h3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 200, after: 80 },
    children: [new TextRun({ text, font: "Arial", size: 22, bold: true, color: C.gray })],
  });
}

function p(text, opts = {}) {
  const { color = C.darkBlue, size = 20, bold = false, italic = false, spacing = 160 } = opts;
  return new Paragraph({
    spacing: { after: spacing },
    children: [new TextRun({ text, font: "Arial", size, color, bold, italic })],
  });
}

function bullet(text, level = 0) {
  return new Paragraph({
    bullet: { level },
    spacing: { after: 80 },
    children: [new TextRun({ text, font: "Arial", size: 20, color: C.darkBlue })],
  });
}

function badge(text, bg, color) {
  return new TextRun({ text: ` ${text} `, font: "Arial", size: 18, bold: true, color, highlight: undefined });
}

function spacer(n = 1) {
  return Array.from({ length: n }, () => new Paragraph({ spacing: { after: 80 }, children: [] }));
}

function separator() {
  return new Paragraph({
    spacing: { before: 160, after: 160 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: C.border, space: 1 } },
    children: [],
  });
}

// ── Tables ────────────────────────────────────────────────────────────────────
function stackTable() {
  const W = 9000;
  const cols = [2000, 3500, 3500];
  const rows = [
    ["Frontend", "Next.js 14 App Router, React Server Components, TypeScript", "Rendu hybride SSR/CSR, routing App Router, pages et API co-localisées"],
    ["Base de données", "Supabase (PostgreSQL) + Auth", "Stockage utilisateurs, abonnements, admins. RLS pour sécurité. Auth email."],
    ["Déploiement", "Vercel (echoscribe.fr)", "CI/CD automatique sur git push, edge middleware, fonctions serverless"],
    ["Paiement", "Stripe Checkout + Portal + Webhooks", "Sessions de paiement, portail self-service, événements signés (whsec_)"],
    ["Emails", "Resend (echoscribe-prod)", "6 templates HTML, domaine vérifié, from: noreply@echoscribe.fr"],
    ["App IA", "echoscribe-app.html (V5)", "App HTML autonome servie statiquement, embarquée en iframe, NE PAS MODIFIER"],
    ["Relais IA", "OpenAI → Mistral → Gemini", "Chaîne de fallback : OpenAI 15s → Mistral → Gemini (ultime recours)"],
    ["Transcription", "Whisper (OpenAI)", "Transcription audio dictée → texte médical structuré"],
  ];
  return new Table({
    width: { size: W, type: WidthType.DXA },
    columnWidths: cols,
    rows: [
      new TableRow({ children: [hCell("Couche", cols[0]), hCell("Outil / Service", cols[1]), hCell("Rôle", cols[2])], tableHeader: true }),
      ...rows.map((r, i) => new TableRow({
        children: r.map((t, j) => cell(t, { width: cols[j], bg: i % 2 === 0 ? C.white : C.rowAlt, bold: j === 0 })),
      })),
    ],
  });
}

function routesTable() {
  const W = 9000;
  const cols = [2800, 1400, 4800];
  const rows = [
    ["/", "Page", "Landing page marketing + vidéo démo YouTube"],
    ["/login", "Page", "Connexion Supabase — layout split (image médicale gauche / formulaire droite)"],
    ["/register", "Page", "Inscription + sélection plan — même layout que login"],
    ["/app", "Page protégée", "Iframe V5 echoscribe-app.html + topbar. Accès conditionné par middleware."],
    ["/billing", "Page protégée", "Gestion abonnement : plans, statut, portail Stripe"],
    ["/admin", "Page admin", "Dashboard backoffice (table admins Supabase requis)"],
    ["/api/auth/callback", "API", "Callback Supabase email → crée essai 7j en BDD"],
    ["/api/auth/session-init", "API", "Génère cookie es_sid (session unique, un seul appareil)"],
    ["/api/auth/force-signout", "API", "Déconnexion forcée si autre appareil détecté"],
    ["/api/stripe/checkout", "API", "Crée session Stripe Checkout et retourne l'URL"],
    ["/api/stripe/portal", "API", "Ouvre portail client Stripe (gérer / résilier)"],
    ["/api/stripe/webhook", "API", "Reçoit et vérifie événements Stripe → met à jour BDD"],
    ["/api/relay/whisper", "Relay", "Proxy transcription audio → Whisper OpenAI"],
    ["/api/relay/openai", "Relay", "Génération compte rendu (LLM primaire, timeout 15s)"],
    ["/api/relay/mistral", "Relay", "Fallback OpenAI (mistral-large-latest)"],
    ["/api/relay/gemini", "Relay", "Fallback final"],
    ["/api/relay/groq", "Relay", "Relay Groq (non utilisé dans la cascade V5)"],
    ["/api/cron/trial-reminders", "Cron", "Emails rappel essai J-3 (déclenché par Vercel Cron)"],
    ["/api/admin/*", "API Admin", "CRUD users, stats, abonnements, support, admins"],
  ];
  return new Table({
    width: { size: W, type: WidthType.DXA },
    columnWidths: cols,
    rows: [
      new TableRow({ children: [hCell("Route", cols[0]), hCell("Type", cols[1]), hCell("Rôle", cols[2])], tableHeader: true }),
      ...rows.map((r, i) => new TableRow({
        children: r.map((t, j) => cell(t, { width: cols[j], bg: i % 2 === 0 ? C.white : C.rowAlt, bold: j === 0, color: j === 0 ? "185FA5" : C.darkBlue })),
      })),
    ],
  });
}

function dbTable() {
  const W = 9000;
  const cols = [2000, 2000, 5000];
  const tables = [
    ["profiles", "id, email, full_name, stripe_customer_id, active_session_id, blocked, created_at", "Profil utilisateur. stripe_customer_id lié à Stripe. active_session_id pour session unique."],
    ["subscriptions", "id, user_id, stripe_subscription_id, stripe_customer_id, status, trial_start, trial_end, current_period_start, current_period_end, price_id, cancel_at_period_end, canceled_at", "Abonnement par utilisateur. status: trialing / active / canceled / past_due. trial_end DOIT être non-null pour accès en essai."],
    ["admins", "id, email, created_at", "Liste des emails admin. Lookup via service role (bypass RLS)."],
    ["relay_errors", "id, user_id, relay, error, created_at", "Logs d'erreurs des relais IA (Groq, Gemini, OpenAI, Whisper)."],
    ["support_messages", "id, email, message, status, created_at", "Messages support utilisateurs. status: open / closed."],
  ];
  return new Table({
    width: { size: W, type: WidthType.DXA },
    columnWidths: cols,
    rows: [
      new TableRow({ children: [hCell("Table", cols[0]), hCell("Colonnes", cols[1]), hCell("Rôle & notes", cols[2])], tableHeader: true }),
      ...tables.map((r, i) => new TableRow({
        children: r.map((t, j) => cell(t, { width: cols[j], bg: i % 2 === 0 ? C.white : C.rowAlt, bold: j === 0, color: j === 0 ? "185FA5" : C.darkBlue })),
      })),
    ],
  });
}

function emailsResendTable() {
  const W = 9000;
  const cols = [2200, 2800, 4000];
  const emails = [
    ["Bienvenue", "Inscription confirmée (/api/auth/callback)", "sendWelcomeEmail() — emails/bienvenue.html"],
    ["Essai actif", "Webhook subscription.created (trialing)", "sendTrialStartEmail() — emails/essai-actif.html"],
    ["Rappel J-3", "Webhook trial_will_end", "sendTrialReminderEmail() — emails/rappel-j3.html"],
    ["Essai expiré", "Cron /api/cron/trial-reminders", "sendTrialExpiryEmail() — emails/essai-expire.html"],
    ["Abonnement actif", "Webhook subscription.updated (active)", "sendSubscriptionActiveEmail() — emails/abonnement-actif.html"],
    ["Annulation", "Webhook subscription.deleted", "sendCancellationEmail() — emails/annulation.html"],
  ];
  return new Table({
    width: { size: W, type: WidthType.DXA },
    columnWidths: cols,
    rows: [
      new TableRow({ children: [hCell("Email", cols[0]), hCell("Déclencheur", cols[1]), hCell("Fichier HTML (modifiable)", cols[2])], tableHeader: true }),
      ...emails.map((r, i) => new TableRow({
        children: r.map((t, j) => cell(t, { width: cols[j], bg: i % 2 === 0 ? C.white : C.rowAlt, bold: j === 0 })),
      })),
    ],
  });
}

function emailsSupabaseTable() {
  const W = 9000;
  const cols = [2500, 6500];
  const emails = [
    ["Confirm signup", "Email de confirmation à l'inscription — lien {{ .ConfirmationURL }}"],
    ["Invite user", "Invitation à rejoindre EchoScribe — lien {{ .ConfirmationURL }}"],
    ["Magic link", "Lien de connexion sans mot de passe — lien {{ .ConfirmationURL }}"],
    ["Reset password", "Réinitialisation du mot de passe — lien {{ .ConfirmationURL }}"],
    ["Password changed", "Notification de changement de mot de passe"],
    ["Email address changed", "Notification de changement d'adresse email"],
    ["Change email address", "Confirmation de la nouvelle adresse email — lien {{ .ConfirmationURL }}"],
  ];
  return new Table({
    width: { size: W, type: WidthType.DXA },
    columnWidths: cols,
    rows: [
      new TableRow({ children: [hCell("Template Supabase", cols[0]), hCell("Rôle", cols[1])], tableHeader: true }),
      ...emails.map((r, i) => new TableRow({
        children: r.map((t, j) => cell(t, { width: cols[j], bg: i % 2 === 0 ? C.white : C.rowAlt, bold: j === 0 })),
      })),
    ],
  });
}

function envTable() {
  const W = 9000;
  const cols = [3500, 1800, 3700];
  const vars = [
    ["NEXT_PUBLIC_SUPABASE_URL", "Supabase", "✓ Configuré"],
    ["NEXT_PUBLIC_SUPABASE_ANON_KEY", "Supabase", "✓ Configuré"],
    ["SUPABASE_SERVICE_ROLE_KEY", "Supabase", "✓ Configuré — NE PAS EXPOSER côté client"],
    ["STRIPE_SECRET_KEY", "Stripe", "✓ Configuré — clé sk_live_..."],
    ["NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY", "Stripe", "✓ Configuré — clé pk_live_..."],
    ["STRIPE_WEBHOOK_SECRET", "Stripe", "✓ Configuré — whsec_... (Workbench Stripe)"],
    ["STRIPE_PRICE_MONTHLY", "Stripe", "✓ price_... Plan mensuel 69€"],
    ["STRIPE_PRICE_YEARLY", "Stripe", "✓ price_... Plan annuel 799€"],
    ["RESEND_API_KEY", "Resend", "✓ Clé echoscribe-prod (Full access)"],
    ["RESEND_FROM_EMAIL", "Resend", "✓ EchoScribe <noreply@echoscribe.fr>"],
    ["NEXT_PUBLIC_APP_URL", "App", "✓ https://echoscribe.fr"],
    ["ADMIN_EMAILS", "App", "✓ tete.afidenyigba@gmail.com (bypass middleware)"],
  ];
  return new Table({
    width: { size: W, type: WidthType.DXA },
    columnWidths: cols,
    rows: [
      new TableRow({ children: [hCell("Variable", cols[0]), hCell("Service", cols[1]), hCell("Statut", cols[2])], tableHeader: true }),
      ...vars.map((r, i) => new TableRow({
        children: r.map((t, j) => cell(t, { width: cols[j], bg: i % 2 === 0 ? C.white : C.rowAlt, bold: j === 0, color: j === 0 ? "185FA5" : j === 2 ? "3B6D11" : C.darkBlue })),
      })),
    ],
  });
}

// ── Document ──────────────────────────────────────────────────────────────────
const doc = new Document({
  styles: {
    default: { document: { run: { font: "Arial", size: 20, color: C.darkBlue } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 32, bold: true, font: "Arial", color: C.darkBlue },
        paragraph: { spacing: { before: 320, after: 160 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 26, bold: true, font: "Arial", color: "185FA5" },
        paragraph: { spacing: { before: 280, after: 120 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 22, bold: true, font: "Arial", color: C.gray },
        paragraph: { spacing: { before: 200, after: 80 }, outlineLevel: 2 } },
    ],
  },
  sections: [{
    properties: {
      page: { size: { width: 11906, height: 16838 }, margin: { top: 1134, bottom: 1134, left: 1134, right: 1134 } },
    },
    headers: {
      default: new Header({ children: [new Paragraph({
        alignment: AlignmentType.RIGHT,
        children: [new TextRun({ text: "EchoScribe — Architecture Technique", font: "Arial", size: 18, color: C.gray, italics: true })],
      })] }),
    },
    footers: {
      default: new Footer({ children: [new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({ text: "Page ", font: "Arial", size: 18, color: C.gray }),
          new TextRun({ children: [PageNumber.CURRENT], font: "Arial", size: 18, color: C.gray }),
          new TextRun({ text: " / ", font: "Arial", size: 18, color: C.gray }),
          new TextRun({ children: [PageNumber.TOTAL_PAGES], font: "Arial", size: 18, color: C.gray }),
        ],
      })] }),
    },
    children: [

      // ── PAGE DE TITRE ──────────────────────────────────────────────────────
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 1440, after: 240 },
        children: [new TextRun({ text: "EchoScribe", font: "Georgia", size: 72, bold: true, color: "185FA5" })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 120 },
        children: [new TextRun({ text: "Architecture Technique Complète", font: "Arial", size: 36, color: C.gray })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 480 },
        children: [new TextRun({ text: "Version production · echoscribe.fr · Juillet 2026", font: "Arial", size: 22, color: C.gray, italics: true })],
      }),
      separator(),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 240, after: 240 },
        children: [new TextRun({ text: "Dictée échographique IA — SaaS médical", font: "Arial", size: 24, color: C.darkBlue })],
      }),
      new Paragraph({ children: [new PageBreak()] }),

      // ── 1. STACK ───────────────────────────────────────────────────────────
      h1("1. Stack technique"),
      p("EchoScribe est un SaaS médical permettant la génération automatique de comptes rendus d'échographie par dictée vocale. Voici les technologies utilisées et leurs rôles :"),
      ...spacer(),
      stackTable(),
      ...spacer(2),

      // ── 2. PARCOURS UTILISATEUR ────────────────────────────────────────────
      h1("2. Parcours utilisateur"),

      h2("2.1 Inscription → Accès application"),
      bullet("Utilisateur remplit le formulaire /register (nom, email, mot de passe)"),
      bullet("Supabase envoie un email de confirmation"),
      bullet("Clic sur le lien → /api/auth/callback"),
      bullet("Callback crée un essai gratuit 7 jours en base de données"),
      bullet("Redirection vers /app — l'iframe V5 se charge"),
      ...spacer(),

      h2("2.2 Connexion"),
      bullet("Formulaire /login → Supabase Auth"),
      bullet("/api/auth/session-init génère un cookie es_sid (session unique)"),
      bullet("Middleware vérifie la session à chaque requête"),
      bullet("Si autre appareil détecté → /api/auth/force-signout"),
      ...spacer(),

      h2("2.3 Essai expiré → Abonnement"),
      bullet("Middleware détecte trial_end dépassé → redirect /billing"),
      bullet("Utilisateur choisit plan (Mensuel 69€ ou Annuel 799€)"),
      bullet("/api/stripe/checkout crée une session Stripe"),
      bullet("Paiement effectué → Stripe envoie webhook à /api/stripe/webhook"),
      bullet("Webhook vérifié (signature whsec_) → BDD mise à jour (status: active)"),
      bullet("Accès /app débloqué"),
      ...spacer(),

      h2("2.4 Génération de compte rendu (dans l'app V5)"),
      bullet("Médecin dicte via microphone"),
      bullet("/api/relay/whisper → transcription audio → texte"),
      bullet("/api/relay/openai → génération compte rendu (LLM primaire, timeout 15s)"),
      bullet("Si OpenAI échoue → /api/relay/mistral (mistral-large-latest)"),
      bullet("Si Mistral échoue → /api/relay/gemini (fallback final)"),
      bullet("Compte rendu affiché — export PDF ou Word disponible"),
      ...spacer(2),

      // ── 3. ROUTES ──────────────────────────────────────────────────────────
      h1("3. Routes et API"),
      routesTable(),
      ...spacer(2),

      // ── 4. MIDDLEWARE ──────────────────────────────────────────────────────
      new Paragraph({ children: [new PageBreak()] }),
      h1("4. Middleware de sécurité"),
      p("Le middleware s'exécute sur chaque requête vers /app, /billing et /admin. Logique dans l'ordre :"),
      ...spacer(),
      bullet("1. Vérification session Supabase (cookie JWT)"),
      bullet("2. Si email dans ADMIN_EMAILS → bypass total (accès libre)"),
      bullet("3. Vérification cookie es_sid (session unique, un seul appareil)"),
      bullet("4. Chargement subscription en base :"),
      bullet("status = active → accès autorisé", 1),
      bullet("status = trialing + trial_end != null + dans le futur → accès autorisé", 1),
      bullet("status = canceled + current_period_end dans le futur → accès autorisé", 1),
      bullet("Sinon → redirect /billing", 1),
      bullet("5. Aucune subscription en BDD → crée essai 7 jours automatiquement"),
      ...spacer(),

      p("⚠️ Règle critique : trial_end DOIT être non-null pour autoriser l'accès en mode trialing. Un trial_end null = pas d'accès (bug corrigé en juillet 2026).", { color: C.coral, bold: true }),
      ...spacer(2),

      // ── 5. BASE DE DONNÉES ─────────────────────────────────────────────────
      h1("5. Base de données Supabase"),
      dbTable(),
      ...spacer(),

      h2("5.1 Sécurité RLS"),
      bullet("RLS activé sur toutes les tables"),
      bullet("Les routes API admin utilisent le Service Role Key (bypass RLS)"),
      bullet("Les routes utilisateur utilisent la clé anon (RLS appliqué)"),
      bullet("Table admins : policies admin_only + admins_no_public_access"),
      ...spacer(2),

      // ── 6. EMAILS ──────────────────────────────────────────────────────────
      h1("6. Emails"),

      h2("6.1 Emails transactionnels — Resend"),
      p("6 emails automatiques via lib/resend.ts. Expéditeur : noreply@echoscribe.fr (adresse non surveillée)."),
      p("Les templates HTML sont dans le dossier emails/ — modifiables directement sans toucher au code TypeScript.", { color: C.green }),
      p("Layout commun : emails/base.html (header logo + footer). Variables : {{NAME}}, {{APP_URL}}, {{TRIAL_END_DATE}}, {{PLAN}}, {{END_DATE}}."),
      ...spacer(),
      emailsResendTable(),
      ...spacer(2),

      h2("6.2 Emails d'authentification — Supabase"),
      p("7 templates configurés dans Supabase → Authentication → Email Templates. Même design que les emails Resend."),
      ...spacer(),
      emailsSupabaseTable(),
      ...spacer(2),

      // ── 7. APP V5 ──────────────────────────────────────────────────────────
      new Paragraph({ children: [new PageBreak()] }),
      h1("7. Application V5 (echoscribe-app.html)"),

      h2("7.1 Architecture"),
      bullet("Fichier HTML autonome dans /public/echoscribe-app.html"),
      bullet("Servi statiquement par Next.js"),
      bullet("Embarqué dans /app/app/AppClient.tsx via une balise <iframe>"),
      bullet("Cache-busting : paramètre ?v=v5pro85 (incrémenter à chaque changement)"),
      ...spacer(),

      h2("7.2 Règle ABSOLUE — Ne jamais modifier V5"),
      p("⚠️ INTERDICTION FORMELLE de modifier le JavaScript ou le HTML de echoscribe-app.html.", { color: C.coral, bold: true }),
      p("Toute modification directe risque de casser la logique métier (transcription, génération, fallback IA).", { color: C.coral }),
      ...spacer(),
      p("Modifications autorisées :", { bold: true }),
      bullet("CSS-only via un bloc <style> injecté"),
      bullet("Scripts injectés APRÈS le dernier </script> du fichier V5"),
      bullet("Incrémentation du numéro de version dans AppClient.tsx"),
      ...spacer(),

      h2("7.3 Chaîne IA"),
      bullet("OpenAI GPT-4o (timeout 15s) — primaire"),
      bullet("Mistral mistral-large-latest — fallback OpenAI"),
      bullet("Gemini — fallback final"),
      bullet("Whisper OpenAI — transcription audio"),
      ...spacer(2),

      // ── 8. VARIABLES ENV ───────────────────────────────────────────────────
      h1("8. Variables d'environnement"),
      envTable(),
      ...spacer(2),

      // ── 9. DÉPLOIEMENT ─────────────────────────────────────────────────────
      h1("9. Déploiement"),

      h2("9.1 CI/CD"),
      bullet("Repository GitHub : teteafidenyigba-droid/echoscribe-saas-"),
      bullet("Branche main → déploiement automatique Vercel (~2-3 minutes)"),
      bullet("Domaines : echoscribe.fr + echoscribe-saas.vercel.app"),
      ...spacer(),

      h2("9.2 Procédure de mise à jour"),
      bullet("1. Modifier les fichiers source"),
      bullet("2. git add + git commit + git push origin main"),
      bullet("3. Vercel détecte le push et redéploie automatiquement"),
      bullet("4. Pour les variables d'env : modifier dans Vercel → Settings → Redeploy"),
      ...spacer(),

      h2("9.3 Dashboard admin local"),
      bullet("Script : node scripts/admin-dashboard.mjs"),
      bullet("Ouvre http://localhost:4242 dans le navigateur"),
      bullet("Connexion directe à Supabase via Service Role Key"),
      bullet("Rafraîchissement automatique toutes les 30 secondes"),
      bullet("Données : utilisateurs, abonnements (actifs/essais/expirés), erreurs, support"),
      ...spacer(),

      h2("9.4 Script de test end-to-end"),
      bullet("Script : node scripts/test-e2e.mjs"),
      bullet("Vérifie : pages publiques (200), pages protégées (307), webhook Stripe"),
      bullet("URL testée : https://echoscribe.fr"),

    ],
  }],
});

// ── Export ────────────────────────────────────────────────────────────────────
import { mkdirSync } from "fs";
mkdirSync(resolve(__dirname, "../docs"), { recursive: true });

Packer.toBuffer(doc).then(buf => {
  writeFileSync(OUT, buf);
  console.log(`✅ Document généré : ${OUT}`);
});
