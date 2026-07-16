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

  // Find user ID from profiles table
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", email)
    .single();

  if (profileError || !profile?.id) {
    console.log("[reset-password] no profile found for:", email);
    // Always return success to avoid email enumeration
    return NextResponse.json({ success: true });
  }

  const token = signResetToken(profile.id, email);
  const resetUrl = `${APP_URL}/reset-password?reset_token=${token}`;

  let emailResult = "not_attempted";
  try {
    await sendResetPasswordEmail(email, resetUrl);
    emailResult = "sent_ok";
  } catch (e: unknown) {
    emailResult = `error: ${e instanceof Error ? e.message : String(e)}`;
  }

  console.log(`[reset-password] userId=${profile.id} email=${email} resend=${emailResult} url_start=${resetUrl.slice(0, 80)}`);

  return NextResponse.json({ success: true });
}
