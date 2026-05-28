import { MyPageContent } from "@/libs/components/auth/MyPageContent";

export const dynamic = "force-dynamic";

export default function MyPage() {
  return (
    <main className="flex min-w-0 flex-1 flex-col">
      <div className="tilda-scroll min-w-0 flex-1 overflow-y-auto overflow-x-hidden">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-4 sm:p-6 lg:p-8">
          <header className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-indigo-600">
              <span className="inline-block h-1 w-6 rounded-full bg-indigo-500" />
              My Account
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              마이페이지
            </h1>
            <p className="text-sm text-slate-500">
              이름과 비밀번호를 변경할 수 있습니다. 이메일은 변경할 수 없습니다.
            </p>
          </header>

          <MyPageContent />
        </div>
      </div>
    </main>
  );
}
