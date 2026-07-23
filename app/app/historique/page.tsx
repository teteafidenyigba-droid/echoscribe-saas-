import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AppClient from "../AppClient";

const HARDCODED_ADMINS = ["eliasco2018@gmail.com", "tete.afidenyigba@gmail.com"];

export default async function HistoriquePage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const envAdmins = (process.env.ADMIN_EMAILS || "").split(",").map(e => e.trim().toLowerCase()).filter(Boolean);
  const isAdmin = [...new Set([...HARDCODED_ADMINS, ...envAdmins])].includes((user.email || "").toLowerCase());

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email")
    .eq("id", user.id)
    .single();

  if (!isAdmin) {
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
      panel="history"
    />
  );
}
