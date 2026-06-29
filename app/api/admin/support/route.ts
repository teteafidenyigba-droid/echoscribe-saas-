import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { createServiceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const db = createServiceClient();
  const { data } = await db
    .from("support_messages")
    .select("*")
    .order("created_at", { ascending: false });

  return NextResponse.json(data ?? []);
}
