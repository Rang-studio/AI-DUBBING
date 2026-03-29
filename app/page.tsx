import LandingCard from "@/components/LandingCard";
import { auth, signIn, signOut } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export default async function HomePage() {
  const session = await auth();

  return (
    <main className="page-shell px-5 py-8 md:px-8 md:py-10">
      <div className="mx-auto mb-6 flex max-w-6xl items-center justify-between rounded-full bg-white/75 px-4 py-3 shadow-soft backdrop-blur">
        <div>
          <p className="text-base font-extrabold tracking-tight md:text-lg">AI 더빙 웹사이트</p>
        </div>

        <div className="flex items-center gap-3">
          {session?.user?.email ? (
            <>
              <span className="hidden text-sm text-slate-500 md:block">{session.user.email}</span>
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <Button type="submit" variant="secondary">로그아웃</Button>
              </form>
            </>
          ) : (
            <form
              action={async () => {
                "use server";
                await signIn("google", { redirectTo: "/dub/conversation" });
              }}
            >
              <Button type="submit">로그인</Button>
            </form>
          )}
        </div>
      </div>

      <LandingCard />
    </main>
  );
}
