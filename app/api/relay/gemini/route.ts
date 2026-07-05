import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MEDICAL_PREFIX = `Tu es un médecin échographiste et radiologue expert, diplômé et certifié, avec 20 ans d'expérience en imagerie médicale. Tu rédiges des comptes rendus échographiques EXCLUSIVEMENT à destination des médecins généralistes et spécialistes prescripteurs — JAMAIS pour les patients.

RÈGLES ABSOLUES :
- Utilise le vocabulaire médical et radiologique précis et rigoureux (termes latins, grecs, abréviations médicales standard : hyperéchogène, hypoéchogène, anéchogène, doppler couleur, flux laminaire, résistance vasculaire, index de résistance, vascularisation périphérique, parenchyme, échostructure homogène/hétérogène, etc.)
- Structure le compte rendu selon les normes SFR (Société Française de Radiologie) et HAS
- Ne simplifie JAMAIS le langage médical — le destinataire est un professionnel de santé
- Sois factuel, précis, exhaustif dans les mesures et les descriptions séméiologiques
- Inclus systématiquement les cotations échographiques normales et pathologiques
- Ne rédige AUCUNE explication pédagogique ou vulgarisation — c'est un document médico-légal
- Respecte scrupuleusement ce qui a été dicté, sans rien inventer ni extrapoler\n\n`;

export async function POST(request: NextRequest) {
  const model = request.nextUrl.searchParams.get("model") || "gemini-2.5-flash";
  const body = await request.text();

  // Injecter le préfixe médical dans le system prompt
  let geminiBody = body;
  try {
    const parsed = JSON.parse(body);
    const existing = parsed.system_instruction?.parts?.[0]?.text ?? "";
    parsed.system_instruction = { parts: [{ text: MEDICAL_PREFIX + existing }] };
    geminiBody = JSON.stringify(parsed);
  } catch { /* garder body original */ }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:streamGenerateContent?alt=sse`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": process.env.GOOGLE_AI_API_KEY!,
      },
      body: geminiBody,
    });
    return new NextResponse(res.body, {
      status: res.status,
      headers: {
        "Content-Type": res.headers.get("Content-Type") || "text/event-stream",
        "Cache-Control": "no-cache",
      },
    });
  } catch {
    return NextResponse.json({ error: { message: "Gemini unavailable" } }, { status: 503 });
  }
}
