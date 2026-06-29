import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { createServiceClient } from "@/lib/supabase/server";
import { Resend } from "resend";

export const dynamic = "force-dynamic";

// PATCH — block/unblock
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { blocked } = await req.json();
  const db = createServiceClient();

  await db.from("profiles").update({ blocked }).eq("id", params.id);

  if (blocked) {
    await db.auth.admin.signOut(params.id, "others");
  }

  return NextResponse.json({ ok: true });
}

// DELETE — supprimer user
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await requireAdmin();
  if (error) return error;

  const db = createServiceClient();
  await db.auth.admin.deleteUser(params.id);

  return NextResponse.json({ ok: true });
}

// POST — envoyer email
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { subject, message } = await req.json();
  const db = createServiceClient();

  const { data: profile } = await db
    .from("profiles")
    .select("email, full_name")
    .eq("id", params.id)
    .single();

  if (!profile?.email) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: "EchoScribe <support@echoscribe.fr>",
    to: profile.email,
    subject,
    html: `<p>${message.replace(/\n/g, "<br>")}</p><br><p style="color:#888;font-size:12px;">— EchoScribe Support</p>`,
  });

  return NextResponse.json({ ok: true });
}
