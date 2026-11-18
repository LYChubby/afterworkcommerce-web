import { NextResponse } from "next/server";

import { ApiError, apiRequest } from "@/lib/api-client";
import { clearAuthToken, getAuthToken } from "@/lib/auth-session";

export async function POST() {
  const token = await getAuthToken();

  if (!token) {
    return NextResponse.json(
      {
        success: true,
        message: "You are already logged out.",
        data: null,
        meta: null,
      },
      { status: 200 },
    );
  }

  try {
    await apiRequest<unknown>("auth/logout", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    await clearAuthToken();

    return NextResponse.json({
      success: true,
      message: "Logout successful.",
      data: null,
      meta: null,
    });
  } catch (error) {
    await clearAuthToken();

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
        message: "Unable to complete logout.",
        data: null,
        errors: null,
      },
      { status: 502 },
    );
  }
}
