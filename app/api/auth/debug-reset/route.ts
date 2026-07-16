import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Endpoint temporaire de diagnostic — à supprimer après debug
export async function GET(request: NextRequest) {
  const email = new URL(request.url).searchParams.get("email");
  if (!email) return NextResponse.json({ error: "?email= requis" });

  const results: Record<string, unknown> = {
    env: {
      supabase_url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      service_role_key: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      resend_api_key: !!process.env.RESEND_API_KEY,
      resend_from: process.env.RESEND_FROM_EMAIL ?? "(non défini)",
    },
  };

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error } = await supabase.auth.admin.generateLink({
      type: "recovery",
      email,
      options: { redirectTo: "https://echoscribe.fr/reset-password" },
    });

    results.generateLink = {
      ok: !error && !!data?.user?.id,
      userId: data?.user?.id ?? null,
      error: error?.message ?? null,
    };
  } catch (e) {
    results.generateLink = { ok: false, error: String(e) };
  }

  if ((results.generateLink as { ok: boolean }).ok) {
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);
      const { error } = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL ?? "EchoScribe <noreply@echoscribe.fr>",
        to: email,
        subject: "[DEBUG] Test envoi email EchoScribe",
        html: "<p>Test de diagnostic — si vous recevez ceci, Resend fonctionne.</p>",
      });
      results.resend = { ok: !error, error: error?.message ?? null };
    } catch (e) {
      results.resend = { ok: false, error: String(e) };
    }
  }

  return NextResponse.json(results, { status: 200 });
}
