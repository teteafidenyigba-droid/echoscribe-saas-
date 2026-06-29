import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { createServiceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const db = createServiceClient();

  const { data: profiles } = await db
    .from("profiles")
    .select("id, email, full_name, created_at, blocked")
    .order("created_at", { ascending: false });

  if (!profiles) return NextResponse.json([]);

  const userIds = profiles.map((p) => p.id);

  const { data: subs } = await db
    .from("subscriptions")
    .select("user_id, status, trial_end, current_period_end, stripe_subscription_id")
    .in("user_id", userIds);

  const { data: crCounts } = await db
    .from("cr_events")
    .select("user_id")
    .in("user_id", userIds);

  const subMap = Object.fromEntries((subs ?? []).map((s) => [s.user_id, s]));
  const crMap: Record<string, number> = {};
  for (const cr of crCounts ?? []) {
    crMap[cr.user_id] = (crMap[cr.user_id] ?? 0) + 1;
  }

  const users = profiles.map((p) => ({
    ...p,
    subscription: subMap[p.id] ?? null,
    crCount: crMap[p.id] ?? 0,
  }));

  return NextResponse.json(users);
}
