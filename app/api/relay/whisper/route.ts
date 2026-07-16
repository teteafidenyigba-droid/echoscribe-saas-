import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Prompt d'amorçage Whisper : vocabulaire échographique et médical fréquent
// Whisper utilise ce texte pour calibrer sa reconnaissance sur le domaine médical
const WHISPER_MEDICAL_PROMPT = `Compte rendu d'échographie médicale. Terminologie : hyperéchogène, hypoéchogène, anéchogène, isoéchogène, hétérogène, homogène, parenchyme hépatique, vésicule biliaire, cholédoque, pancréas, rate, reins, cortex rénal, sinus rénal, bassinet, uretère, vessie, prostate, utérus, ovaires, follicules, endomètre, myomètre, thyroïde, nodule, adénopathie, ganglion, doppler couleur, doppler pulsé, flux laminaire, turbulent, index de résistance, index de pulsatilité, vascularisation périphérique, aorte, artère mésentérique, tronc cœliaque, veine porte, veines sus-hépatiques, dilatation des voies biliaires, lithiase, calcul, cône d'ombre acoustique, épanchement, ascite, péristaltisme, péritoine, hernie, appendice, échostructure, contours réguliers, irréguliers, lobulés, spiculés, mm, cm, ml, ATCD, DDR, SA, IMC, PSA, CA125, Conclusion, Indication, CIVD, HTA, DT2.`;

const MAX_AUDIO_SIZE = 25 * 1024 * 1024; // 25 Mo (limite Whisper)
const ALLOWED_AUDIO_EXTS = ["webm", "mp4", "mp3", "wav", "ogg", "flac", "m4a", "mpeg", "mpga"];
const ALLOWED_AUDIO_TYPES = [
  "audio/webm", "audio/mp4", "audio/mpeg", "audio/mp3", "audio/wav",
  "audio/ogg", "audio/flac", "audio/x-m4a", "audio/m4a", "audio/mpga",
];

export async function POST(request: NextRequest) {
  const formData = await request.formData();

  const file = formData.get("file") as File | null;
  if (file) {
    if (file.size > MAX_AUDIO_SIZE) {
      return NextResponse.json({ error: "Fichier trop volumineux (max 25 Mo)" }, { status: 413 });
    }
    const ext = file.name?.split(".").pop()?.toLowerCase() ?? "";
    if (!ALLOWED_AUDIO_TYPES.includes(file.type) && !ALLOWED_AUDIO_EXTS.includes(ext)) {
      return NextResponse.json({ error: "Type de fichier non supporté" }, { status: 400 });
    }
  }

  // Injecter le prompt médical si pas déjà défini
  if (!formData.get("prompt")) {
    formData.set("prompt", WHISPER_MEDICAL_PROMPT);
  }

  // Forcer la langue française pour la transcription médicale
  if (!formData.get("language")) {
    formData.set("language", "fr");
  }

  const res = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: formData as unknown as BodyInit,
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
