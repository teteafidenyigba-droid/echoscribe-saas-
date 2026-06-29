import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { createServiceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// PATCH — étendre essai (jours supplémentaires)
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { days } = await req.json();
  const db = createServiceClient();

  const { data: sub } = await db
    .from("subscriptions")
    .select("trial_end")
    .eq("user_id", params.id)
    .single();

  const base = sub?.trial_end ? new Date(sub.trial_end) : new Date();
  if (base < new Date()) base.setTime(Date.now());
  base.setDate(base.getDate() + (days ?? 7));

  await db
    .from("subscriptions")
    .update({ status: "trialing", trial_end: base.toISOString() })
    .eq("user_id", params.id);

  return NextResponse.json({ ok: true, new_trial_end: base.toISOString() });
}
