import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { createServiceClient } from "@/lib/supabase/server";
import { Resend } from "resend";

export const dynamic = "force-dynamic";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { status, reply } = await req.json();
  const db = createServiceClient();

  await db.from("support_messages").update({ status }).eq("id", params.id);

  if (reply) {
    const { data: msg } = await db
      .from("support_messages")
      .select("email")
      .eq("id", params.id)
      .single();

    if (msg?.email) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: "EchoScribe Support <support@echoscribe.fr>",
        to: msg.email,
        subject: "Réponse à votre message — EchoScribe",
        html: `<p>${reply.replace(/\n/g, "<br>")}</p><br><p style="color:#888;font-size:12px;">— EchoScribe Support</p>`,
      });
    }
  }

  return NextResponse.json({ ok: true });
}
