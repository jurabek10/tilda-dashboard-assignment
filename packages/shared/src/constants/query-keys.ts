export const STATISTICS_QUERY_KEYS = {
  all: ["statistics"] as const,
  list: (page: number, perPage: number) =>
    ["statistics", "list", { page, perPage }] as const,
};

export const AUTH_QUERY_KEYS = {
  me: ["auth", "me"] as const,
};
