import { NextResponse } from "next/server";

import { ApiError, apiRequest } from "@/lib/api-client";
import { getAuthToken } from "@/lib/auth-session";
import type { UserProfile } from "@/types/auth";

export async function GET() {
  const token = await getAuthToken();

  if (!token) {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthenticated.",
        data: null,
        errors: null,
      },
      { status: 401 },
    );
  }

  try {
    const user = await apiRequest<UserProfile>("auth/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return NextResponse.json({
      success: true,
      message: "User profile retrieved successfully.",
      data: user,
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
        message: "Unable to retrieve user profile.",
        data: null,
        errors: null,
      },
      { status: 502 },
    );
  }
}
