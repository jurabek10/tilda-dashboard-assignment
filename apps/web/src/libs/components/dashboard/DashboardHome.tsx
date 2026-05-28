"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  LineChart as LineChartIcon,
  Table as TableIcon,
} from "lucide-react";
import { useStatistics } from "@/libs/hooks/useStatistics";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/libs/components/ui/alert";
import { Button } from "@/libs/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/libs/components/ui/select";
import { KpiCards } from "./KpiCards";
import { aggregateDepartmentStats, StatsChart } from "./StatsChart";
import { StatsTable } from "./StatsTable";

const CHART_PAGE_SIZES = [10, 20, 30, 50];
const CHART_SOURCE_PAGE = 1;
const CHART_SOURCE_PER_PAGE = 1000;

export function DashboardHome() {
  const [chartPage, setChartPage] = useState(1);
  const [chartPerPage, setChartPerPage] = useState(20);
  const [tablePerPage] = useState(200);

  const chart = useStatistics(CHART_SOURCE_PAGE, CHART_SOURCE_PER_PAGE);
  const table = useStatistics(1, tablePerPage);

  const aggregatedChartData = useMemo(
    () => aggregateDepartmentStats(chart.data?.data ?? []),
    [chart.data?.data]
  );
  const pagedChartData = useMemo(
    () =>
      aggregatedChartData.slice(
        (chartPage - 1) * chartPerPage,
        chartPage * chartPerPage
      ),
    [aggregatedChartData, chartPage, chartPerPage]
  );
  const chartTotal = aggregatedChartData.length;
  const chartPageCount = Math.max(
    1,
    Math.ceil(chartTotal / chartPerPage) || 1
  );

  return (
    <div className="flex w-full min-w-0 flex-col gap-6">
      <header className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-indigo-600">
          <span className="inline-block h-1 w-6 rounded-full bg-indigo-500" />
          Dashboard
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          의료기관종별 진료과목별 진료비 통계
        </h1>
        <p className="text-sm text-slate-500">
          건강보험심사평가원이 제공하는 진료과목별 진료비 통계를 한눈에 확인하세요.
        </p>
      </header>

      <KpiCards
        data={table.data?.data ?? []}
        totalCount={table.data?.totalCount ?? 0}
        isLoading={table.isLoading}
      />

      <section className="w-full min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600">
              <LineChartIcon className="h-4.5 w-4.5" />
            </span>
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                환자수 대비 입내원일수
              </h2>
              <p className="text-xs text-slate-500">
                좌측: 환자수 · 우측: 입내원일수 · 의료기관종별 구분 없이
                진료과목별 합산
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">표시 행수</span>
            <Select
              value={String(chartPerPage)}
              onValueChange={(v) => {
                setChartPerPage(Number(v));
                setChartPage(1);
              }}
            >
              <SelectTrigger className="h-8 w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CHART_PAGE_SIZES.map((s) => (
                  <SelectItem key={s} value={String(s)}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="p-5">
          {chart.isError ? (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>차트 데이터를 불러오지 못했습니다.</AlertTitle>
              <AlertDescription>잠시 후 다시 시도해주세요.</AlertDescription>
            </Alert>
          ) : (
            <StatsChart
              data={pagedChartData}
              isLoading={chart.isLoading}
            />
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 px-5 py-3 text-sm">
          <span className="text-xs text-slate-500 tabular-nums">
            {chart.data
              ? `${(chartPage - 1) * chartPerPage + 1}–${Math.min(
                  chartPage * chartPerPage,
                  chartTotal
                )} / 총 ${chartTotal}건`
              : "—"}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={chartPage <= 1 || chart.isFetching}
              onClick={() => setChartPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className="h-4 w-4" />
              이전
            </Button>
            <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 tabular-nums">
              {chartPage} / {chartPageCount}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={chartPage >= chartPageCount || chart.isFetching}
              onClick={() =>
                setChartPage((p) => Math.min(chartPageCount, p + 1))
              }
            >
              다음
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      <section className="w-full min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <div className="flex items-start gap-3 border-b border-slate-100 p-5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
            <TableIcon className="h-4.5 w-4.5" />
          </span>
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              진료비 상세 데이터
            </h2>
            <p className="text-xs text-slate-500">
              정렬 · 컬럼별 필터 · 전체 검색 · 페이지네이션 지원
            </p>
          </div>
        </div>
        <div className="p-5">
          {table.isError ? (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>테이블 데이터를 불러오지 못했습니다.</AlertTitle>
              <AlertDescription>잠시 후 다시 시도해주세요.</AlertDescription>
            </Alert>
          ) : (
            <StatsTable
              data={table.data?.data ?? []}
              isLoading={table.isLoading}
            />
          )}
        </div>
      </section>
    </div>
  );
}
