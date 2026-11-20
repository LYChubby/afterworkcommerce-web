import { NextResponse } from "next/server";

import { ApiError, apiRequest } from "@/lib/api-client";
import { setAuthToken } from "@/lib/auth-session";
import type { AuthTokenResponse } from "@/types/auth";

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);

  if (typeof body !== "object" || body === null || !("email" in body) || !("password" in body) || typeof body.email !== "string" || typeof body.password !== "string" || body.email.trim() === "" || body.password === "") {
    return NextResponse.json(
      {
        success: false,
        message: "Email dan password wajib diisi.",
        data: null,
        errors: null,
      },
      { status: 422 },
    );
  }

  try {
    const auth = await apiRequest<AuthTokenResponse>("auth/login", {
      method: "POST",
      body: {
        email: body.email.trim(),
        password: body.password,
      },
    });

    if (!auth.access_token || auth.token_type !== "Bearer") {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid authentication response.",
          data: null,
          errors: null,
        },
        { status: 502 },
      );
    }

    await setAuthToken(auth.access_token);

    return NextResponse.json({
      success: true,
      message: "Login berhasil.",
      data: {
        user: auth.user,
      },
      meta: null,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
          data: null,
          errors: error.errors,
        },
        { status: error.status },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Unable to complete authentication.",
        data: null,
        errors: null,
      },
      { status: 502 },
    );
  }
}
