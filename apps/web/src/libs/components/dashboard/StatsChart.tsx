"use client";

import { useId, useMemo } from "react";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { MedicalStatisticsRow } from "@tilda/shared";
import { formatNumberKR } from "@/libs/utils/format";
import { Skeleton } from "@/libs/components/ui/skeleton";

export type ChartDepartmentPoint = {
  label: string;
  patientCount: number;
  visitDays: number;
  departmentName: string;
  rowCount: number;
};

type Props = {
  data: ChartDepartmentPoint[];
  isLoading?: boolean;
};

const TICK_COUNT = 6;
const COLOR_PATIENTS = "hsl(346 77% 56%)";
const COLOR_VISITS = "hsl(238 80% 60%)";

export function aggregateDepartmentStats(
  rows: MedicalStatisticsRow[]
): ChartDepartmentPoint[] {
  const grouped = new Map<string, ChartDepartmentPoint>();

  for (const row of rows) {
    const existing = grouped.get(row.departmentName);
    if (existing) {
      existing.patientCount += row.patientCount;
      existing.visitDays += row.visitDays;
      existing.rowCount += 1;
      continue;
    }

    grouped.set(row.departmentName, {
      label: row.departmentName,
      patientCount: row.patientCount,
      visitDays: row.visitDays,
      departmentName: row.departmentName,
      rowCount: 1,
    });
  }

  return Array.from(grouped.values());
}

export function StatsChart({ data: points, isLoading }: Props) {
  const gradId = useId();
  const chartId = useMemo(() => gradId.replace(/:/g, ""), [gradId]);

  const width = Math.max(720, points.length * 80);

  if (isLoading) {
    return <Skeleton className="h-[360px] w-full rounded-xl" />;
  }

  if (points.length === 0) {
    return (
      <div className="flex h-[360px] items-center justify-center rounded-xl border border-dashed border-slate-200 text-sm text-slate-500">
        표시할 데이터가 없습니다.
      </div>
    );
  }

  return (
    <div className="tilda-scroll w-full overflow-x-auto">
      <ComposedChart
        data={points}
        width={width}
        height={380}
        margin={{ top: 24, right: 56, left: 24, bottom: 56 }}
      >
        <defs>
          <linearGradient
            id={`patients-${chartId}`}
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop offset="0%" stopColor={COLOR_PATIENTS} stopOpacity={0.28} />
            <stop offset="100%" stopColor={COLOR_PATIENTS} stopOpacity={0} />
          </linearGradient>
          <linearGradient
            id={`visits-${chartId}`}
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop offset="0%" stopColor={COLOR_VISITS} stopOpacity={0.28} />
            <stop offset="100%" stopColor={COLOR_VISITS} stopOpacity={0} />
          </linearGradient>
        </defs>

        <CartesianGrid
          strokeDasharray="3 4"
          stroke="hsl(220 13% 91%)"
          vertical={false}
        />

        <XAxis
          dataKey="label"
          angle={-32}
          textAnchor="end"
          height={70}
          interval={0}
          tick={{ fontSize: 11, fill: "hsl(220 9% 46%)" }}
          tickLine={false}
          axisLine={{ stroke: "hsl(220 13% 91%)" }}
        />
        <YAxis
          yAxisId="left"
          orientation="left"
          tickCount={TICK_COUNT}
          domain={["auto", "auto"]}
          allowDecimals={false}
          tickFormatter={(v: number) => formatNumberKR(v)}
          tick={{ fontSize: 11, fill: "hsl(220 9% 46%)" }}
          tickLine={false}
          axisLine={false}
          label={{
            value: "환자수",
            angle: -90,
            position: "insideLeft",
            offset: 0,
            style: {
              fontSize: 12,
              fill: COLOR_PATIENTS,
              fontWeight: 600,
              textAnchor: "middle",
            },
          }}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          tickCount={TICK_COUNT}
          domain={["auto", "auto"]}
          allowDecimals={false}
          tickFormatter={(v: number) => formatNumberKR(v)}
          tick={{ fontSize: 11, fill: "hsl(220 9% 46%)" }}
          tickLine={false}
          axisLine={false}
          label={{
            value: "입내원일수",
            angle: 90,
            position: "insideRight",
            offset: 0,
            style: {
              fontSize: 12,
              fill: COLOR_VISITS,
              fontWeight: 600,
              textAnchor: "middle",
            },
          }}
        />

        <Tooltip
          cursor={{ stroke: "hsl(220 13% 75%)", strokeDasharray: "3 4" }}
          content={({ active, payload, label }) => {
            if (!active || !payload || payload.length === 0) return null;
            const p = payload[0]?.payload as ChartDepartmentPoint | undefined;
            return (
              <div className="min-w-[180px] rounded-xl border border-slate-200 bg-white/95 p-3 shadow-xl backdrop-blur-md">
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                  전체 의료기관종별 합산 · {p?.rowCount ?? 0}행
                </p>
                <p className="mb-2.5 text-sm font-semibold text-slate-900">
                  {label}
                </p>
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between gap-6">
                    <span className="flex items-center gap-1.5 text-xs text-slate-500">
                      <span
                        className="inline-block h-2 w-2 rounded-full"
                        style={{ backgroundColor: COLOR_PATIENTS }}
                      />
                      환자수
                    </span>
                    <span className="text-sm font-semibold tabular-nums text-slate-900">
                      {formatNumberKR(p?.patientCount)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-6">
                    <span className="flex items-center gap-1.5 text-xs text-slate-500">
                      <span
                        className="inline-block h-2 w-2 rounded-full"
                        style={{ backgroundColor: COLOR_VISITS }}
                      />
                      입내원일수
                    </span>
                    <span className="text-sm font-semibold tabular-nums text-slate-900">
                      {formatNumberKR(p?.visitDays)}
                    </span>
                  </div>
                </div>
              </div>
            );
          }}
        />

        <Legend
          verticalAlign="top"
          align="right"
          height={28}
          iconType="plainline"
          wrapperStyle={{ fontSize: 12, paddingBottom: 6 }}
        />

        <Area
          yAxisId="left"
          type="monotone"
          dataKey="patientCount"
          name="환자수"
          legendType="none"
          stroke="none"
          fill={`url(#patients-${chartId})`}
          isAnimationActive={false}
        />
        <Area
          yAxisId="right"
          type="monotone"
          dataKey="visitDays"
          name="입내원일수"
          legendType="none"
          stroke="none"
          fill={`url(#visits-${chartId})`}
          isAnimationActive={false}
        />

        <Line
          yAxisId="left"
          type="monotone"
          dataKey="patientCount"
          name="환자수"
          stroke={COLOR_PATIENTS}
          strokeWidth={2.25}
          dot={{ r: 0 }}
          activeDot={{ r: 5, strokeWidth: 2, stroke: "#fff" }}
          isAnimationActive={false}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="visitDays"
          name="입내원일수"
          stroke={COLOR_VISITS}
          strokeWidth={2.25}
          dot={{ r: 0 }}
          activeDot={{ r: 5, strokeWidth: 2, stroke: "#fff" }}
          isAnimationActive={false}
        />
      </ComposedChart>
    </div>
  );
}
