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
</head>
<body style="margin:0;padding:0;background:#dce8f5;font-family:Georgia,serif;">

<table width="100%" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td align="center" style="background:#dce8f5;padding:40px 20px;">
      <table width="560" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;width:100%;">

        <!-- HEADER -->
        <tr>
          <td align="center" style="background:linear-gradient(135deg,#0f2440 0%,#1e3a5f 60%,#1a6aaa 100%);border-radius:20px 20px 0 0;padding:40px;">
            <table cellpadding="0" cellspacing="0" border="0" align="center">
              <tr>
                <td valign="middle" style="padding-right:10px;">
                  <img src="https://echoscribe.fr/ecg.png" width="34" height="22" alt="" style="display:block;">
                </td>
                <td valign="middle">
                  <span style="font-size:34px;font-style:italic;font-family:Georgia,'Times New Roman',serif;color:#ffffff;letter-spacing:-0.01em;">Echo</span><span style="font-size:34px;font-style:normal;font-weight:700;font-family:Georgia,'Times New Roman',serif;color:#4a9fd4;">Scribe</span>
                </td>
              </tr>
            </table>
            <div style="margin-top:12px;display:inline-block;background:rgba(125,211,252,0.15);border:1px solid rgba(125,211,252,0.3);border-radius:999px;padding:4px 16px;font-size:11px;color:#7dd3fc;letter-spacing:0.1em;font-family:monospace;">Dictée Médicale</div>
          </td>
        </tr>

        <!-- BODY -->
        <tr>
          <td style="background:#ffffff;padding:40px;border-left:1px solid #c8ddef;border-right:1px solid #c8ddef;">
            ${content}
          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td align="center" style="background:#0f2440;border-radius:0 0 20px 20px;padding:24px 40px;">
            <p style="font-size:11px;color:#4a6a8a;margin:0;font-family:monospace;line-height:2;">
              © 2026 EchoScribe · Outil d'aide à la rédaction médicale<br>
              À valider par le médecin responsable<br>
              Adresse non surveillée — merci de ne pas répondre à cet email<br>
              <a href="${APP_URL}/confidentialite" style="color:#7dd3fc;text-decoration:none;">Confidentialité</a> ·
              <a href="${APP_URL}/cgu" style="color:#7dd3fc;text-decoration:none;">CGU</a>
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

function h1(text: string) {
  return `<h1 style="font-size:24px;color:#1e3a5f;margin:0 0 16px;font-weight:700;">${text}</h1>`;
}
function p(text: string, small = false) {
  return `<p style="font-size:${small ? "13px" : "16px"};line-height:1.75;color:${small ? "#8aaac8" : "#4a6a8a"};margin:0 0 ${small ? "0" : "16px"};">${text}</p>`;
}
function btn(label: string, url: string) {
  return `<a href="${url}" style="display:block;text-align:center;background:linear-gradient(135deg,#1e3a5f,#1e5a8a);color:#ffffff;text-decoration:none;font-size:17px;font-weight:700;padding:18px 32px;border-radius:12px;margin:0 0 32px;">${label}</a>`;
}

export async function sendWelcomeEmail(to: string, name: string) {
  await getResend().emails.send({
    from: FROM, to,
    subject: "Bienvenue sur EchoScribe — votre essai de 7 jours commence",
    html: base(`
      ${h1("Bienvenue sur EchoScribe")}
      ${p(`Bonjour ${name},`)}
      ${p("Votre compte est créé. Vous bénéficiez d'un <strong style=\"color:#1e3a5f;\">essai gratuit de 7 jours</strong>, sans carte bancaire requise.")}
      ${p("EchoScribe transforme votre dictée en compte rendu d'échographie structuré en moins de <strong style=\"color:#1e3a5f;\">30 secondes</strong>, conforme aux standards de la SFR.")}
      ${btn("Accéder à l'application →", `${APP_URL}/app`)}
      ${p("Si vous avez des questions, contactez-nous via echoscribe.fr", true)}
    `),
  });
}

export async function sendTrialStartEmail(to: string, name: string, trialEnd: Date) {
  const dateStr = trialEnd.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  await getResend().emails.send({
    from: FROM, to,
    subject: "Votre essai EchoScribe est actif",
    html: base(`
      ${h1("Votre essai gratuit est actif")}
      ${p(`Bonjour ${name},`)}
      ${p(`Votre essai EchoScribe est actif jusqu'au <strong style="color:#1e3a5f;">${dateStr}</strong>.`)}
      ${p("Profitez de ces 7 jours pour générer vos comptes rendus d'échographie par dictée vocale.")}
      ${btn("Ouvrir EchoScribe →", `${APP_URL}/app`)}
    `),
  });
}

export async function sendTrialReminderEmail(to: string, name: string) {
  await getResend().emails.send({
    from: FROM, to,
    subject: "⏰ Plus que 3 jours — votre essai EchoScribe se termine bientôt",
    html: base(`
      ${h1("Plus que 3 jours d'essai")}
      ${p(`Bonjour ${name},`)}
      ${p("Votre période d'essai gratuit se termine dans <strong style=\"color:#1e3a5f;\">3 jours</strong>. Pour continuer sans interruption, choisissez votre abonnement.")}
      ${p("Vos comptes rendus et paramètres sont conservés.")}
      ${btn("Choisir mon abonnement →", `${APP_URL}/billing`)}
      ${p("Résiliable à tout moment depuis votre espace abonné.", true)}
    `),
  });
}

export async function sendTrialExpiryEmail(to: string, name: string) {
  await getResend().emails.send({
    from: FROM, to,
    subject: "Votre essai EchoScribe est terminé — continuez sans interruption",
    html: base(`
      ${h1("Votre essai gratuit est terminé")}
      ${p(`Bonjour ${name},`)}
      ${p("Votre période d'essai de 7 jours a expiré. Pour retrouver un accès immédiat, choisissez votre abonnement.")}
      ${p("Vos comptes rendus et paramètres sont conservés et accessibles dès la souscription.")}
      ${btn("Choisir mon abonnement →", `${APP_URL}/billing`)}
      ${p("Paiement sécurisé par Stripe · Résiliable à tout moment.", true)}
    `),
  });
}

export async function sendSubscriptionActiveEmail(to: string, name: string, plan: string) {
  await getResend().emails.send({
    from: FROM, to,
    subject: "✅ Votre abonnement EchoScribe est actif",
    html: base(`
      ${h1("Abonnement activé")}
      ${p(`Bonjour ${name},`)}
      ${p(`Votre abonnement <strong style="color:#1e3a5f;">${plan}</strong> est désormais actif. Vous avez accès complet à EchoScribe.`)}
      ${btn("Accéder à l'application →", `${APP_URL}/app`)}
      ${p("Vous pouvez gérer votre abonnement à tout moment depuis votre espace.", true)}
    `),
  });
}

export async function sendResetPasswordEmail(to: string, resetUrl: string) {
  await getResend().emails.send({
    from: FROM, to,
    subject: "Réinitialisation de votre mot de passe EchoScribe",
    html: base(`
      ${h1("Réinitialisation de votre mot de passe")}
      ${p("Vous avez demandé la réinitialisation de votre mot de passe EchoScribe. Cliquez sur le bouton ci-dessous pour en choisir un nouveau.")}
      ${btn("Réinitialiser mon mot de passe →", resetUrl)}
      ${p("Si vous n'avez pas demandé cette réinitialisation, ignorez cet e-mail. Ce lien expire dans 1 heure.", true)}
    `),
  });
}

export async function sendCancellationEmail(to: string, name: string, endDate: Date) {
  const dateStr = endDate.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  await getResend().emails.send({
    from: FROM, to,
    subject: "Votre abonnement EchoScribe a été annulé",
    html: base(`
      ${h1("Annulation confirmée")}
      ${p(`Bonjour ${name},`)}
      ${p(`Votre abonnement a bien été annulé. Vous conservez l'accès jusqu'au <strong style="color:#1e3a5f;">${dateStr}</strong>.`)}
      ${p("Vous pouvez vous réabonner à tout moment pour retrouver un accès immédiat.")}
      ${btn("Se réabonner →", `${APP_URL}/billing`)}
    `),
  });
}
