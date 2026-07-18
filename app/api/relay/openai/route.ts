import { NextRequest, NextResponse } from "next/server";
import { checkRelayAuth } from "@/lib/relay-auth";

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
  const auth = await checkRelayAuth();
  if (!auth.ok) return auth.response;

  const body = await request.text();

  // Injecter le préfixe médical dans le system message OpenAI
  try {
    const parsed = JSON.parse(body);
    if (Array.isArray(parsed.messages)) {
      const sysIdx = parsed.messages.findIndex((m: { role: string }) => m.role === "system");
      if (sysIdx >= 0) {
        parsed.messages[sysIdx].content = MEDICAL_PREFIX + parsed.messages[sysIdx].content;
      } else {
        parsed.messages.unshift({ role: "system", content: MEDICAL_PREFIX });
      }
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify(parsed),
      });
      return new NextResponse(res.body, {
        status: res.status,
        headers: {
          "Content-Type": res.headers.get("Content-Type") || "text/event-stream",
          "Cache-Control": "no-cache",
        },
      });
    }
  } catch { /* body non parseable → pass-through */ }

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body,
  });

  return new NextResponse(res.body, {
    status: res.status,
    headers: {
      "Content-Type": res.headers.get("Content-Type") || "text/event-stream",
      "Cache-Control": "no-cache",
    },
  });
}
