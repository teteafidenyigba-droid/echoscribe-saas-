import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { createServiceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const db = createServiceClient();
  const { data } = await db
    .from("error_logs")
    .select("id, relay, error, created_at, user_id, profiles(email)")
    .order("created_at", { ascending: false })
    .limit(200);

  return NextResponse.json(data ?? []);
}
