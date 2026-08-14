import { createClient, createServiceClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/** GET /api/formulations — retourne les formulations de l'utilisateur connecté */
export async function GET() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json(null, { status: 401 });

  // Stockées dans user_metadata.formulations (pas de migration DB nécessaire)
  const formulations = (user.user_metadata as Record<string, unknown>)?.formulations ?? null;
  return NextResponse.json(formulations);
}

/** POST /api/formulations — sauvegarde les formulations liées au compte */
export async function POST(request: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  let body: unknown;
  try { body = await request.json(); }
  catch { return NextResponse.json({ error: "JSON invalide" }, { status: 400 }); }

  // Service role pour écrire dans user_metadata sans contrainte RLS
  const db = createServiceClient();
  const { error } = await db.auth.admin.updateUserById(user.id, {
    user_metadata: { formulations: body },
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
