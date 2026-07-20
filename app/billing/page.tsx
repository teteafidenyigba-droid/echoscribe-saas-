import { createClient, createServiceClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe";
import { redirect } from "next/navigation";
import BillingClient from "./BillingClient";

export default async function BillingPage({
  searchParams,
}: {
  searchParams: { success?: string; canceled?: string; welcome?: string; plan?: string };
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const db = createServiceClient();

  const [{ data: profile }, { data: admin }] = await Promise.all([
    supabase.from("profiles").select("full_name, email, stripe_customer_id").eq("id", user.id).single(),
    db.from("admins").select("id").eq("id", user.id).single(),
  ]);

  let { data: sub } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", user.id)
    .single();

  // If success=1 but no subscription yet (webhook delay), fetch from Stripe directly
  if (searchParams.success && !sub && profile?.stripe_customer_id) {
    try {
      const stripeSubs = await stripe.subscriptions.list({
        customer: profile.stripe_customer_id,
        limit: 1,
        status: "all",
      });
      const stripeSub = stripeSubs.data[0];
      if (stripeSub) {
        const serviceSupabase = createServiceClient();
        await serviceSupabase.from("subscriptions").upsert({
          user_id: user.id,
          stripe_subscription_id: stripeSub.id,
          stripe_customer_id: profile.stripe_customer_id,
          status: stripeSub.status,
          price_id: stripeSub.items.data[0]?.price.id,
          current_period_start: new Date(stripeSub.current_period_start * 1000).toISOString(),
          current_period_end: new Date(stripeSub.current_period_end * 1000).toISOString(),
          trial_start: stripeSub.trial_start ? new Date(stripeSub.trial_start * 1000).toISOString() : null,
          trial_end: stripeSub.trial_end ? new Date(stripeSub.trial_end * 1000).toISOString() : null,
          cancel_at_period_end: stripeSub.cancel_at_period_end,
        });
        // Re-fetch
        const { data: refreshed } = await serviceSupabase
          .from("subscriptions")
          .select("*")
          .eq("user_id", user.id)
          .single();
        sub = refreshed;
      }
    } catch {}
  }

  return (
    <BillingClient
      user={{ email: user.email!, name: profile?.full_name ?? "" }}
      subscription={sub}
      hasStripeCustomer={!!profile?.stripe_customer_id}
      searchParams={searchParams}
      isAdmin={!!admin}
    />
  );
}
