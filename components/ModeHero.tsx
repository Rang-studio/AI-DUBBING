const titles: Record<string, string> = {
  conversation: "회화 모드",
  learning: "학습용 모드",
  business: "비즈니스 모드"
};

const descriptions: Record<string, string> = {
  conversation: "실전 커뮤니케이션에 적합한 자연스러운 더빙 결과를 생성합니다.",
  learning: "직역에 가깝고 학습에 적합한 결과를 중심으로 더빙합니다.",
  business: "프레젠테이션, 안내, 실무 커뮤니케이션에 어울리는 정돈된 더빙을 제공합니다."
};

export default function ModeHero({ mode }: { mode: string }) {
  return (
    <div className="mb-6 rounded-[1.6rem] border border-white/60 bg-white/70 px-6 py-6 shadow-soft backdrop-blur md:px-8">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">AI dubbing workspace</p>
      <h2 className="mt-2 text-3xl font-extrabold text-ink">{titles[mode] ?? "더빙 모드"}</h2>
      <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
        {descriptions[mode] ?? "원하는 언어로 안정적으로 더빙할 수 있습니다."}
      </p>
    </div>
  );
}
