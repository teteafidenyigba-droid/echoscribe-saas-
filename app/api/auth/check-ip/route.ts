import { createServiceClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    null;

  // IP indéterminée ou localhost → on laisse passer (dev / réseau local)
  if (!ip || ip === "::1" || ip === "127.0.0.1") {
    return NextResponse.json({ allowed: true });
  }

  const db = createServiceClient();
  const { data } = await db
    .from("profiles")
    .select("id")
    .eq("registration_ip", ip)
    .limit(1)
    .maybeSingle();

  if (data) {
    return NextResponse.json({
      allowed: false,
      reason: "Un essai gratuit a déjà été utilisé depuis votre réseau. Choisissez un abonnement pour continuer.",
    });
  }

  return NextResponse.json({ allowed: true });
}
