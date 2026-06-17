import { createClient } from "@/lib/supabase/server";
import { stripe, PLANS } from "@/lib/stripe";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { plan } = await request.json();
  const planConfig = plan === "yearly" ? PLANS.yearly : PLANS.monthly;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL!;

  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id, full_name")
    .eq("id", user.id)
    .single();

  let customerId = profile?.stripe_customer_id as string | undefined;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email!,
      name: profile?.full_name ?? undefined,
      metadata: { supabase_uid: user.id },
    });
    customerId = customer.id;
    await supabase
      .from("profiles")
      .update({ stripe_customer_id: customerId })
      .eq("id", user.id);
  }

  let session;
  try {
    session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: planConfig.priceId, quantity: 1 }],
      subscription_data: {
        trial_period_days: 7,
        metadata: { supabase_uid: user.id, plan },
      },
      success_url: `${appUrl}/login`,
      cancel_url: `${appUrl}/billing?canceled=1`,
      locale: "fr",
      allow_promotion_codes: true,
    });
  } catch (err: any) {
    console.error("[Stripe checkout error]", err?.message ?? err);
    return NextResponse.json({ error: err?.message ?? "Stripe error" }, { status: 400 });
  }

  return NextResponse.json({ url: session.url });
}
