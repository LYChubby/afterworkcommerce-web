import "client-only";

import type { ApiResponse } from "@/types/api";
import type { ShippingRatePayload, ShippingRateResponse } from "@/types/shipping";

export class ShippingServiceError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly errors: Record<string, string[]> | null = null,
  ) {
    super(message);
    this.name = "ShippingServiceError";
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
    throw new ShippingServiceError("Shipping API returned an invalid response.", response.status);
  }

  if (!response.ok || payload.success !== true) {
    if (payload.success === false) {
      throw new ShippingServiceError(payload.message || "Shipping request failed.", response.status, payload.errors);
    }

    throw new ShippingServiceError("Shipping request failed.", response.status);
  }

  return payload.data;
}

export const ShippingService = {
  getRates(payload: ShippingRatePayload): Promise<ShippingRateResponse> {
    return request<ShippingRateResponse>("/api/shipping/rates", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};
