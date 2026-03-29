import Link from "next/link";
import { Card } from "@/components/ui/card";

const modes = [
  { label: "회화(실전 커뮤니케이션)", href: "/dub/conversation" },
  { label: "학습용(직역)", href: "/dub/learning" },
  { label: "비즈니스(실전용)", href: "/dub/business" },
];

export default function LandingCard() {
  return (
    <Card className="mx-auto max-w-3xl p-8 md:p-12">
      <div className="flex flex-col items-center gap-6 text-center">
        <div>
          <p className="mb-2 text-sm font-semibold tracking-wide text-slate-500">
            Elegant AI Voice Dubbing
          </p>

          <h1 className="text-3xl font-extrabold leading-tight text-slate-900 md:text-5xl">
            AI 더빙 웹사이트
          </h1>

          <p className="mt-4 text-base leading-7 text-slate-600 md:text-lg">
            오디오와 비디오를 업로드하고, 원하는 언어로 자연스럽게 더빙하세요.
            <br />
            회화, 학습용, 비즈니스 상황에 맞춘 단정하고 편안한 워크플로를 제공합니다.
          </p>
        </div>

        <div className="flex w-full flex-col gap-4 pt-4">
          {modes.map((mode) => {
            const isLearning = mode.href.includes("learning");

            return (
              <Link
                key={mode.href}
                href={mode.href}
                className={`flex h-16 w-full items-center justify-center rounded-2xl text-lg font-bold transition ${
                  isLearning
                    ? "bg-slate-900 text-white hover:bg-slate-800"
                    : "bg-slate-100 text-slate-900 hover:bg-slate-200"
                }`}
              >
                {mode.label}
              </Link>
            );
          })}
        </div>
      </div>
    </Card>
  );
}