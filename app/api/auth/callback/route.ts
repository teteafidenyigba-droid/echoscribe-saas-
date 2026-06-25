import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { sendWelcomeEmail } from "@/lib/resend";

export const dynamic = "force-dynamic";

async function createTrialSubscription(userId: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const trialEnd = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  const trialStart = new Date().toISOString();

  await fetch(`${supabaseUrl}/rest/v1/subscriptions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": serviceKey,
      "Authorization": `Bearer ${serviceKey}`,
      "Prefer": "resolution=merge-duplicates",
    },
    body: JSON.stringify({
      user_id: userId,
      stripe_subscription_id: `local_trial_${userId}`,
      status: "trialing",
      trial_start: trialStart,
      trial_end: trialEnd,
    }),
  });
}

async function upsertProfile(userId: string, email: string, name: string, plan: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  await fetch(`${supabaseUrl}/rest/v1/profiles`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": serviceKey,
      "Authorization": `Bearer ${serviceKey}`,
      "Prefer": "resolution=merge-duplicates",
    },
    body: JSON.stringify({
      id: userId,
      email,
      full_name: name,
      selected_plan: plan,
    }),
  });
}

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

      // Use direct REST API calls with service role to bypass RLS and cookie issues
      await upsertProfile(user.id, user.email!, name, plan);
      await createTrialSubscription(user.id);

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
