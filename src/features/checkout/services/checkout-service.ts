import "client-only";

import type { ApiResponse } from "@/types/api";
import type { CheckoutPayload, Order } from "@/types/order";

export class CheckoutServiceError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly errors: Record<string, string[]> | null = null,
  ) {
    super(message);
    this.name = "CheckoutServiceError";
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
    throw new CheckoutServiceError("Checkout API returned an invalid response.", response.status);
  }

  if (!response.ok || payload.success !== true) {
    if (payload.success === false) {
      throw new CheckoutServiceError(payload.message || "Checkout failed.", response.status, payload.errors);
    }

    throw new CheckoutServiceError("Checkout failed.", response.status);
  }

  return payload.data;
}

export const CheckoutService = {
  createOrder(payload: CheckoutPayload): Promise<Order> {
    return request<Order>("/api/checkout", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};
