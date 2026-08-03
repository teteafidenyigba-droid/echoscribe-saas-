import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { sendResetPasswordEmail } from "@/lib/resend";
import crypto from "crypto";

export const dynamic = "force-dynamic";

const SECRET = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const APP_URL = "https://echoscribe.fr";

function signResetToken(userId: string, email: string): string {
  const exp = Math.floor(Date.now() / 1000) + 60 * 60; // expire dans 1h
  const payload = Buffer.from(JSON.stringify({ userId, email, exp })).toString("base64url");
  const sig = crypto.createHmac("sha256", SECRET).update(payload).digest("hex");
  return `${payload}.${sig}`;
}

export async function POST(request: NextRequest) {
  const { email } = await request.json();
  if (!email) return NextResponse.json({ success: true });

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    SECRET
  );

  // generateLink utilisé uniquement pour résoudre le userId — on n'envoie PAS l'action_link
  const { data, error } = await supabase.auth.admin.generateLink({
    type: "recovery",
    email,
  });

  if (error || !data?.user?.id) {
    console.log("[reset-password] user not found or error:", error?.message);
    return NextResponse.json({ success: true }); // ne pas révéler si l'email existe
  }

  const token = signResetToken(data.user.id, email);
  const resetUrl = `${APP_URL}/reset-password?reset_token=${token}`;

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
