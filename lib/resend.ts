import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY!);
const FROM = process.env.RESEND_FROM_EMAIL ?? "EchoScribe <noreply@echoscribe.fr>";

function base(content: string) {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>
  body{background:#07101e;font-family:'Georgia',serif;color:#c8d8ea;margin:0;padding:0;}
  .wrap{max-width:560px;margin:0 auto;padding:40px 24px;}
  .logo{font-size:26px;font-style:italic;color:#e2eaf5;margin-bottom:32px;}
  .logo span{font-style:normal;font-weight:700;color:#38bdf8;}
  h1{font-size:22px;color:#e2eaf5;margin:0 0 16px;}
  p{font-size:15px;line-height:1.7;color:#b0c4d8;margin:0 0 14px;}
  .btn{display:inline-block;padding:13px 28px;background:linear-gradient(90deg,#0c2840,#0e3352);border:1px solid rgba(56,189,248,0.45);border-radius:10px;color:#7dd3fc;text-decoration:none;font-size:16px;margin:8px 0 24px;}
  .divider{border:none;border-top:1px solid rgba(56,189,248,0.1);margin:28px 0;}
  .footer{font-size:11px;color:#2d4a5e;line-height:1.8;}
</style>
</head>
<body>
<div class="wrap">
  <div class="logo">Echo<span>Scribe</span></div>
  ${content}
  <hr class="divider">
  <div class="footer">EchoScribe · Dictée échographique IA<br>Ce message est envoyé automatiquement, merci de ne pas y répondre.<br>Conformément au RGPD, vos données sont traitées selon notre <a href="${process.env.NEXT_PUBLIC_APP_URL}/confidentialite" style="color:#38bdf8;">politique de confidentialité</a>.</div>
</div>
</body>
</html>`;
}

export async function sendWelcomeEmail(to: string, name: string) {
  await resend.emails.send({
    from: FROM,
    to,
    subject: "Bienvenue sur EchoScribe — votre essai de 7 jours commence",
    html: base(`
      <h1>Bienvenue, ${name} 👋</h1>
      <p>Votre compte EchoScribe est créé. Vous bénéficiez d'un <strong>essai gratuit de 7 jours</strong> — aucun débit avant la fin de la période d'essai.</p>
      <p>EchoScribe vous permet de générer des comptes rendus d'échographie structurés en 30 secondes par dictée vocale, conformément aux standards SFR.</p>
      <a class="btn" href="${process.env.NEXT_PUBLIC_APP_URL}/app">Accéder à l'application →</a>
      <p style="font-size:13px;color:#4a7a96;">Si vous avez des questions, répondez simplement à cet email.</p>
    `),
  });
}

export async function sendTrialStartEmail(to: string, name: string, trialEnd: Date) {
  const dateStr = trialEnd.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  await resend.emails.send({
    from: FROM,
    to,
    subject: "Votre essai EchoScribe est actif",
    html: base(`
      <h1>Votre essai gratuit est actif</h1>
      <p>Bonjour ${name},</p>
      <p>Votre abonnement d'essai EchoScribe est désormais actif. Il se terminera le <strong>${dateStr}</strong>.</p>
      <p>Après cette date, votre abonnement sera automatiquement activé selon le plan choisi.</p>
      <a class="btn" href="${process.env.NEXT_PUBLIC_APP_URL}/app">Ouvrir EchoScribe →</a>
    `),
  });
}

export async function sendTrialReminderEmail(to: string, name: string) {
  await resend.emails.send({
    from: FROM,
    to,
    subject: "⏰ Votre essai EchoScribe se termine dans 3 jours",
    html: base(`
      <h1>Plus que 3 jours d'essai</h1>
      <p>Bonjour ${name},</p>
      <p>Votre période d'essai gratuit se termine dans <strong>3 jours</strong>. Après cette date, votre abonnement sera automatiquement activé.</p>
      <p>Pour modifier ou annuler votre abonnement, rendez-vous dans la gestion de votre compte.</p>
      <a class="btn" href="${process.env.NEXT_PUBLIC_APP_URL}/billing">Gérer mon abonnement →</a>
    `),
  });
}

export async function sendSubscriptionActiveEmail(to: string, name: string, plan: string) {
  await resend.emails.send({
    from: FROM,
    to,
    subject: "✅ Votre abonnement EchoScribe est actif",
    html: base(`
      <h1>Abonnement activé</h1>
      <p>Bonjour ${name},</p>
      <p>Votre abonnement <strong>${plan}</strong> est désormais actif. Vous avez accès complet à EchoScribe.</p>
      <a class="btn" href="${process.env.NEXT_PUBLIC_APP_URL}/app">Accéder à l'application →</a>
    `),
  });
}

export async function sendCancellationEmail(to: string, name: string, endDate: Date) {
  const dateStr = endDate.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  await resend.emails.send({
    from: FROM,
    to,
    subject: "Votre abonnement EchoScribe a été annulé",
    html: base(`
      <h1>Annulation confirmée</h1>
      <p>Bonjour ${name},</p>
      <p>Votre abonnement EchoScribe a bien été annulé. Vous conservez l'accès jusqu'au <strong>${dateStr}</strong>.</p>
      <p>Vous pouvez vous réabonner à tout moment depuis votre espace.</p>
      <a class="btn" href="${process.env.NEXT_PUBLIC_APP_URL}/billing">Se réabonner →</a>
    `),
  });
}
