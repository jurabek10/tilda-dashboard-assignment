"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { statisticsApi } from "@/libs/api/statistics.api";
import { queryKeys } from "@/libs/query/queryKeys";

export function useStatistics(page: number, perPage: number) {
  return useQuery({
    queryKey: queryKeys.statistics.list(page, perPage),
    queryFn: () => statisticsApi.list(page, perPage),
    placeholderData: keepPreviousData,
  });
}
