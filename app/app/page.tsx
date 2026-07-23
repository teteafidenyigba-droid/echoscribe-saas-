import { createClient, createServiceClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AppClient from "./AppClient";

function getPlanLimits(priceId?: string | null) {
  const PRO_MONTHLY = process.env.STRIPE_PRICE_PRO_MONTHLY;
  const PRO_YEARLY = process.env.STRIPE_PRICE_PRO_YEARLY;
  const CABINET_MONTHLY = process.env.STRIPE_PRICE_CABINET_MONTHLY;
  const CABINET_YEARLY = process.env.STRIPE_PRICE_CABINET_YEARLY;
  if (priceId && [CABINET_MONTHLY, CABINET_YEARLY].filter(Boolean).includes(priceId))
    return { daily: 9999, monthly: 9999, unlimited: true };
  if (priceId && [PRO_MONTHLY, PRO_YEARLY].filter(Boolean).includes(priceId))
    return { daily: 70, monthly: 1500, unlimited: false };
  return { daily: 30, monthly: 500, unlimited: false };
}

export default async function AppPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const HARDCODED_ADMINS = ["eliasco2018@gmail.com", "tete.afidenyigba@gmail.com"];
  const envAdmins = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  const allAdmins = [...new Set([...HARDCODED_ADMINS, ...envAdmins])];
  const isAdminByEmail = allAdmins.includes((user.email || "").toLowerCase());

  const db = createServiceClient();

  const [{ data: profile }, { data: adminRecord }] = await Promise.all([
    supabase.from("profiles").select("full_name, email").eq("id", user.id).single(),
    db.from("admins").select("id").eq("id", user.id).single(),
  ]);

  const isAdmin = isAdminByEmail || !!adminRecord;

  if (!isAdmin) {
    const { data: sub } = await supabase
      .from("subscriptions")
      .select("status")
      .eq("user_id", user.id)
      .in("status", ["active", "trialing"])
      .single();
    if (!sub) redirect("/billing");
  }

  // Quota usage
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  let usage = { today: 0, month: 0 };
  let planPriceId: string | null = null;

  try {
    const [{ count: todayCount }, { count: monthCount }, { data: subPlan }] = await Promise.all([
      db.from("cr_usage").select("*", { count: "exact", head: true })
        .eq("user_id", user.id).gte("created_at", todayStart),
      db.from("cr_usage").select("*", { count: "exact", head: true })
        .eq("user_id", user.id).gte("created_at", monthStart),
      db.from("subscriptions").select("price_id").eq("user_id", user.id).single(),
    ]);
    usage = { today: todayCount ?? 0, month: monthCount ?? 0 };
    planPriceId = subPlan?.price_id ?? null;
  } catch {
    // Table cr_usage not yet created — quota not enforced
  }

  const limits = isAdmin
    ? { daily: 9999, monthly: 9999, unlimited: true }
    : getPlanLimits(planPriceId);

  return (
    <AppClient
      user={{ email: user.email!, name: profile?.full_name ?? user.email! }}
      usage={usage}
      limits={limits}
    />
  );
}
