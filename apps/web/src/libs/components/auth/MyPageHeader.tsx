"use client";

import { CalendarDays, Mail, ShieldCheck } from "lucide-react";
import { useAuthStore } from "@/libs/stores/auth.store";

function formatDate(iso?: string): string {
  if (!iso) return "—";
  try {
    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(iso));
  } catch {
    return "—";
  }
}

export function MyPageHeader() {
  const user = useAuthStore((s) => s.user);
  const initial = user?.name?.[0] ?? user?.email?.[0]?.toUpperCase() ?? "U";

  return (
    <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="tilda-aurora absolute inset-x-0 top-0 h-28" aria-hidden />
      <div className="relative flex flex-col items-start gap-5 p-6 sm:flex-row sm:items-end">
        <span className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 text-3xl font-semibold text-white ring-4 ring-white">
          {initial}
        </span>
        <div className="flex flex-1 flex-col gap-3 sm:pb-1">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              {user?.name ?? "사용자"}
            </h2>
            <p className="flex items-center gap-1.5 text-sm text-slate-500">
              <Mail className="h-3.5 w-3.5" />
              {user?.email ?? "—"}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
              <ShieldCheck className="h-3.5 w-3.5" />
              인증 완료
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600">
              <CalendarDays className="h-3.5 w-3.5" />
              가입일 · {formatDate(user?.createdAt)}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
