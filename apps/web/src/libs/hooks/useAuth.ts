"use client";

import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/libs/api/auth.api";
import { queryKeys } from "@/libs/query/queryKeys";
import { useAuthStore } from "@/libs/stores/auth.store";

export function useMe() {
  const setUser = useAuthStore((s) => s.setUser);
  const setHydrated = useAuthStore((s) => s.setHydrated);

  const query = useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: () => authApi.me(),
    retry: false,
    refetchOnMount: false,
  });

  useEffect(() => {
    if (query.isSuccess) setUser(query.data);
    if (query.isError) setUser(null);
    if (!query.isPending) setHydrated(true);
  }, [query.isSuccess, query.isError, query.isPending, query.data, setUser, setHydrated]);

  return query;
}

export function useLogout() {
  const qc = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);
  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      document.cookie = "tilda_logged_in=; path=/; max-age=0; SameSite=Lax";
      setUser(null);
      qc.setQueryData(queryKeys.auth.me, null);
    },
  });
}
