import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DeniedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="safe-wrap soft-panel max-w-lg p-8 text-center shadow-card">
        <h1 className="text-3xl font-extrabold">접근이 제한되었습니다</h1>
        <p className="mt-4 text-slate-600 leading-7">허용 리스트에 등록된 사용자만 이 서비스에 접근할 수 있습니다.</p>
        <div className="mt-6">
          <Link href="/">
            <Button variant="secondary">메인으로 돌아가기</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
