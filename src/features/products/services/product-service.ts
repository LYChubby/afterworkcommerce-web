import "client-only";

import type { ApiResponse, ApiSuccessResponse } from "@/types/api";
import type { Product, ProductFilters, ProductPaginationMeta } from "@/types/product";

export class ProductServiceError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly errors: Record<string, string[]> | null = null,
  ) {
    super(message);
    this.name = "ProductServiceError";
  }
}

function isProductPaginationMeta(meta: unknown): meta is ProductPaginationMeta {
  if (!meta || typeof meta !== "object") {
    return false;
  }

  const value = meta as Record<string, unknown>;

  return (
    typeof value.current_page === "number" &&
    typeof value.last_page === "number" &&
    typeof value.per_page === "number" &&
    typeof value.total === "number" &&
    (typeof value.from === "number" || value.from === null) &&
    (typeof value.to === "number" || value.to === null)
  );
}

async function request<T>(url: string, options: RequestInit = {}): Promise<ApiSuccessResponse<T>> {
  const headers = new Headers(options.headers);

  headers.set("Accept", "application/json");

  if (options.body !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: "same-origin",
    cache: "no-store",
  });

  let payload: ApiResponse<T>;

  try {
    payload = (await response.json()) as ApiResponse<T>;
  } catch {
    throw new ProductServiceError("The server returned an invalid response.", response.status);
  }

  if (!response.ok || payload.success !== true) {
    throw new ProductServiceError(payload.message || "Product request failed.", response.status, payload.success === false ? payload.errors : null);
  }

  return payload;
}

export async function getProducts(filters: ProductFilters = {}): Promise<{ data: Product[]; meta: ProductPaginationMeta }> {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, String(value));
    }
  }

  const query = params.toString();
  const url = query ? `/api/products?${query}` : "/api/products";

  const response = await request<Product[]>(url, {
    method: "GET",
  });

  if (!isProductPaginationMeta(response.meta)) {
    throw new ProductServiceError("Product pagination metadata is invalid or unavailable.", 500);
  }

  return {
    data: response.data,
    meta: response.meta,
  };
}

export async function getProduct(slug: string): Promise<Product> {
  const response = await request<Product>(`/api/products/${encodeURIComponent(slug)}`, {
    method: "GET",
  });

  return response.data;
}
