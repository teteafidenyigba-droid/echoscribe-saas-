import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export const dynamic = "force-dynamic";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "tete.afidenyigba@gmail.com";

export async function POST(req: NextRequest) {
  const { name, email, message } = await req.json();

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return NextResponse.json({ error: "Tous les champs sont requis." }, { status: 400 });
  }
  if (message.trim().length < 10) {
    return NextResponse.json({ error: "Message trop court (10 caractères min.)." }, { status: 400 });
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "EchoScribe <noreply@echoscribe.fr>",
      to: ADMIN_EMAIL,
      replyTo: email.trim(),
      subject: `[Contact] ${name.trim()}`,
      html: `
        <p><strong>Nom :</strong> ${name.trim()}</p>
        <p><strong>Email :</strong> ${email.trim()}</p>
        <hr>
        <p>${message.trim().replace(/\n/g, "<br>")}</p>
      `,
    });
  } catch (e) {
    console.error("[contact] email error:", e);
    return NextResponse.json({ error: "Erreur lors de l'envoi. Réessayez." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
