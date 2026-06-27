import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const GROQ_MODELS = ["llama-3.3-70b-versatile", "llama-3.1-8b-instant"];
const GROQ_TIMEOUT_MS = 3000;

function openaiChunkToGeminiSSE(content: string): string {
  return `data: ${JSON.stringify({
    candidates: [{ content: { parts: [{ text: content }] } }],
  })}\n\n`;
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  // Extraire le prompt depuis le format Gemini envoyé par V5
  const systemText = body.system_instruction?.parts?.[0]?.text ?? "";
  const userText = body.contents?.[0]?.parts?.[0]?.text ?? "";

  for (const model of GROQ_MODELS) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), GROQ_TIMEOUT_MS);

    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model,
          stream: true,
          max_tokens: 4096,
          temperature: 0.2,
          messages: [
            { role: "system", content: systemText },
            { role: "user", content: userText },
          ],
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!res.ok) continue;

      // Convertir le stream OpenAI → format SSE Gemini attendu par V5
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller_) {
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
                  const json = JSON.parse(data);
                  const text = json.choices?.[0]?.delta?.content ?? "";
                  if (text) {
                    controller_.enqueue(encoder.encode(openaiChunkToGeminiSSE(text)));
                  }
                } catch { /* ignore parse errors */ }
              }
            }
          } finally {
            controller_.close();
          }
        },
      });

      return new NextResponse(stream, {
        status: 200,
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
        },
      });
    } catch {
      clearTimeout(timeout);
      continue;
    }
  }

  // Tous les modèles Groq ont échoué → signaler à l'appelant
  return NextResponse.json(
    { error: { message: "Groq unavailable" } },
    { status: 503 }
  );
}
