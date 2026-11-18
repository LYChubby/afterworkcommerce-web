import "client-only";

import type { ApiResponse } from "@/types/api";
import type { AuthUser, UserProfile } from "@/types/auth";

export class AuthServiceError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly errors: Record<string, string[]> | null = null,
  ) {
    super(message);
    this.name = "AuthServiceError";
  }
}

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);

  headers.set("Accept", "application/json");

  if (options.body !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  let response: Response;

  try {
    response = await fetch(url, {
      ...options,
      headers,
      credentials: "same-origin",
      cache: "no-store",
    });
  } catch {
    throw new AuthServiceError("Unable to connect to the application server.", 0);
  }

  let payload: ApiResponse<T>;

  try {
    payload = (await response.json()) as ApiResponse<T>;
  } catch {
    throw new AuthServiceError("The server returned an invalid response.", response.status);
  }

  if (!response.ok || payload.success !== true) {
    throw new AuthServiceError(payload.message || "Authentication request failed.", response.status, payload.success === false ? payload.errors : null);
  }

  return payload.data;
}

export async function exchangeGoogleCode(code: string): Promise<AuthUser> {
  const result = await request<{ user: AuthUser }>("/api/auth/google/exchange", {
    method: "POST",
    body: JSON.stringify({ code }),
  });

  return result.user;
}

export async function getCurrentUser(): Promise<UserProfile> {
  return request<UserProfile>("/api/auth/me", {
    method: "GET",
  });
}

export async function logout(): Promise<void> {
  await request<null>("/api/auth/logout", {
    method: "POST",
  });
}
