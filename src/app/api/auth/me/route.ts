import { NextResponse } from "next/server";

import { ApiError, apiRequest } from "@/lib/api-client";
import { getAuthToken } from "@/lib/auth-session";
import type { UserProfile } from "@/types/auth";
import type { UpdateProfilePayload } from "@/types/auth";

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

export async function PUT(request: Request) {
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
    const payload = (await request.json()) as UpdateProfilePayload;

    const user = await apiRequest<UserProfile>("auth/me", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: payload,
    });

    return NextResponse.json({
      success: true,
      message: "User profile updated successfully.",
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
        message: "Unable to update user profile.",
        data: null,
        errors: null,
      },
      { status: 502 },
    );
  }
}
