import type { PaginatedStatistics } from "@tilda/shared";
import { apiClient } from "./client";

export const statisticsApi = {
  list: (page: number, perPage: number) =>
    apiClient
      .get<PaginatedStatistics>("/statistics", { params: { page, perPage } })
      .then((r) => r.data),
};
