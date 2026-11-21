import { NextResponse } from "next/server";

import { ApiError, apiRequest } from "@/lib/api-client";
import { setAuthToken } from "@/lib/auth-session";
import type { AuthTokenResponse } from "@/types/auth";

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);

  if (
    typeof body !== "object" ||
    body === null ||
    !("name" in body) ||
    !("email" in body) ||
    !("password" in body) ||
    !("password_confirmation" in body) ||
    typeof body.name !== "string" ||
    typeof body.email !== "string" ||
    typeof body.password !== "string" ||
    typeof body.password_confirmation !== "string" ||
    body.name.trim() === "" ||
    body.email.trim() === "" ||
    body.password === "" ||
    body.password_confirmation === ""
  ) {
    return NextResponse.json(
      {
        success: false,
        message: "Nama, email, dan password wajib diisi.",
        data: null,
        errors: null,
      },
      { status: 422 },
    );
  }

  try {
    const auth = await apiRequest<AuthTokenResponse>("auth/register", {
      method: "POST",
      body: {
        name: body.name.trim(),
        email: body.email.trim(),
        password: body.password,
        password_confirmation: body.password_confirmation,
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
      message: "Registrasi berhasil.",
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
        message: "Unable to complete registration.",
        data: null,
        errors: null,
      },
      { status: 502 },
    );
  }
}
