import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Relais simple : on passe le code au client pour qu'il fasse l'échange PKCE lui-même.
// L'échange server-side crée la session dans les cookies serveur mais pas en mémoire
// du client browser → updateUser échoue avec "Auth session missing!".
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    return NextResponse.redirect(`${origin}/reset-password?code=${encodeURIComponent(code)}`);
  }
  return NextResponse.redirect(`${origin}/reset-password?error=expired`);
}
