import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AppClient from "./AppClient";

export default async function AppPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email")
    .eq("id", user.id)
    .single();

  return (
    <AppClient
      user={{
        email: user.email!,
        name: profile?.full_name ?? user.email!,
      }}
    />
  );
}
