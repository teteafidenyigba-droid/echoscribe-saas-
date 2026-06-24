import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";

export async function POST() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const sessionId = randomUUID();

  await supabase
    .from("profiles")
    .update({ active_session_id: sessionId })
    .eq("id", user.id);

  const response = NextResponse.json({ ok: true });
  response.cookies.set("es_sid", sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });

  return response;
}
