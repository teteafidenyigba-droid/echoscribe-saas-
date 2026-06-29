import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/admin";
import AdminClient from "./AdminClient";

export default async function AdminPage() {
  const user = await getAdminUser();
  if (!user) redirect("/app");
  return <AdminClient />;
}
