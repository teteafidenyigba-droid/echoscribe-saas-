import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MISTRAL_MODEL = "mistral-large-latest";

const MEDICAL_PREFIX = `Tu es un médecin échographiste et radiologue expert, diplômé et certifié, avec 20 ans d'expérience en imagerie médicale. Tu rédiges des comptes rendus échographiques EXCLUSIVEMENT à destination des médecins généralistes et spécialistes prescripteurs — JAMAIS pour les patients.

RÈGLES ABSOLUES :
- Utilise le vocabulaire médical et radiologique précis et rigoureux (termes latins, grecs, abréviations médicales standard : hyperéchogène, hypoéchogène, anéchogène, doppler couleur, flux laminaire, résistance vasculaire, index de résistance, vascularisation périphérique, parenchyme, échostructure homogène/hétérogène, etc.)
- Structure le compte rendu selon les normes SFR (Société Française de Radiologie) et HAS
- Ne simplifie JAMAIS le langage médical — le destinataire est un professionnel de santé
- Sois factuel, précis, exhaustif dans les mesures et les descriptions séméiologiques
- Inclus systématiquement les cotations échographiques normales et pathologiques
- Ne rédige AUCUNE explication pédagogique ou vulgarisation — c'est un document médico-légal
- Respecte scrupuleusement ce qui a été dicté, sans rien inventer ni extrapoler\n\n`;

function openaiChunkToGeminiSSE(text: string): string {
  return `data: ${JSON.stringify({
    candidates: [{ content: { parts: [{ text }] } }],
  })}\n\n`;
}

export async function POST(request: NextRequest) {
  const body = await request.text();

  let systemText = "";
  let userText = "";
  let temperature = 0.2;
  let maxTokens = 8192;

  try {
    const parsed = JSON.parse(body);
    systemText = parsed.system_instruction?.parts?.[0]?.text ?? "";
    userText = parsed.contents?.[0]?.parts?.[0]?.text ?? "";
    temperature = parsed.generationConfig?.temperature ?? 0.2;
    maxTokens = parsed.generationConfig?.maxOutputTokens ?? 8192;
  } catch {
    return NextResponse.json({ error: { message: "Invalid request" } }, { status: 400 });
  }

  try {
    const res = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.MISTRAL_API_KEY}`,
      },
      body: JSON.stringify({
        model: MISTRAL_MODEL,
        stream: true,
        max_tokens: maxTokens,
        temperature,
        messages: [
          { role: "system", content: MEDICAL_PREFIX + systemText },
          { role: "user", content: userText },
        ],
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: { message: `Mistral error: ${err}` } }, { status: res.status });
    }

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(ctrl) {
        const reader = res.body!.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() ?? "";
            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed.startsWith("data:")) continue;
              const data = trimmed.slice(5).trim();
              if (data === "[DONE]") continue;
              try {
                const chunk = JSON.parse(data);
                const text = chunk.choices?.[0]?.delta?.content ?? "";
                if (text) ctrl.enqueue(encoder.encode(openaiChunkToGeminiSSE(text)));
              } catch { /* ignore */ }
            }
          }
        } finally {
          ctrl.close();
        }
      },
    });

    return new NextResponse(stream, {
      status: 200,
      headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache" },
    });
  } catch {
    return NextResponse.json({ error: { message: "Mistral unavailable" } }, { status: 503 });
  }
}
