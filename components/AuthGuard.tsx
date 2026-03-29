import Link from "next/link";
import { auth, signIn, signOut } from "@/lib/auth";
import { Button } from "@/components/ui/button";

async function loginWithGoogle() {
  "use server";
  await signIn("google", { redirectTo: "/dub/conversation" });
}

async function logoutToDenied() {
  "use server";
  await signOut({ redirectTo: "/denied" });
}

export default async function AuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user?.email) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="safe-wrap soft-panel max-w-lg p-8 text-center shadow-card">
          <h2 className="text-2xl font-extrabold">로그인이 필요합니다</h2>
          <p className="mt-3 text-slate-600">
            Google OAuth 로그인 후 접근할 수 있습니다.
          </p>

          <form action={loginWithGoogle} className="mt-6">
            <Button type="submit">Google로 로그인</Button>
          </form>

          <div className="mt-4">
            <Button asChild variant="link" className="text-sm text-slate-500">
              <Link href="/">홈으로 돌아가기</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // 세션에 isWhitelisted가 실제로 주입되어 있다는 전제
  // 타입 문제는 auth 타입 확장으로 해결하는 것이 가장 좋음
  const isWhitelisted = (session.user as typeof session.user & { isWhitelisted?: boolean })
    .isWhitelisted;

  if (!isWhitelisted) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="safe-wrap soft-panel max-w-lg p-8 text-center shadow-card">
          <h2 className="text-2xl font-extrabold">
            접근이 허용되지 않은 계정입니다
          </h2>
          <p className="mt-3 text-slate-600">
            허용 리스트에 등록된 이메일만 서비스 이용이 가능합니다.
          </p>
          <p className="mt-2 text-sm text-slate-500">
            현재 로그인: {session.user.email}
          </p>

          <form action={logoutToDenied} className="mt-6">
            <Button type="submit" variant="secondary">
              확인
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}