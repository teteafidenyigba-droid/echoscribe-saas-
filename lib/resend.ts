import { Resend } from "resend";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY ?? "re_placeholder");
}
const FROM = process.env.RESEND_FROM_EMAIL ?? "EchoScribe <noreply@echoscribe.fr>";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://echoscribe.fr";

function base(content: string) {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>EchoScribe</title>
</head>
<body style="margin:0;padding:0;background:#e8f0f7;font-family:Georgia,'Times New Roman',serif;">

  <!-- Header -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#e8f0f7;">
    <tr>
      <td align="center" style="padding:32px 24px 28px;">
        <!-- Logo: ECG line + EchoScribe -->
        <table cellpadding="0" cellspacing="0" style="display:inline-table;">
          <tr>
            <td valign="middle" style="padding-right:10px;">
              <!-- ECG / heartbeat SVG -->
              <svg width="36" height="24" viewBox="0 0 36 24" xmlns="http://www.w3.org/2000/svg">
                <polyline points="0,12 6,12 9,4 12,20 15,8 18,16 21,12 36,12" fill="none" stroke="#c0392b" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </td>
            <td valign="middle">
              <span style="font-size:28px;font-style:italic;font-family:Georgia,serif;color:#1a2e44;letter-spacing:-0.3px;">Echo</span><span style="font-size:28px;font-style:normal;font-weight:700;font-family:Georgia,serif;color:#2563a8;">Scribe</span>
            </td>
          </tr>
        </table>
        <div style="margin-top:10px;display:inline-block;border:1px solid rgba(37,99,168,0.3);border-radius:999px;padding:4px 14px;font-size:11px;color:#2563a8;font-family:'Courier New',monospace;letter-spacing:0.07em;">
          IA v5 &nbsp;·&nbsp; Certifié usage médical
        </div>
      </td>
    </tr>
  </table>

  <!-- Body -->
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:0 24px 48px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:0 0 12px 12px;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          <tr>
            <td style="padding:40px 40px 32px;">
              ${content}
            </td>
          </tr>
          <tr>
            <td style="padding:0 40px 32px;border-top:1px solid #e8eef4;">
              <p style="margin:24px 0 0;font-size:11px;color:#94a3b8;font-family:'Courier New',monospace;line-height:1.8;">
                EchoScribe · Dictée échographique IA<br>
                Ce message est envoyé automatiquement, merci de ne pas y répondre.<br>
                <a href="${APP_URL}/confidentialite" style="color:#38bdf8;text-decoration:none;">Politique de confidentialité</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;
}

function btn(label: string, url: string) {
  return `<a href="${url}" style="display:inline-block;margin:20px 0 8px;padding:14px 32px;background:linear-gradient(90deg,#0a1f38,#0e3352);border-radius:8px;color:#7dd3fc;text-decoration:none;font-size:15px;font-family:Georgia,serif;">${label}</a>`;
}

function h1(text: string) {
  return `<h1 style="margin:0 0 20px;font-size:22px;font-weight:700;color:#0f172a;font-family:Georgia,serif;">${text}</h1>`;
}

function p(text: string, small = false) {
  return `<p style="margin:0 0 14px;font-size:${small ? "13px" : "15px"};line-height:1.7;color:${small ? "#64748b" : "#334155"};font-family:Georgia,serif;">${text}</p>`;
}

export async function sendWelcomeEmail(to: string, name: string) {
  await getResend().emails.send({
    from: FROM,
    to,
    subject: "Bienvenue sur EchoScribe — votre essai de 7 jours commence",
    html: base(`
      ${h1("Bienvenue sur EchoScribe")}
      ${p(`Bonjour ${name},`)}
      ${p("Votre compte est créé. Vous bénéficiez d'un <strong>essai gratuit de 7 jours</strong>, sans carte bancaire requise.")}
      ${p("EchoScribe transforme votre dictée en compte rendu d'échographie structuré en moins de <strong>30 secondes</strong>, conforme aux standards de la SFR.")}
      ${btn("Accéder à l'application →", `${APP_URL}/app`)}
      ${p("Si vous avez des questions, répondez simplement à cet email.", true)}
    `),
  });
}

export async function sendTrialReminderEmail(to: string, name: string) {
  await getResend().emails.send({
    from: FROM,
    to,
    subject: "⏰ Plus que 3 jours — votre essai EchoScribe se termine bientôt",
    html: base(`
      ${h1("Plus que 3 jours d'essai")}
      ${p(`Bonjour ${name},`)}
      ${p("Votre période d'essai gratuit se termine dans <strong>3 jours</strong>. Pour continuer à utiliser EchoScribe sans interruption, choisissez votre abonnement.")}
      ${p("Vos comptes rendus et paramètres sont conservés.")}
      ${btn("Choisir mon abonnement →", `${APP_URL}/billing`)}
      ${p("Résiliable à tout moment depuis votre espace abonné.", true)}
    `),
  });
}

export async function sendTrialExpiryEmail(to: string, name: string) {
  await getResend().emails.send({
    from: FROM,
    to,
    subject: "Votre essai EchoScribe est terminé — continuez sans interruption",
    html: base(`
      ${h1("Votre essai gratuit est terminé")}
      ${p(`Bonjour ${name},`)}
      ${p("Votre période d'essai de 7 jours a expiré aujourd'hui. Pour retrouver un accès immédiat à EchoScribe, choisissez votre abonnement ci-dessous.")}
      ${p("Vos comptes rendus et paramètres sont conservés et accessibles dès la souscription.")}
      ${btn("Choisir mon abonnement →", `${APP_URL}/billing`)}
      ${p("Paiement sécurisé par Stripe · Résiliable à tout moment.", true)}
    `),
  });
}

export async function sendTrialStartEmail(to: string, name: string, trialEnd: Date) {
  const dateStr = trialEnd.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  await getResend().emails.send({
    from: FROM,
    to,
    subject: "Votre essai EchoScribe est actif",
    html: base(`
      ${h1("Votre essai gratuit est actif")}
      ${p(`Bonjour ${name},`)}
      ${p(`Votre essai EchoScribe est actif jusqu'au <strong>${dateStr}</strong>.`)}
      ${p("Profitez de ces 7 jours pour générer vos comptes rendus d'échographie par dictée vocale.")}
      ${btn("Ouvrir EchoScribe →", `${APP_URL}/app`)}
    `),
  });
}

export async function sendSubscriptionActiveEmail(to: string, name: string, plan: string) {
  await getResend().emails.send({
    from: FROM,
    to,
    subject: "✅ Votre abonnement EchoScribe est actif",
    html: base(`
      ${h1("Abonnement activé")}
      ${p(`Bonjour ${name},`)}
      ${p(`Votre abonnement <strong>${plan}</strong> est désormais actif. Vous avez accès complet à EchoScribe.`)}
      ${btn("Accéder à l'application →", `${APP_URL}/app`)}
      ${p("Vous pouvez gérer votre abonnement à tout moment depuis votre espace.", true)}
    `),
  });
}

export async function sendCancellationEmail(to: string, name: string, endDate: Date) {
  const dateStr = endDate.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  await getResend().emails.send({
    from: FROM,
    to,
    subject: "Votre abonnement EchoScribe a été annulé",
    html: base(`
      ${h1("Annulation confirmée")}
      ${p(`Bonjour ${name},`)}
      ${p(`Votre abonnement EchoScribe a bien été annulé. Vous conservez l'accès jusqu'au <strong>${dateStr}</strong>.`)}
      ${p("Vous pouvez vous réabonner à tout moment pour retrouver un accès immédiat.")}
      ${btn("Se réabonner →", `${APP_URL}/billing`)}
    `),
  });
}
