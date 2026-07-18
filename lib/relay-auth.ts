import { createClient, createServiceClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

type AuthOk = { ok: true };
type AuthFail = { ok: false; response: NextResponse };

export async function checkRelayAuth(): Promise<AuthOk | AuthFail> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, response: NextResponse.json({ error: { message: "Non authentifié." } }, { status: 401 }) };
  }

  // Admins bypass subscription check
  const db = createServiceClient();
  const { data: admin } = await db.from("admins").select("id").eq("id", user.id).single();
  if (admin) return { ok: true };

  // Check active or trialing subscription
  const { data: sub } = await db
    .from("subscriptions")
    .select("status")
    .eq("user_id", user.id)
    .in("status", ["active", "trialing"])
    .single();

  if (!sub) {
    return { ok: false, response: NextResponse.json({ error: { message: "Abonnement requis." } }, { status: 403 }) };
  }

  return { ok: true };
}
