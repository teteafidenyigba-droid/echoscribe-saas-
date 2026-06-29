import { createServiceClient } from "@/lib/supabase/server";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function getAdminUser() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) return null;

  const service = createServiceClient();
  const { data } = await service
    .from("admins")
    .select("id")
    .eq("email", user.email)
    .single();

  return data ? user : null;
}

export async function requireAdmin() {
  const user = await getAdminUser();
  if (!user) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 403 }), user: null };
  }
  return { error: null, user };
}
