"use client";

import { useMemo } from "react";
import {
  Activity,
  Building2,
  CalendarDays,
  Users,
} from "lucide-react";
import type { MedicalStatisticsRow } from "@tilda/shared";
import { cn } from "@/libs/utils/cn";
import { formatNumberKR } from "@/libs/utils/format";
import { Skeleton } from "@/libs/components/ui/skeleton";

type Tone = "indigo" | "rose" | "amber" | "emerald";

type Kpi = {
  label: string;
  value: string;
  hint: string;
  tone: Tone;
  icon: React.ComponentType<{ className?: string }>;
};

const TONE: Record<Tone, { ring: string; icon: string; chip: string }> = {
  indigo: {
    ring: "from-indigo-500/15 to-indigo-500/0",
    icon: "bg-indigo-500/10 text-indigo-600",
    chip: "text-indigo-600",
  },
  rose: {
    ring: "from-rose-500/15 to-rose-500/0",
    icon: "bg-rose-500/10 text-rose-600",
    chip: "text-rose-600",
  },
  amber: {
    ring: "from-amber-500/15 to-amber-500/0",
    icon: "bg-amber-500/10 text-amber-600",
    chip: "text-amber-600",
  },
  emerald: {
    ring: "from-emerald-500/15 to-emerald-500/0",
    icon: "bg-emerald-500/10 text-emerald-600",
    chip: "text-emerald-600",
  },
};

type Props = {
  data: MedicalStatisticsRow[];
  totalCount: number;
  isLoading?: boolean;
};

export function KpiCards({ data, totalCount, isLoading }: Props) {
  const kpis = useMemo<Kpi[]>(() => {
    const totals = data.reduce(
      (acc, r) => {
        acc.patients += r.patientCount;
        acc.visitDays += r.visitDays;
        acc.cost += r.totalBenefitCost;
        return acc;
      },
      { patients: 0, visitDays: 0, cost: 0 }
    );
    return [
      {
        label: "총 데이터 행",
        value: formatNumberKR(totalCount),
        hint: "data.go.kr · 15139382",
        tone: "indigo",
        icon: Building2,
      },
      {
        label: "총 환자수",
        value: formatNumberKR(totals.patients),
        hint: "Patient count",
        tone: "rose",
        icon: Users,
      },
      {
        label: "총 입내원일수",
        value: formatNumberKR(totals.visitDays),
        hint: "Visit days",
        tone: "amber",
        icon: CalendarDays,
      },
      {
        label: "총 요양급여비용",
        value: `${formatNumberKR(Math.round(totals.cost / 100_000_000))}억 원`,
        hint: "Total benefit cost",
        tone: "emerald",
        icon: Activity,
      },
    ];
  }, [data, totalCount]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-28 w-full rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {kpis.map((k) => {
        const Icon = k.icon;
        const tone = TONE[k.tone];
        return (
          <div
            key={k.label}
            className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
          >
            <div
              className={cn(
                "pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b opacity-90",
                tone.ring
              )}
              aria-hidden
            />
            <div className="relative flex items-start justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-medium text-slate-500">
                  {k.label}
                </span>
                <span className="text-2xl font-semibold tracking-tight text-slate-900 tabular-nums">
                  {k.value}
                </span>
                <span className={cn("text-[11px] font-medium", tone.chip)}>
                  {k.hint}
                </span>
              </div>
              <span
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-xl",
                  tone.icon
                )}
              >
                <Icon className="h-5 w-5" />
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
