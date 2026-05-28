"use client";

import { QueryClient } from "@tanstack/react-query";

let _qc: QueryClient | null = null;

export function getQueryClient(): QueryClient {
  if (_qc) return _qc;
  _qc = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60_000,
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  });
  return _qc;
}
