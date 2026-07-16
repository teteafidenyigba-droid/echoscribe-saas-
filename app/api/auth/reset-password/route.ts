import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { sendResetPasswordEmail } from "@/lib/resend";
import crypto from "crypto";

export const dynamic = "force-dynamic";

const SECRET = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const APP_URL = "https://echoscribe.fr";

export function signResetToken(userId: string, email: string): string {
  const exp = Math.floor(Date.now() / 1000) + 3600; // 1h
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

  // Utilise generateLink pour trouver l'user via auth.users (pas besoin de la table profiles)
  const { data, error } = await supabase.auth.admin.generateLink({
    type: "recovery",
    email,
    options: { redirectTo: `${APP_URL}/reset-password` },
  });

  if (error || !data?.user?.id) {
    console.log("[reset-password] user not found or error:", error?.message);
    // Toujours succès pour éviter l'énumération d'emails
    return NextResponse.json({ success: true });
  }

  const userId = data.user.id;
  const token = signResetToken(userId, email);
  const resetUrl = `${APP_URL}/reset-password?reset_token=${token}`;

  let emailResult = "not_attempted";
  try {
    await sendResetPasswordEmail(email, resetUrl);
    emailResult = "sent_ok";
  } catch (e: unknown) {
    emailResult = `error: ${e instanceof Error ? e.message : String(e)}`;
  }

  console.log(`[reset-password] userId=${userId} email=${email} resend=${emailResult}`);

  return NextResponse.json({ success: true });
}
