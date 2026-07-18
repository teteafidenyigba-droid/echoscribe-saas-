import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/server";
import { Resend } from "resend";

export const dynamic = "force-dynamic";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "tete.afidenyigba@gmail.com";

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  const { subject, category, message } = await req.json();
  if (!subject?.trim() || !message?.trim()) {
    return NextResponse.json({ error: "Sujet et message requis." }, { status: 400 });
  }
  if (message.trim().length < 10) {
    return NextResponse.json({ error: "Message trop court (10 caractères min.)." }, { status: 400 });
  }

  const db = createServiceClient();

  const { data: profile } = await db
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  const name = profile?.full_name ?? user.email ?? "";

  // Tentative avec toutes les colonnes (migration appliquée)
  let { error: dbErr } = await db.from("support_messages").insert({
    user_id: user.id,
    email: user.email,
    name,
    subject: subject.trim(),
    category: category ?? "autre",
    message: `[${category ?? "autre"}] ${subject.trim()}\n\n${message.trim()}`,
    status: "open",
  });

  // Fallback : colonnes de base uniquement (si migration pas encore appliquée)
  if (dbErr) {
    console.warn("[support] full insert failed, trying minimal:", dbErr.message);
    const fallback = await db.from("support_messages").insert({
      email: user.email,
      message: `[${category ?? "autre"}] ${subject.trim()}\n\n${message.trim()}`,
      status: "open",
    });
    dbErr = fallback.error;
  }

  if (dbErr) {
    console.error("[support] insert error:", dbErr.message);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "EchoScribe <noreply@echoscribe.fr>",
      to: ADMIN_EMAIL,
      subject: `[Support] ${subject.trim()}`,
      html: `
        <p><strong>De :</strong> ${name} (${user.email})</p>
        <p><strong>Catégorie :</strong> ${category ?? "autre"}</p>
        <p><strong>Sujet :</strong> ${subject.trim()}</p>
        <hr>
        <p>${message.trim().replace(/\n/g, "<br>")}</p>
        <hr>
        <p style="color:#888;font-size:12px;">
          Répondez via le panneau admin : <a href="https://echoscribe.fr/admin">echoscribe.fr/admin</a>
        </p>
      `,
    });
  } catch (e) {
    console.error("[support] email error:", e);
  }

  return NextResponse.json({ ok: true });
}
