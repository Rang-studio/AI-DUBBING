import Link from "next/link";
import DubbingForm from "@/components/DubbingForm";
import { Button } from "@/components/ui/button";
import { auth, isAuthConfigured, signOut } from "@/lib/auth";

function EnvSetupNotice() {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-md md:p-8">
      <h3 className="text-2xl font-extrabold">설정이 아직 완료되지 않았습니다</h3>
      <p className="mt-3 leading-7 text-slate-600">
        지금은 <code className="rounded bg-slate-100 px-2 py-1">.env.local</code> 값이 비어 있어서
        로그인, 화이트리스트, 더빙 API가 비활성화된 상태입니다.
      </p>

      <div className="mt-6 rounded-2xl bg-slate-50 p-5 text-sm leading-7 text-slate-700">
        <p className="font-bold">필수 항목</p>
        <ul className="mt-2 list-disc pl-5">
          <li>AUTH_SECRET</li>
          <li>AUTH_GOOGLE_ID</li>
          <li>AUTH_GOOGLE_SECRET</li>
          <li>TURSO_DATABASE_URL</li>
          <li>TURSO_AUTH_TOKEN</li>
          <li>ELEVENLABS_API_KEY</li>
        </ul>
      </div>
    </div>
  );
}

const validModes = ["conversation", "learning", "business"] as const;

type ValidMode = (typeof validModes)[number];

const modeTitleMap: Record<ValidMode, string> = {
  conversation: "회화 모드",
  learning: "학습용 모드",
  business: "비즈니스 모드",
};

const modeDescriptionMap: Record<ValidMode, string> = {
  conversation: "실제 대화처럼 자연스럽고  더빙을 제공합니다.",
  learning: "직역 중심의 더빙으로 학습에 도움이 되는 결과를 제공합니다.",
  business: "업무, 발표, 안내에 적합한 전문적인 음성 더빙을 제공합니다.",
};

export default async function DubModePage({
  params,
}: {
  params: Promise<{ mode: string }>;
}) {
  const { mode } = await params;

  if (!validModes.includes(mode as ValidMode)) {
    return (
      <main className="px-5 py-8 md:px-8 md:py-10">
        <div className="mx-auto max-w-4xl rounded-3xl border border-red-200 bg-white p-8 shadow-md">
          <h1 className="text-3xl font-extrabold">존재하지 않는 모드입니다</h1>
          <p className="mt-3 text-slate-600">
            회화, 학습용, 비즈니스 모드만 사용할 수 있습니다.
          </p>

          <div className="mt-6">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-md bg-slate-100 px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-200"
            >
              홈으로 돌아가기
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const typedMode = mode as ValidMode;
  const authReady = isAuthConfigured();
  const session = authReady ? await auth() : null;

  return (
    <main className="px-5 py-8 md:px-8 md:py-10">
      <div className="mx-auto mb-6 flex max-w-6xl items-center justify-between rounded-full bg-white px-4 py-3 shadow-md">
        <div className="flex flex-wrap items-center gap-3 text-sm font-semibold text-slate-600">
          <Link href="/">홈</Link>
          <span>·</span>
          <Link href="/dub/conversation">회화</Link>
          <Link href="/dub/learning">학습용</Link>
          <Link href="/dub/business">비즈니스</Link>
        </div>

        <div className="flex items-center gap-3">
          {session?.user?.email ? (
            <>
              <span className="hidden text-sm text-slate-500 md:block">
                {session.user.email}
              </span>

              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <Button type="submit" variant="secondary">
                  로그아웃
                </Button>
              </form>
            </>
          ) : (
            <span className="text-sm text-slate-500">설정 후 로그인 가능</span>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-6xl">
        <section className="mb-6 rounded-3xl bg-white p-8 text-center shadow-md">
          <p className="text-sm font-semibold tracking-wide text-slate-500">
            AI Voice Dubbing
          </p>

          <h1 className="mt-2 text-3xl font-extrabold text-slate-900 md:text-4xl">
            {modeTitleMap[typedMode]}
          </h1>

          <p className="mt-4 text-base leading-7 text-slate-600 md:text-lg">
            {modeDescriptionMap[typedMode]}
          </p>
        </section>

        {!authReady ? <EnvSetupNotice /> : <DubbingForm mode={typedMode} />}
      </div>
    </main>
  );
}