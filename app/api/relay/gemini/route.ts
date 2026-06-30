import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const GROQ_MODEL = "llama-3.3-70b-versatile";

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

function streamGroqResponse(res: Response): NextResponse {
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
}

async function fetchGroq(systemText: string, userText: string, temperature: number, maxTokens: number, signal: AbortSignal): Promise<Response> {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      stream: true,
      max_tokens: maxTokens,
      temperature,
      messages: [
        { role: "system", content: systemText },
        { role: "user", content: userText },
      ],
    }),
    signal,
  });
  if (!res.ok) throw new Error(`Groq ${res.status}`);
  return res;
}

async function fetchGemini(body: string, model: string, signal: AbortSignal): Promise<Response> {
  const fastModel = model;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(fastModel)}:streamGenerateContent?alt=sse`;

  // Désactiver le thinking Gemini côté relay pour éliminer la latence de raisonnement
  let fastBody = body;
  try {
    const parsed = JSON.parse(body);
    if (parsed.generationConfig) {
      delete parsed.generationConfig.thinkingBudget;
      delete parsed.generationConfig.thinkingLevel;
    }
    fastBody = JSON.stringify(parsed);
  } catch { /* garder body original */ }

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": process.env.GOOGLE_AI_API_KEY!,
    },
    body: fastBody,
    signal,
  });
  if (!res.ok) throw new Error(`Gemini ${res.status}`);
  return res;
}

export async function POST(request: NextRequest) {
  const model = request.nextUrl.searchParams.get("model") || "gemini-2.5-flash";
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
  } catch { /* body non parseable → Gemini seul */ }

  const groqController = new AbortController();
  const geminiController = new AbortController();

  try {
    // Lance Groq et Gemini en parallèle — le premier qui répond gagne
    const winner = await Promise.any([
      fetchGroq(MEDICAL_PREFIX + systemText, userText, temperature, maxTokens, groqController.signal)
        .then(res => ({ source: "groq" as const, res, abort: geminiController })),
      fetchGemini(body, model, geminiController.signal)
        .then(res => ({ source: "gemini" as const, res, abort: groqController })),
    ]);

    // Annule le perdant
    try { winner.abort.abort(); } catch { /* ignore */ }

    if (winner.source === "groq") {
      return streamGroqResponse(winner.res);
    } else {
      return new NextResponse(winner.res.body, {
        status: 200,
        headers: {
          "Content-Type": winner.res.headers.get("Content-Type") || "text/event-stream",
          "Cache-Control": "no-cache",
        },
      });
    }
  } catch {
    // Les deux ont échoué
    return NextResponse.json({ error: { message: "AI unavailable" } }, { status: 503 });
  }
}
