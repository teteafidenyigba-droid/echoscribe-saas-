import { Resend } from "resend";
import { readFileSync } from "fs";
import { resolve } from "path";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY ?? "re_placeholder");
}
const FROM = process.env.RESEND_FROM_EMAIL ?? "EchoScribe <noreply@echoscribe.fr>";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://echoscribe.fr";

// Chargés une seule fois au démarrage — chemins statiques pour que Vercel les bundle
const TEMPLATES = {
  base:             readFileSync(resolve(process.cwd(), "emails/base.html"), "utf-8"),
  bienvenue:        readFileSync(resolve(process.cwd(), "emails/bienvenue.html"), "utf-8"),
  "essai-actif":    readFileSync(resolve(process.cwd(), "emails/essai-actif.html"), "utf-8"),
  "rappel-j3":      readFileSync(resolve(process.cwd(), "emails/rappel-j3.html"), "utf-8"),
  "essai-expire":   readFileSync(resolve(process.cwd(), "emails/essai-expire.html"), "utf-8"),
  "abonnement-actif": readFileSync(resolve(process.cwd(), "emails/abonnement-actif.html"), "utf-8"),
  annulation:       readFileSync(resolve(process.cwd(), "emails/annulation.html"), "utf-8"),
};

function render(templateKey: keyof typeof TEMPLATES, vars: Record<string, string>): string {
  let content = TEMPLATES[templateKey];
  for (const [key, val] of Object.entries({ ...vars, APP_URL })) {
    content = content.replaceAll(`{{${key}}}`, val);
  }
  return TEMPLATES.base
    .replace("{{APP_URL}}", APP_URL)
    .replace("{{CONTENT}}", content);
}

export async function sendWelcomeEmail(to: string, name: string) {
  await getResend().emails.send({
    from: FROM,
    to,
    subject: "Bienvenue sur EchoScribe — votre essai de 7 jours commence",
    html: render("bienvenue", { NAME: name }),
  });
}

export async function sendTrialStartEmail(to: string, name: string, trialEnd: Date) {
  const dateStr = trialEnd.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  await getResend().emails.send({
    from: FROM,
    to,
    subject: "Votre essai EchoScribe est actif",
    html: render("essai-actif", { NAME: name, TRIAL_END_DATE: dateStr }),
  });
}

export async function sendTrialReminderEmail(to: string, name: string) {
  await getResend().emails.send({
    from: FROM,
    to,
    subject: "⏰ Plus que 3 jours — votre essai EchoScribe se termine bientôt",
    html: render("rappel-j3", { NAME: name }),
  });
}

export async function sendTrialExpiryEmail(to: string, name: string) {
  await getResend().emails.send({
    from: FROM,
    to,
    subject: "Votre essai EchoScribe est terminé — continuez sans interruption",
    html: render("essai-expire", { NAME: name }),
  });
}

export async function sendSubscriptionActiveEmail(to: string, name: string, plan: string) {
  await getResend().emails.send({
    from: FROM,
    to,
    subject: "✅ Votre abonnement EchoScribe est actif",
    html: render("abonnement-actif", { NAME: name, PLAN: plan }),
  });
}

export async function sendCancellationEmail(to: string, name: string, endDate: Date) {
  const dateStr = endDate.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  await getResend().emails.send({
    from: FROM,
    to,
    subject: "Votre abonnement EchoScribe a été annulé",
    html: render("annulation", { NAME: name, END_DATE: dateStr }),
  });
}
