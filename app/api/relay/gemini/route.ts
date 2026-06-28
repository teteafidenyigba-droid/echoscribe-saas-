import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "edge"; // Edge runtime : cold start ~0ms au lieu de 200-500ms

const GROQ_MODEL = "llama-3.3-70b-versatile";

function openaiChunkToGeminiSSE(text: string): string {
  return `data: ${JSON.stringify({
    candidates: [{ content: { parts: [{ text }] } }],
  })}\n\n`;
}

export async function POST(request: NextRequest) {
  const model = request.nextUrl.searchParams.get("model") || "gemini-2.5-flash";
  const body = await request.text();

  // 1. Groq direct — priorité absolue
  try {
    const parsed = JSON.parse(body);
    const systemText = parsed.system_instruction?.parts?.[0]?.text ?? "";
    const userText = parsed.contents?.[0]?.parts?.[0]?.text ?? "";

    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        stream: true,
        max_tokens: 4096,
        temperature: 0.2,
        messages: [
          { role: "system", content: systemText },
          { role: "user", content: userText },
        ],
      }),
    });

    if (groqRes.ok) {
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(ctrl) {
          const reader = groqRes.body!.getReader();
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
                } catch { /* ignore parse errors */ }
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
  } catch { /* Groq indisponible → fallback Gemini */ }

  // 2. Fallback Gemini (si Groq indisponible)
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:streamGenerateContent?alt=sse`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": process.env.GOOGLE_AI_API_KEY!,
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
  } catch {
    return NextResponse.json(
      { error: { message: "Gemini unavailable" } },
      { status: 503 }
    );
  }
}
