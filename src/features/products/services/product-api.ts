import "server-only";

import { env } from "@/lib/env";
import type { ApiResponse } from "@/types/api";

export async function fetchProductApi<T>(path: string, searchParams?: URLSearchParams): Promise<ApiResponse<T>> {
  const url = new URL(path.replace(/^\/+/, ""), `${env.apiBaseUrl}/`);

  if (searchParams) {
    url.search = searchParams.toString();
  }

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
  });

  let payload: ApiResponse<T>;

  try {
    payload = (await response.json()) as ApiResponse<T>;
  } catch {
    throw new Error("The product API returned an invalid response.");
  }

  if (!response.ok || payload.success !== true) {
    if (payload.success === false) {
      throw new Error(payload.message || "Product API request failed.");
    }

    throw new Error("Product API request failed.");
  }

  return payload;
}
