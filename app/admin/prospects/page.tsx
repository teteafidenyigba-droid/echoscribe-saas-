import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProspectsClient from "./ProspectsClient";

const HARDCODED_ADMINS = ["eliasco2018@gmail.com", "tete.afidenyigba@gmail.com", "komlanserge@hotmail.com", "contact@echoscribe.fr"];

export default async function AdminProspectsPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) redirect("/login");

  const envAdmins = (process.env.ADMIN_EMAILS || "").split(",").map(e => e.trim().toLowerCase()).filter(Boolean);
  const allAdmins = [...new Set([...HARDCODED_ADMINS, ...envAdmins])];
  if (!allAdmins.includes(user.email.toLowerCase())) redirect("/app");

  return <ProspectsClient adminEmail={user.email} />;
}
