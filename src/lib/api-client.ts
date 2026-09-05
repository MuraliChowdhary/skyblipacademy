import type { ApiResponse } from "@/src/types/api";

export class ApiRequestError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ApiRequestError";
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
    // Same-origin cookies (the NextAuth session) are sent automatically
    // for relative paths — no manual credentials handling needed.
  });

  const body: ApiResponse<T> = await res.json();

  if (!body.success) {
    // One error shape everywhere — a mutation's onError handler can
    // switch on `error.code` (e.g. "ALREADY_ENROLLED") without ever
    // parsing a raw HTTP status.
    throw new ApiRequestError(body.error.code, body.error.message, res.status);
  }
  return body.data;
}

export const apiClient = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, data?: unknown, init?: RequestInit) =>
    request<T>(path, {
      ...init,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    }),
  patch: <T>(path: string, data?: unknown) =>
    request<T>(path, { method: "PATCH", body: data ? JSON.stringify(data) : undefined }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};
