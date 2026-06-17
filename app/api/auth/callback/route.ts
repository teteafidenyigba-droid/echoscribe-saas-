import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { sendWelcomeEmail } from "@/lib/resend";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const plan = searchParams.get("plan") ?? "monthly";

  if (code) {
    const supabase = createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && data.user) {
      const user = data.user;
      const name = user.user_metadata?.full_name ?? user.email ?? "";

      // Create profile
      await supabase.from("profiles").upsert({
        id: user.id,
        email: user.email,
        full_name: name,
        selected_plan: plan,
      });

      // Send welcome email (only if Resend is configured)
      if (process.env.RESEND_API_KEY && !process.env.RESEND_API_KEY.startsWith('re_PLACEHOLDER')) {
        try {
          await sendWelcomeEmail(user.email!, name);
        } catch {}
      }

      return NextResponse.redirect(`${origin}/billing?welcome=1&plan=${plan}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
