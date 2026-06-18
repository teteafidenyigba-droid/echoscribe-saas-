import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

async function checkSubscription(supabase: ReturnType<typeof createClient>, userId: string) {
  const { data: sub } = await supabase
    .from("subscriptions")
    .select("status")
    .eq("user_id", userId)
    .in("status", ["active", "trialing"])
    .single();
  if (sub) return true;

  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", userId)
    .single();
  if (!profile?.stripe_customer_id) return false;

  try {
    const stripeRes = await fetch(
      `https://api.stripe.com/v1/subscriptions?customer=${profile.stripe_customer_id}&limit=1&status=all`,
      { headers: { Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}` } }
    );
    const stripeData = await stripeRes.json();
    const stripeSub = stripeData?.data?.[0];
    return stripeSub && (stripeSub.status === "active" || stripeSub.status === "trialing");
  } catch { return false; }
}

export async function POST(request: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const hasAccess = await checkSubscription(supabase, user.id);
  if (!hasAccess) return NextResponse.json({ error: "Abonnement requis" }, { status: 403 });

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "Clé OpenAI non configurée" }, { status: 500 });

  // Transférer le FormData tel quel vers OpenAI Whisper
  const formData = await request.formData();
  const res = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}` },
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) console.error("[Whisper proxy error]", res.status, JSON.stringify(data).slice(0, 300));

  return NextResponse.json(data, { status: res.status });
}
