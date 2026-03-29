"use client";

import { useMemo, useState } from "react";
import { Upload, Languages, PlayCircle, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const languages = ["ko", "en", "ja", "zh", "es", "fr", "de"];

type DubbingFormProps = {
  mode: string;
};

type DubResponse = {
  audioBase64?: string;
  transcript?: string;
  translatedText?: string;
  error?: string;
};

export default function DubbingForm({ mode }: DubbingFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [targetLanguage, setTargetLanguage] = useState("ko");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resultUrl, setResultUrl] = useState("");
  const [transcript, setTranscript] = useState("");
  const [translatedText, setTranslatedText] = useState("");

  const accept = useMemo(() => "audio/*,video/*", []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setResultUrl("");
    setTranscript("");
    setTranslatedText("");

    if (!file) {
      setError("오디오 또는 비디오 파일을 업로드해주세요.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("targetLanguage", targetLanguage);
      formData.append("mode", mode);

      const res = await fetch("/api/dub", {
        method: "POST",
        body: formData,
      });

      const contentType = res.headers.get("content-type") || "";
      let data: DubResponse = {};

      if (contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        throw new Error(text || "서버 응답 형식이 올바르지 않습니다.");
      }

      if (!res.ok) {
        throw new Error(data.error || "더빙 처리 중 오류가 발생했습니다.");
      }

      setResultUrl(data.audioBase64 ? `data:audio/mpeg;base64,${data.audioBase64}` : "");
      setTranscript(data.transcript || "");
      setTranslatedText(data.translatedText || "");
    } catch (err) {
      setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="p-5 md:p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-500">
              <Upload size={18} />
              파일 업로드
            </div>

            <label className="flex min-h-48 cursor-pointer flex-col items-center justify-center rounded-[1.3rem] border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center transition hover:bg-slate-100">
              <input
                type="file"
                accept={accept}
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />

              <span className="text-lg font-bold text-slate-900">
                오디오 또는 비디오 파일을 선택하세요
              </span>
              <span className="mt-2 text-sm text-slate-500">
                MP3, WAV, M4A, MP4 파일을 업로드할 수 있습니다
              </span>

              {file && (
                <span className="mt-4 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
                  {file.name}
                </span>
              )}
            </label>
          </div>

          <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-500">
              <Languages size={18} />
              변경할 언어
            </div>

            <div className="space-y-4">
              <select
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value)}
                className="h-12 w-full rounded-full border border-slate-200 bg-slate-50 px-4 outline-none transition focus:border-blue-300"
              >
                {languages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>

              <div className="rounded-[1.2rem] bg-slate-50 p-4 text-sm leading-7 text-slate-600">
                선택한 모드: <span className="font-bold text-slate-900">{mode}</span>
                <br />
                업로드한 파일을 전사, 번역, 음성 합성 과정을 거쳐 재생하거나 다운로드할 수
                있습니다.
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit" disabled={loading} className="min-w-36">
            {loading ? (
              <Loader2 className="mr-2 animate-spin" size={18} />
            ) : (
              <PlayCircle className="mr-2" size={18} />
            )}
            더빙 시작
          </Button>
        </div>

        {error && (
          <div className="rounded-[1.2rem] border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {error}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-lg font-extrabold">전사 결과</h3>
            <p className="min-h-36 whitespace-pre-wrap rounded-[1.1rem] bg-slate-50 p-4 text-sm leading-7 text-slate-700">
              {transcript || "전사 결과가 여기에 표시됩니다."}
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-lg font-extrabold">번역 결과</h3>
            <p className="min-h-36 whitespace-pre-wrap rounded-[1.1rem] bg-slate-50 p-4 text-sm leading-7 text-slate-700">
              {translatedText || "번역 결과가 여기에 표시됩니다."}
            </p>
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-lg font-extrabold">더빙 결과</h3>

          {resultUrl ? (
            <div className="space-y-4">
              <audio controls className="w-full">
                <source src={resultUrl} type="audio/mpeg" />
                브라우저가 오디오 재생을 지원하지 않습니다.
              </audio>

              <a href={resultUrl} download={`dubbed-${mode}.mp3`}>
                <Button type="button" variant="secondary">
                  <Download className="mr-2" size={18} />
                  다운로드
                </Button>
              </a>
            </div>
          ) : (
            <p className="text-sm text-slate-500">
              더빙 완료 후 여기에서 재생과 다운로드가 가능합니다.
            </p>
          )}
        </div>
      </form>
    </Card>
  );
}