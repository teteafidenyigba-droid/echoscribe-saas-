import { createClient } from "@/lib/supabase/server";
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

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email, stripe_customer_id")
    .eq("id", user.id)
    .single();

  const { data: sub } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", user.id)
    .single();

  return (
    <BillingClient
      user={{ email: user.email!, name: profile?.full_name ?? "" }}
      subscription={sub}
      hasStripeCustomer={!!profile?.stripe_customer_id}
      searchParams={searchParams}
    />
  );
}
