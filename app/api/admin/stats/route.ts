import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { createServiceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const db = createServiceClient();

  const [
    { count: totalUsers },
    { count: activeSubs },
    { count: trialSubs },
    { count: canceledSubs },
    { count: totalCR },
    { count: totalErrors },
    { count: openSupport },
  ] = await Promise.all([
    db.from("profiles").select("*", { count: "exact", head: true }),
    db.from("subscriptions").select("*", { count: "exact", head: true }).eq("status", "active"),
    db.from("subscriptions").select("*", { count: "exact", head: true }).eq("status", "trialing"),
    db.from("subscriptions").select("*", { count: "exact", head: true }).eq("status", "canceled"),
    db.from("cr_events").select("*", { count: "exact", head: true }),
    db.from("error_logs").select("*", { count: "exact", head: true }),
    db.from("support_messages").select("*", { count: "exact", head: true }).eq("status", "open"),
  ]);

  return NextResponse.json({
    totalUsers: totalUsers ?? 0,
    activeSubs: activeSubs ?? 0,
    trialSubs: trialSubs ?? 0,
    canceledSubs: canceledSubs ?? 0,
    totalCR: totalCR ?? 0,
    totalErrors: totalErrors ?? 0,
    openSupport: openSupport ?? 0,
  });
}
