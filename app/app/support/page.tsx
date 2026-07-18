import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import SupportClient from "./SupportClient";

export default async function SupportPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  const { data: sub } = await supabase
    .from("subscriptions")
    .select("status")
    .eq("user_id", user.id)
    .in("status", ["active", "trialing"])
    .single();

  if (!sub) redirect("/billing");

  return (
    <SupportClient
      user={{
        email: user.email!,
        name: profile?.full_name ?? user.email!,
      }}
    />
  );
}
