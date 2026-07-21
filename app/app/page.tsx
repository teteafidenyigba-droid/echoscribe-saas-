import { createClient, createServiceClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AppClient from "./AppClient";

export default async function AppPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const HARDCODED_ADMINS = ["eliasco2018@gmail.com", "tete.afidenyigba@gmail.com"];
  const envAdmins = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  const allAdmins = [...new Set([...HARDCODED_ADMINS, ...envAdmins])];
  const isAdminByEmail = allAdmins.includes((user.email || "").toLowerCase());

  const db = createServiceClient();

  const [{ data: profile }, { data: adminRecord }] = await Promise.all([
    supabase.from("profiles").select("full_name, email").eq("id", user.id).single(),
    db.from("admins").select("id").eq("id", user.id).single(),
  ]);

  const isAdmin = isAdminByEmail || !!adminRecord;

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
    />
  );
}
