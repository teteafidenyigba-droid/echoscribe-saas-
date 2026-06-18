import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  // Verify user is authenticated and has active subscription
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { data: sub } = await supabase
    .from("subscriptions")
    .select("status")
    .eq("user_id", user.id)
    .in("status", ["active", "trialing"])
    .single();

  if (!sub) {
    // Fallback: vérifier Stripe directement si webhook en retard
    const { data: profile } = await supabase
      .from("profiles")
      .select("stripe_customer_id")
      .eq("id", user.id)
      .single();

    let hasStripeAccess = false;
    if (profile?.stripe_customer_id) {
      try {
        const stripeRes = await fetch(
          `https://api.stripe.com/v1/subscriptions?customer=${profile.stripe_customer_id}&limit=1&status=all`,
          { headers: { Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}` } }
        );
        const stripeData = await stripeRes.json();
        const stripeSub = stripeData?.data?.[0];
        if (stripeSub && (stripeSub.status === "active" || stripeSub.status === "trialing")) {
          hasStripeAccess = true;
        }
      } catch {}
    }

    if (!hasStripeAccess) {
      return NextResponse.json({ error: "Abonnement requis" }, { status: 403 });
    }
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Clé Anthropic non configurée" }, { status: 500 });
  }

  const body = await request.text();

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body,
  });

  const contentType = res.headers.get("content-type") ?? "application/json";
  const data = await res.text();

  return new NextResponse(data, {
    status: res.status,
    headers: { "Content-Type": contentType },
  });
}
