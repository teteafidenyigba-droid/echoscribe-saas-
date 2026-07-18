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

  const bodyText = await request.text();

  let messages: Array<{ role: string; content: string }> = [];
  let model = "mistral-large-latest";
  let maxTokens = 16000;
  let temperature: number | undefined;
  let reasoningEffort: string | undefined;
  let stream = true;

  try {
    const parsed = JSON.parse(bodyText);

    // Support both OpenAI format (messages array) and legacy Gemini format
    if (Array.isArray(parsed.messages)) {
      // OpenAI format — native new V5 format
      messages = parsed.messages;
      model = parsed.model || model;
      maxTokens = parsed.max_tokens || parsed.max_completion_tokens || maxTokens;
      temperature = parsed.temperature;
      reasoningEffort = parsed.reasoning_effort;
      stream = parsed.stream !== false;
    } else if (parsed.system_instruction || parsed.contents) {
      // Legacy Gemini format — cascade fallback
      const sysText = parsed.system_instruction?.parts?.[0]?.text ?? "";
      const userText = parsed.contents?.[0]?.parts?.[0]?.text ?? "";
      messages = [
        { role: "system", content: sysText },
        { role: "user", content: userText },
      ];
      maxTokens = parsed.generationConfig?.maxOutputTokens ?? maxTokens;
      temperature = parsed.generationConfig?.temperature ?? 0.2;
    } else {
      return NextResponse.json({ error: { message: "Invalid request format" } }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: { message: "Invalid JSON" } }, { status: 400 });
  }

  // Inject MEDICAL_PREFIX into system message
  const sysIdx = messages.findIndex((m) => m.role === "system");
  if (sysIdx >= 0) {
    messages[sysIdx] = { ...messages[sysIdx], content: MEDICAL_PREFIX + messages[sysIdx].content };
  } else {
    messages.unshift({ role: "system", content: MEDICAL_PREFIX });
  }

  // Build Mistral request — use only params Mistral supports
  const reqBody: Record<string, unknown> = { model, max_tokens: maxTokens, stream, messages };
  if (temperature !== undefined) reqBody.temperature = temperature;
  // Magistral models support reasoning_effort; standard models don't
  if (reasoningEffort !== undefined && /magistral/i.test(model)) {
    reqBody.reasoning_effort = reasoningEffort;
  }

  try {
    const res = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.MISTRAL_API_KEY}`,
      },
      body: JSON.stringify(reqBody),
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: { message: `Mistral error: ${err}` } }, { status: res.status });
    }

    // Return native Mistral SSE (OpenAI format) unchanged
    return new NextResponse(res.body, {
      status: 200,
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
      },
    });
  } catch {
    return NextResponse.json({ error: { message: "Mistral unavailable" } }, { status: 503 });
  }
}
