import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export const dynamic = "force-dynamic";

const SECRET = process.env.SUPABASE_SERVICE_ROLE_KEY!;

function verifyResetToken(token: string): { userId: string; email: string } | null {
  try {
    const dot = token.lastIndexOf(".");
    if (dot === -1) return null;
    const payload = token.slice(0, dot);
    const sig = token.slice(dot + 1);
    const expectedSig = crypto.createHmac("sha256", SECRET).update(payload).digest("hex");
    if (sig !== expectedSig) return null;
    const { userId, email, exp } = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (!userId || !email || !exp) return null;
    if (Math.floor(Date.now() / 1000) > exp) return null; // expired
    return { userId, email };
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  const { reset_token, password } = await request.json();

  if (!reset_token || !password) {
    return NextResponse.json({ error: "Paramètres manquants." }, { status: 400 });
  }

  if (
    password.length < 8 ||
    !/[A-Z]/.test(password) ||
    !/[0-9]/.test(password) ||
    !/[^A-Za-z0-9]/.test(password)
  ) {
    return NextResponse.json({ error: "Le mot de passe doit contenir au moins 8 caractères, une majuscule, un chiffre et un caractère spécial." }, { status: 400 });
  }

  const decoded = verifyResetToken(reset_token);
  if (!decoded) {
    console.warn("[update-password] invalid or expired token");
    return NextResponse.json({ error: "Lien invalide ou expiré." }, { status: 400 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    SECRET
  );

  const { error } = await supabase.auth.admin.updateUserById(decoded.userId, { password });

  if (error) {
    console.error("[update-password] updateUserById error:", error.message);
    return NextResponse.json({ error: "Une erreur est survenue." }, { status: 500 });
  }

  console.log("[update-password] password updated for userId:", decoded.userId);
  return NextResponse.json({ success: true });
}
