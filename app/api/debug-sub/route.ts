import { createClient, createServiceClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "not authenticated" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email, stripe_customer_id")
    .eq("id", user.id)
    .single();

  const { data: sub, error: subError } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", user.id)
    .single();

  let stripeSubscriptions = null;
  let stripeError = null;
  if (profile?.stripe_customer_id) {
    try {
      const list = await stripe.subscriptions.list({
        customer: profile.stripe_customer_id,
        limit: 5,
        status: "all",
      });
      stripeSubscriptions = list.data.map((s) => ({
        id: s.id,
        status: s.status,
        trial_end: s.trial_end,
        current_period_end: s.current_period_end,
      }));
    } catch (e: any) {
      stripeError = e.message;
    }
  }

  return NextResponse.json({
    user_id: user.id,
    email: user.email,
    stripe_customer_id: profile?.stripe_customer_id ?? null,
    supabase_subscription: sub ?? null,
    supabase_error: subError?.message ?? null,
    stripe_subscriptions: stripeSubscriptions,
    stripe_error: stripeError,
  });
}
