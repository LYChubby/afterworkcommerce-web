import "server-only";

import { env } from "@/lib/env";
import type { ApiResponse } from "@/types/api";

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly errors: Record<string, string[]> | null = null,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type ApiRequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { body, headers: requestHeaders, ...requestOptions } = options;

  const url = new URL(path.replace(/^\/+/, ""), `${env.apiBaseUrl}/`);

  const headers = new Headers(requestHeaders);

  headers.set("Accept", "application/json");

  if (body !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(url, {
    ...requestOptions,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: requestOptions.cache ?? "no-store",
  });

  let payload: ApiResponse<T>;

  try {
    payload = (await response.json()) as ApiResponse<T>;
  } catch {
    throw new ApiError("The server returned an invalid response.", response.status);
  }

  if (!response.ok || payload.success !== true) {
    throw new ApiError(payload.message || "Request failed.", response.status, payload.success === false ? payload.errors : null);
  }

  return payload.data;
}
