import { NextResponse } from "next/server";

import { ApiError, apiRequest } from "@/lib/api-client";
import { setAuthToken } from "@/lib/auth-session";
import type { AuthTokenResponse } from "@/types/auth";

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);

  if (typeof body !== "object" || body === null || !("code" in body) || typeof body.code !== "string" || body.code.trim() === "") {
    return NextResponse.json(
      {
        success: false,
        message: "OAuth code is required.",
        data: null,
        errors: null,
      },
      { status: 422 },
    );
  }

  try {
    const auth = await apiRequest<AuthTokenResponse>("auth/google/exchange", {
      method: "POST",
      body: {
        code: body.code.trim(),
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
