import axios, { AxiosError } from "axios";

const baseURL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

export const apiClient = axios.create({
  baseURL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export type ApiError = AxiosError<{
  statusCode?: number;
  message?: string;
  errors?: { field: string; message: string }[];
}>;

export function extractApiError(err: unknown): {
  message: string;
  fieldErrors: Record<string, string>;
} {
  const fieldErrors: Record<string, string> = {};
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as
      | { message?: string; errors?: { field: string; message: string }[] }
      | undefined;
    if (data?.errors) {
      for (const e of data.errors) fieldErrors[e.field] = e.message;
    }
    return {
      message:
        data?.message ?? err.message ?? "요청 처리 중 오류가 발생했습니다.",
      fieldErrors,
    };
  }
  return {
    message:
      err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.",
    fieldErrors,
  };
}
