import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { origin } = new URL(request.url);
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(`${origin}/login`);

  // Create trial subscription via REST API (bypasses RLS and cookie issues)
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
      user_id: user.id,
      stripe_subscription_id: `local_trial_${user.id}`,
      status: "trialing",
      trial_start: trialStart,
      trial_end: trialEnd,
    }),
  });

  return NextResponse.redirect(`${origin}/app`);
}
