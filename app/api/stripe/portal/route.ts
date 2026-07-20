import { createClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";

export async function POST() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .single();

  if (!profile?.stripe_customer_id) {
    return NextResponse.json({ error: "Aucun abonnement trouvé" }, { status: 400 });
  }

  let session;
  try {
    session = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id as string,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing`,
    });
  } catch (err: any) {
    if (err?.code === "resource_missing") {
      // Customer from test mode — clear stale ID so next checkout creates a fresh one
      await supabase
        .from("profiles")
        .update({ stripe_customer_id: null })
        .eq("id", user.id);
      return NextResponse.json({ url: `${process.env.NEXT_PUBLIC_APP_URL}/billing` });
    }
    return NextResponse.json({ error: err?.message ?? "Stripe error" }, { status: 400 });
  }

  return NextResponse.json({ url: session.url });
}
