import { createClient, createServiceClient } from "@/lib/supabase/server";
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

      const serviceSupabase = createServiceClient();

      // Create profile
      await serviceSupabase.from("profiles").upsert({
        id: user.id,
        email: user.email,
        full_name: name,
        selected_plan: plan,
      });

      // Start 7-day free trial — check first to avoid duplicate
      const trialEnd = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      const { data: existing } = await serviceSupabase
        .from("subscriptions")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (existing) {
        // Already has a subscription row — update to trialing if inactive
        await serviceSupabase
          .from("subscriptions")
          .update({
            status: "trialing",
            trial_start: new Date().toISOString(),
            trial_end: trialEnd.toISOString(),
          })
          .eq("user_id", user.id)
          .eq("status", "inactive");
      } else {
        // New user — insert fresh trial row
        await serviceSupabase.from("subscriptions").insert({
          user_id: user.id,
          stripe_subscription_id: `local_trial_${user.id}`,
          status: "trialing",
          trial_start: new Date().toISOString(),
          trial_end: trialEnd.toISOString(),
        });
      }

      // Send welcome email
      if (process.env.RESEND_API_KEY && !process.env.RESEND_API_KEY.startsWith('re_PLACEHOLDER')) {
        try {
          await sendWelcomeEmail(user.email!, name);
        } catch {}
      }

      return NextResponse.redirect(`${origin}/app`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
