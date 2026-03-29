import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const ELEVEN_STT_URL = "https://api.elevenlabs.io/v1/speech-to-text";
const ELEVEN_TTS_URL = "https://api.elevenlabs.io/v1/text-to-speech/JBFqnCBsd6RMkjVDRZzb";

function translateText(text: string, targetLanguage: string, mode: string) {
  const prefixMap: Record<string, string> = {
    conversation: "[회화체 스타일] ",
    learning: "[직역 중심 학습 스타일] ",
    business: "[정중하고 실무적인 스타일] "
  };

  return `${prefixMap[mode] || ""}${text}\n\n(target: ${targetLanguage})`;
}

async function speechToText(file: File) {
  if (!ELEVENLABS_API_KEY) {
    throw new Error("ELEVENLABS_API_KEY가 설정되지 않았습니다.");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("model_id", "scribe_v1");

  const response = await fetch(ELEVEN_STT_URL, {
    method: "POST",
    headers: {
      "xi-api-key": ELEVENLABS_API_KEY
    },
    body: formData
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`전사 실패: ${text}`);
  }

  const data = await response.json();
  return data.text || "";
}

async function textToSpeech(text: string) {
  if (!ELEVENLABS_API_KEY) {
    throw new Error("ELEVENLABS_API_KEY가 설정되지 않았습니다.");
  }

  const response = await fetch(ELEVEN_TTS_URL, {
    method: "POST",
    headers: {
      "xi-api-key": ELEVENLABS_API_KEY,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      text,
      model_id: "eleven_multilingual_v2",
      voice_settings: {
        stability: 0.45,
        similarity_boost: 0.8,
        style: 0.2,
        use_speaker_boost: true
      }
    })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`음성 합성 실패: ${text}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  return buffer.toString("base64");
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file");
    const targetLanguage = String(formData.get("targetLanguage") || "ko");
    const mode = String(formData.get("mode") || "conversation");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "파일이 필요합니다." }, { status: 400 });
    }

    const transcript = await speechToText(file);
    const translatedText = translateText(transcript, targetLanguage, mode);
    const audioBase64 = await textToSpeech(translatedText);

    return NextResponse.json({
      transcript,
      translatedText,
      audioBase64
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "더빙 처리 실패";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
