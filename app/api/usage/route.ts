import { createClient, createServiceClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

const HARDCODED_ADMINS = ["eliasco2018@gmail.com", "tete.afidenyigba@gmail.com", "komlanserge@hotmail.com"];

function getPlanLimits(priceId?: string | null) {
  const PRO_MONTHLY = process.env.STRIPE_PRICE_PRO_MONTHLY;
  const PRO_YEARLY = process.env.STRIPE_PRICE_PRO_YEARLY;
  const CABINET_MONTHLY = process.env.STRIPE_PRICE_CABINET_MONTHLY;
  const CABINET_YEARLY = process.env.STRIPE_PRICE_CABINET_YEARLY;

  if (priceId && [CABINET_MONTHLY, CABINET_YEARLY].includes(priceId)) {
    return { daily: 9999, monthly: 9999, unlimited: true };
  }
  if (priceId && [PRO_MONTHLY, PRO_YEARLY].includes(priceId)) {
    return { daily: 70, monthly: 1500, unlimited: false };
  }
  // Standard (default)
  return { daily: 30, monthly: 500, unlimited: false };
}

async function getUsageCounts(db: ReturnType<typeof createServiceClient>, userId: string) {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const [{ count: todayCount }, { count: monthCount }] = await Promise.all([
    db.from("cr_usage").select("*", { count: "exact", head: true })
      .eq("user_id", userId).gte("created_at", todayStart),
    db.from("cr_usage").select("*", { count: "exact", head: true })
      .eq("user_id", userId).gte("created_at", monthStart),
  ]);

  return { today: todayCount ?? 0, month: monthCount ?? 0 };
}

// GET — état du quota actuel
export async function GET() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const isAdmin = HARDCODED_ADMINS.includes((user.email || "").toLowerCase());
  const db = createServiceClient();

  const [usage, { data: sub }] = await Promise.all([
    getUsageCounts(db, user.id),
    db.from("subscriptions").select("price_id, status").eq("user_id", user.id).single(),
  ]);

  const isTrial = sub?.status === "trialing";
  const limits = isAdmin
    ? { daily: 9999, monthly: 9999, unlimited: true }
    : isTrial
    ? { daily: 10, monthly: 70, unlimited: false }
    : getPlanLimits(sub?.price_id);

  return NextResponse.json({
    today: usage.today,
    month: usage.month,
    limits,
    blocked: !limits.unlimited && (usage.today >= limits.daily || usage.month >= limits.monthly),
    blockReason: !limits.unlimited
      ? usage.today >= limits.daily ? "daily"
      : usage.month >= limits.monthly ? "monthly"
      : null
      : null,
  });
}

// POST — incrémenter après un CR généré
export async function POST() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const isAdmin = HARDCODED_ADMINS.includes((user.email || "").toLowerCase());
  const db = createServiceClient();

  const [usage, { data: sub }] = await Promise.all([
    getUsageCounts(db, user.id),
    db.from("subscriptions").select("price_id, status").eq("user_id", user.id).single(),
  ]);

  const isTrial = sub?.status === "trialing";
  const limits = isAdmin
    ? { daily: 9999, monthly: 9999, unlimited: true }
    : isTrial
    ? { daily: 10, monthly: 70, unlimited: false }
    : getPlanLimits(sub?.price_id);

  if (!limits.unlimited) {
    if (usage.today >= limits.daily) {
      return NextResponse.json(
        { error: `Limite journalière atteinte (${limits.daily} CR/jour)`, limit: "daily" },
        { status: 429 }
      );
    }
    if (usage.month >= limits.monthly) {
      return NextResponse.json(
        { error: `Limite mensuelle atteinte (${limits.monthly} CR/mois)`, limit: "monthly" },
        { status: 429 }
      );
    }
  }

  await db.from("cr_usage").insert({ user_id: user.id });

  return NextResponse.json({
    ok: true,
    today: usage.today + 1,
    month: usage.month + 1,
    limits,
  });
}
