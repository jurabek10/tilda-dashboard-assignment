"use client";

import { LayoutDashboard, Mail, Settings, Sparkles } from "lucide-react";
import { cn } from "@/libs/utils/cn";
import {
  SIDEBAR_LABELS,
  SIDEBAR_TABS,
  type SidebarTab,
  useSidebarStore,
} from "@/libs/stores/sidebar.store";

const ICONS: Record<SidebarTab, React.ComponentType<{ className?: string }>> = {
  home: LayoutDashboard,
  settings: Settings,
  contact: Mail,
};

const DESCRIPTIONS: Record<SidebarTab, string> = {
  home: "차트 · 테이블",
  settings: "환경 설정",
  contact: "1:1 문의",
};

export function Sidebar() {
  const active = useSidebarStore((s) => s.active);
  const setActive = useSidebarStore((s) => s.setActive);

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-200 bg-white md:flex">
      <div className="border-b border-slate-100 px-5 pb-4 pt-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
          Workspace
        </p>
        <p className="mt-1 text-sm font-semibold text-slate-900">
          의료 데이터 대시보드
        </p>
        <p className="text-xs text-slate-500">건강보험심사평가원</p>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3">
        <p className="px-3 pb-2 pt-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
          Menu
        </p>
        {SIDEBAR_TABS.map((tab) => {
          const Icon = ICONS[tab];
          const isActive = tab === active;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActive(tab)}
              className={cn(
                "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300",
                isActive
                  ? "bg-indigo-50 text-indigo-700 shadow-[inset_0_0_0_1px_rgba(99,102,241,0.15)]"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <span
                className={cn(
                  "absolute left-0 top-1/2 h-7 w-[3px] -translate-y-1/2 rounded-r-full bg-indigo-500 transition-opacity",
                  isActive ? "opacity-100" : "opacity-0"
                )}
                aria-hidden
              />
              <Icon
                className={cn(
                  "h-4 w-4 shrink-0 transition-colors",
                  isActive
                    ? "text-indigo-600"
                    : "text-slate-400 group-hover:text-slate-600"
                )}
              />
              <span className="flex-1 text-left">{SIDEBAR_LABELS[tab]}</span>
              <span
                className={cn(
                  "text-[10px] transition-colors",
                  isActive
                    ? "text-indigo-500"
                    : "text-slate-400 group-hover:text-slate-500"
                )}
              >
                {DESCRIPTIONS[tab]}
              </span>
            </button>
          );
        })}
      </nav>

      <div className="mx-3 mb-4 rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-violet-50 p-3.5">
        <div className="mb-1 flex items-center gap-2 text-xs font-semibold text-indigo-700">
          <Sparkles className="h-3.5 w-3.5" />
          데이터 출처
        </div>
        <p className="text-[11px] leading-relaxed text-slate-600">
          건강보험심사평가원 · 의료기관종별 진료과목별 진료비 통계
          <span className="mt-1 block text-slate-400">data.go.kr · 15139382</span>
        </p>
      </div>
    </aside>
  );
}

export function MobileSidebar() {
  const active = useSidebarStore((s) => s.active);
  const setActive = useSidebarStore((s) => s.setActive);
  return (
    <div className="flex w-full gap-1.5 overflow-x-auto border-b bg-white p-2 md:hidden">
      {SIDEBAR_TABS.map((tab) => {
        const Icon = ICONS[tab];
        const isActive = tab === active;
        return (
          <button
            key={tab}
            type="button"
            onClick={() => setActive(tab)}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
              isActive
                ? "bg-indigo-600 text-white shadow"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            {SIDEBAR_LABELS[tab]}
          </button>
        );
      })}
    </div>
  );
}
