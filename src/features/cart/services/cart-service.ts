import "client-only";

import type { ApiResponse } from "@/types/api";
import type { AddCartItemPayload, Cart, UpdateCartItemPayload } from "@/types/cart";

export class CartServiceError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly errors: Record<string, string[]> | null = null,
  ) {
    super(message);
    this.name = "CartServiceError";
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);

  headers.set("Accept", "application/json");

  if (options.body !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
    credentials: "same-origin",
    cache: "no-store",
  });

  let payload: ApiResponse<T>;

  try {
    payload = (await response.json()) as ApiResponse<T>;
  } catch {
    throw new CartServiceError("Cart API returned an invalid response.", response.status);
  }

  if (!response.ok || payload.success !== true) {
    if (payload.success === false) {
      throw new CartServiceError(payload.message || "Cart request failed.", response.status, payload.errors);
    }

    throw new CartServiceError("Cart request failed.", response.status);
  }

  return payload.data;
}

export const CartService = {
  getCart(): Promise<Cart> {
    return request<Cart>("/api/cart", {
      method: "GET",
    });
  },

  addItem(payload: AddCartItemPayload): Promise<Cart> {
    return request<Cart>("/api/cart", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  updateItem(variantUuid: string, payload: UpdateCartItemPayload): Promise<Cart> {
    return request<Cart>(`/api/cart/items/${encodeURIComponent(variantUuid)}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },

  removeItem(variantUuid: string): Promise<Cart> {
    return request<Cart>(`/api/cart/items/${encodeURIComponent(variantUuid)}`, {
      method: "DELETE",
    });
  },
};
