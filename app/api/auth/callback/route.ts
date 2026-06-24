import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { sendWelcomeEmail } from "@/lib/resend";

export const dynamic = "force-dynamic";

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

      // Start 7-day free trial in DB (no Stripe required upfront)
      const trialEnd = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      await supabase.from("subscriptions").upsert(
        {
          user_id: user.id,
          stripe_subscription_id: `local_trial_${user.id}`,
          status: "trialing",
          trial_start: new Date().toISOString(),
          trial_end: trialEnd.toISOString(),
        },
        { onConflict: "user_id" }
      );

      // Send welcome email (only if Resend is configured)
      if (process.env.RESEND_API_KEY && !process.env.RESEND_API_KEY.startsWith('re_PLACEHOLDER')) {
        try {
          await sendWelcomeEmail(user.email!, name);
        } catch {}
      }

      // Session init then redirect to app directly — no card required during trial
      return NextResponse.redirect(`${origin}/app`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
