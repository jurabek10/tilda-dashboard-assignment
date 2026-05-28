export const queryKeys = {
  auth: { me: ["auth", "me"] as const },
  statistics: {
    all: ["statistics"] as const,
    list: (page: number, perPage: number) =>
      ["statistics", "list", { page, perPage }] as const,
  },
} as const;
