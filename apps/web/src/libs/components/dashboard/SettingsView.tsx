import { Cog, Construction } from "lucide-react";

export function SettingsView() {
  return (
    <div className="flex w-full min-w-0 flex-col gap-6">
      <header className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-indigo-600">
          <span className="inline-block h-1 w-6 rounded-full bg-indigo-500" />
          Settings
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          설정
        </h1>
      </header>

      <section className="relative overflow-hidden rounded-2xl border border-dashed border-slate-300 bg-white p-10">
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
            <Cog className="h-6 w-6" />
          </span>
          <h2 className="text-base font-semibold text-slate-900">
            설정페이지 입니다.
          </h2>
          <p className="max-w-md text-sm text-slate-500">
            추가 옵션은 곧 제공될 예정입니다. 현재는 마이페이지에서 프로필과
            비밀번호를 변경할 수 있습니다.
          </p>
          <span className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
            <Construction className="h-3.5 w-3.5" />
            준비 중
          </span>
        </div>
      </section>
    </div>
  );
}
