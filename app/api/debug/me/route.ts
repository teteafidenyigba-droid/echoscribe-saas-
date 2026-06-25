import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not authenticated" });

  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id, active_session_id")
    .eq("id", user.id)
    .single();

  const { data: sub, error: subError } = await supabase
    .from("subscriptions")
    .select("status, trial_end, current_period_end")
    .eq("user_id", user.id)
    .maybeSingle();

  const esSid = request.cookies.get("es_sid")?.value;
  const now = new Date();
  const accountAgeDays = user.created_at
    ? (now.getTime() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24)
    : null;

  return NextResponse.json({
    user_id: user.id,
    email: user.email,
    created_at: user.created_at,
    account_age_days: accountAgeDays,
    es_sid_present: !!esSid,
    active_session_id: profile?.active_session_id ?? null,
    session_match: profile?.active_session_id === esSid,
    stripe_customer_id: profile?.stripe_customer_id ?? null,
    subscription: sub ?? null,
    sub_error: subError?.message ?? null,
  });
}
