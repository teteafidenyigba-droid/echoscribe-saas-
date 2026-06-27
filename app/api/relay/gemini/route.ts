import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const GROQ_MODELS = ["llama-3.3-70b-versatile", "llama-3.1-8b-instant"];

function openaiChunkToGeminiSSE(text: string): string {
  return `data: ${JSON.stringify({
    candidates: [{ content: { parts: [{ text }] } }],
  })}\n\n`;
}

async function tryGroq(systemText: string, userText: string): Promise<NextResponse | null> {
  for (const model of GROQ_MODELS) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
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
      clearTimeout(timeout);
      continue;
    }
  }
  return null;
}

export async function POST(request: NextRequest) {
  const model = request.nextUrl.searchParams.get("model") || "gemini-2.5-flash";
  const body = await request.text();

  // 1. Groq en premier (rapide)
  try {
    const parsed = JSON.parse(body);
    const systemText = parsed.system_instruction?.parts?.[0]?.text ?? "";
    const userText = parsed.contents?.[0]?.parts?.[0]?.text ?? "";
    const groqRes = await tryGroq(systemText, userText);
    if (groqRes) return groqRes;
  } catch { /* si le body n'est pas parseable, on passe à Gemini */ }

  // 2. Fallback Gemini
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:streamGenerateContent?alt=sse`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": process.env.GOOGLE_AI_API_KEY!,
      },
      body,
      signal: controller.signal,
    });
    clearTimeout(timeout);
    return new NextResponse(res.body, {
      status: res.status,
      headers: {
        "Content-Type": res.headers.get("Content-Type") || "text/event-stream",
        "Cache-Control": "no-cache",
      },
    });
  } catch (err: unknown) {
    clearTimeout(timeout);
    const isTimeout = err instanceof Error && err.name === "AbortError";
    return NextResponse.json(
      { error: { message: isTimeout ? "Gemini unavailable (timeout)" : "Gemini unavailable" } },
      { status: 503 }
    );
  }
}
