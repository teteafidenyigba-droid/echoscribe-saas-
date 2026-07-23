import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { sendResetPasswordEmail } from "@/lib/resend";

export const dynamic = "force-dynamic";

const SECRET = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const APP_URL = "https://echoscribe.fr";

export async function POST(request: NextRequest) {
  const { email } = await request.json();
  if (!email) return NextResponse.json({ success: true });

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    SECRET
  );

  // generateLink retourne un action_link via supabase.co (domaine de confiance pour Yahoo/Outlook)
  // Après vérification OTP, Supabase redirige vers /api/auth/callback?next=/reset-password
  const { data, error } = await supabase.auth.admin.generateLink({
    type: "recovery",
    email,
    options: { redirectTo: `${APP_URL}/api/auth/callback?next=/reset-password` },
  });

  if (error || !data?.user?.id || !data?.properties?.action_link) {
    console.log("[reset-password] user not found or error:", error?.message);
    return NextResponse.json({ success: true });
  }

  // Le lien dans l'email passe par supabase.co → Yahoo/Outlook l'acceptent toujours
  const resetUrl = data.properties.action_link;

  let emailResult = "not_attempted";
  try {
    await sendResetPasswordEmail(email, resetUrl);
    emailResult = "sent_ok";
  } catch (e: unknown) {
    emailResult = `error: ${e instanceof Error ? e.message : String(e)}`;
  }

  console.log(`[reset-password] email=${email} resend=${emailResult}`);

  return NextResponse.json({ success: true });
}
