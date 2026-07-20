import { createClient, createServiceClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AppClient from "./AppClient";

export default async function AppPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const db = createServiceClient();

  const [{ data: profile }, { data: admin }] = await Promise.all([
    supabase.from("profiles").select("full_name, email").eq("id", user.id).single(),
    db.from("admins").select("id").eq("id", user.id).single(),
  ]);

  if (!admin) {
    const { data: sub } = await supabase
      .from("subscriptions")
      .select("status")
      .eq("user_id", user.id)
      .in("status", ["active", "trialing"])
      .single();
    if (!sub) redirect("/billing");
  }

  return (
    <AppClient
      user={{
        email: user.email!,
        name: profile?.full_name ?? user.email!,
      }}
    />
  );
}
