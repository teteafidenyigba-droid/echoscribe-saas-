import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function LandingPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) redirect("/app");

  return (
    <iframe
      src="/echoscribe-site.html"
      style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
      title="EchoScribe"
    />
  );
}
