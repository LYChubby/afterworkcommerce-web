import "client-only";

import type { ApiResponse } from "@/types/api";
import type { Address, AddressPayload, UpdateAddressPayload } from "@/types/address";

export class AddressServiceError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly errors: Record<string, string[]> | null = null,
  ) {
    super(message);
    this.name = "AddressServiceError";
  }
}

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
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
    throw new AddressServiceError("The server returned an invalid response.", response.status);
  }

  if (!response.ok || payload.success !== true) {
    throw new AddressServiceError(payload.message || "Address request failed.", response.status, payload.success === false ? payload.errors : null);
  }

  return payload.data;
}

export async function getAddresses(): Promise<Address[]> {
  return request<Address[]>("/api/addresses", {
    method: "GET",
  });
}

export async function getAddress(uuid: string): Promise<Address> {
  return request<Address>(`/api/addresses/${encodeURIComponent(uuid)}`, {
    method: "GET",
  });
}

export async function createAddress(data: AddressPayload): Promise<Address> {
  return request<Address>("/api/addresses", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateAddress(uuid: string, data: UpdateAddressPayload): Promise<Address> {
  return request<Address>(`/api/addresses/${encodeURIComponent(uuid)}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteAddress(uuid: string): Promise<void> {
  await request<null>(`/api/addresses/${encodeURIComponent(uuid)}`, {
    method: "DELETE",
  });
}
