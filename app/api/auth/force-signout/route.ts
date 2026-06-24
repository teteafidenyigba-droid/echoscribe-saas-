import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const supabase = createClient();
  await supabase.auth.signOut();
  const url = new URL("/login", request.url);
  url.searchParams.set("error", "autre_appareil");
  return NextResponse.redirect(url);
}
