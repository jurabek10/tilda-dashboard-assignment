"use client";

import { useMemo, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
} from "@tanstack/react-table";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";
import type { MedicalStatisticsRow } from "@tilda/shared";
import { cn } from "@/libs/utils/cn";
import { formatNumberKR } from "@/libs/utils/format";
import { Input } from "@/libs/components/ui/input";
import { Button } from "@/libs/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/libs/components/ui/select";
import { Skeleton } from "@/libs/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/libs/components/ui/table";

type Props = {
  data: MedicalStatisticsRow[];
  isLoading?: boolean;
};

const NUMERIC_KEYS = new Set<keyof MedicalStatisticsRow>([
  "claimCount",
  "insurerBurden",
  "totalBenefitCost",
  "patientCount",
  "visitDays",
]);

export function StatsTable({ data, isLoading }: Props) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const columns = useMemo<ColumnDef<MedicalStatisticsRow>[]>(
    () => [
      makeColumn("treatmentYear", "진료년도"),
      makeColumn("institutionType", "의료기관종별"),
      makeColumn("departmentName", "진료과목(표시과목)"),
      makeColumn("claimCount", "명세서청구건수", true),
      makeColumn("insurerBurden", "보험자부담금(선별포함)", true),
      makeColumn("totalBenefitCost", "요양급여비용총액(선별포함)", true),
      makeColumn("patientCount", "환자수", true),
      makeColumn("visitDays", "입내원일수", true),
    ],
    []
  );

  const table = useReactTable<MedicalStatisticsRow>({
    data,
    columns,
    state: { sorting, columnFilters, globalFilter },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, _columnId, value: string) => {
      if (!value) return true;
      const v = value.toLowerCase();
      return Object.values(row.original).some((c) =>
        String(c).toLowerCase().includes(v)
      );
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 25 } },
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-10 w-72 rounded-lg" />
        <Skeleton className="h-[440px] w-full rounded-xl" />
      </div>
    );
  }

  const totalRows = table.getFilteredRowModel().rows.length;
  const { pageIndex, pageSize } = table.getState().pagination;
  const rangeStart = totalRows === 0 ? 0 : pageIndex * pageSize + 1;
  const rangeEnd = Math.min((pageIndex + 1) * pageSize, totalRows);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <Input
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="전체 검색…"
            className="h-9 w-72 pl-8"
          />
        </div>
        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 tabular-nums">
          {formatNumberKR(totalRows)} / {formatNumberKR(data.length)} 건
        </span>
      </div>

      <div className="tilda-scroll relative max-h-[520px] overflow-auto rounded-xl border border-slate-200 bg-white">
        <Table className="tilda-zebra">
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id} className="hover:bg-transparent">
                {hg.headers.map((header) => {
                  const sort = header.column.getIsSorted();
                  const isNumeric = NUMERIC_KEYS.has(
                    header.column.id as keyof MedicalStatisticsRow
                  );
                  return (
                    <TableHead
                      key={header.id}
                      className={cn(
                        "bg-slate-50/95 backdrop-blur",
                        "border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wider text-slate-500"
                      )}
                    >
                      <div
                        className={cn(
                          "flex flex-col gap-1.5",
                          isNumeric && "items-end"
                        )}
                      >
                        <button
                          type="button"
                          className="flex items-center gap-1 text-left transition-colors hover:text-slate-900"
                          onClick={header.column.getToggleSortingHandler()}
                          disabled={!header.column.getCanSort()}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {sort === "asc" ? (
                            <ArrowUp className="h-3 w-3 text-indigo-600" />
                          ) : sort === "desc" ? (
                            <ArrowDown className="h-3 w-3 text-indigo-600" />
                          ) : (
                            <ArrowUpDown className="h-3 w-3 opacity-30" />
                          )}
                        </button>
                        {header.column.getCanFilter() && (
                          <Input
                            value={
                              (header.column.getFilterValue() ?? "") as string
                            }
                            onChange={(e) =>
                              header.column.setFilterValue(e.target.value)
                            }
                            placeholder="필터"
                            className={cn(
                              "h-7 text-xs font-normal normal-case tracking-normal",
                              isNumeric && "text-right"
                            )}
                          />
                        )}
                      </div>
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-sm text-slate-500"
                >
                  표시할 데이터가 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="border-b border-slate-100">
                  {row.getVisibleCells().map((cell) => {
                    const isNumeric = NUMERIC_KEYS.has(
                      cell.column.id as keyof MedicalStatisticsRow
                    );
                    return (
                      <TableCell
                        key={cell.id}
                        className={cn(
                          "py-2.5 text-sm text-slate-700",
                          isNumeric && "text-right tabular-nums font-medium"
                        )}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 text-sm text-slate-600">
          <span className="text-xs text-slate-500">행 수</span>
          <Select
            value={String(pageSize)}
            onValueChange={(v) => table.setPageSize(Number(v))}
          >
            <SelectTrigger className="h-8 w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[10, 25, 50, 100].map((s) => (
                <SelectItem key={s} value={String(s)}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-xs text-slate-500 tabular-nums">
            {rangeStart}–{rangeEnd} / {formatNumberKR(totalRows)}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Button
            variant="outline"
            size="sm"
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
            이전
          </Button>
          <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 tabular-nums">
            {pageIndex + 1} / {Math.max(1, table.getPageCount())}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={!table.getCanNextPage()}
            onClick={() => table.nextPage()}
          >
            다음
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function makeColumn(
  key: keyof MedicalStatisticsRow,
  header: string,
  numeric = false
): ColumnDef<MedicalStatisticsRow> {
  return {
    id: key,
    accessorKey: key,
    header,
    enableColumnFilter: !NUMERIC_KEYS.has(key) || numeric === false,
    enableSorting: true,
    cell: ({ getValue }) => {
      const v = getValue();
      if (numeric && typeof v === "number") return formatNumberKR(v);
      return String(v ?? "");
    },
  };
}
