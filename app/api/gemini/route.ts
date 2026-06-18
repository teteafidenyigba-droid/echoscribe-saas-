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

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "Clé Gemini non configurée" }, { status: 500 });

  // model passé en query param : /api/gemini?model=gemini-2.5-pro
  const { searchParams } = new URL(request.url);
  const model = searchParams.get("model") || "gemini-2.5-flash";

  const bodyText = await request.text();
  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse`;

  const res = await fetch(geminiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: bodyText,
  });

  const contentType = res.headers.get("content-type") ?? "application/json";
  const data = await res.text();
  if (!res.ok) console.error("[Gemini proxy error]", res.status, data.slice(0, 300));

  return new NextResponse(data, {
    status: res.status,
    headers: { "Content-Type": contentType },
  });
}
