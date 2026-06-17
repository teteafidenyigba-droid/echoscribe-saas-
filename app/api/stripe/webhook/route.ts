import { stripe } from "@/lib/stripe";
import { createServiceClient } from "@/lib/supabase/server";
import {
  sendTrialStartEmail,
  sendTrialReminderEmail,
  sendSubscriptionActiveEmail,
  sendCancellationEmail,
} from "@/lib/resend";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = headers().get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = createServiceClient();

  async function getUserFromCustomer(customerId: string) {
    const { data } = await supabase
      .from("profiles")
      .select("id, email, full_name")
      .eq("stripe_customer_id", customerId)
      .single();
    return data;
  }

  switch (event.type) {
    case "customer.subscription.created":
    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription;
      const customerId = sub.customer as string;
      const user = await getUserFromCustomer(customerId);
      if (!user) break;

      await supabase.from("subscriptions").upsert({
        user_id: user.id,
        stripe_subscription_id: sub.id,
        stripe_customer_id: customerId,
        status: sub.status,
        price_id: sub.items.data[0]?.price.id,
        current_period_start: new Date(sub.current_period_start * 1000).toISOString(),
        current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
        trial_start: sub.trial_start ? new Date(sub.trial_start * 1000).toISOString() : null,
        trial_end: sub.trial_end ? new Date(sub.trial_end * 1000).toISOString() : null,
        cancel_at_period_end: sub.cancel_at_period_end,
        canceled_at: sub.canceled_at ? new Date(sub.canceled_at * 1000).toISOString() : null,
      });

      if (event.type === "customer.subscription.created" && sub.status === "trialing") {
        try {
          const trialEnd = sub.trial_end ? new Date(sub.trial_end * 1000) : new Date(Date.now() + 7 * 86400000);
          await sendTrialStartEmail(user.email, user.full_name ?? "", trialEnd);
        } catch {}
      }
      if (sub.status === "active" && event.type === "customer.subscription.updated") {
        try {
          const planName = sub.items.data[0]?.price.recurring?.interval === "year" ? "Annuel" : "Mensuel";
          await sendSubscriptionActiveEmail(user.email, user.full_name ?? "", planName);
        } catch {}
      }
      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      const customerId = sub.customer as string;
      const user = await getUserFromCustomer(customerId);
      if (!user) break;

      await supabase.from("subscriptions").upsert({
        user_id: user.id,
        stripe_subscription_id: sub.id,
        stripe_customer_id: customerId,
        status: "canceled",
        current_period_end: sub.current_period_end
          ? new Date(sub.current_period_end * 1000).toISOString()
          : null,
      });

      try {
        const endDate = sub.current_period_end
          ? new Date(sub.current_period_end * 1000)
          : new Date();
        await sendCancellationEmail(user.email, user.full_name ?? "", endDate);
      } catch {}
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId = invoice.customer as string;
      const user = await getUserFromCustomer(customerId);
      if (!user) break;

      await supabase.from("subscriptions").update({ status: "past_due" }).eq("stripe_customer_id", customerId);
      break;
    }

    case "customer.subscription.trial_will_end": {
      const sub = event.data.object as Stripe.Subscription;
      const customerId = sub.customer as string;
      const user = await getUserFromCustomer(customerId);
      if (!user) break;
      try {
        await sendTrialReminderEmail(user.email, user.full_name ?? "");
      } catch {}
      break;
    }
  }

  return NextResponse.json({ received: true });
}
