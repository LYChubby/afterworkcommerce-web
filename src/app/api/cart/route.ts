import { NextResponse } from "next/server";

import { ApiError, apiRequest } from "@/lib/api-client";
import { getAuthToken } from "@/lib/auth-session";

function errorResponse(error: unknown) {
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
      message: "Unable to process cart request.",
      data: null,
      errors: null,
    },
    { status: 502 },
  );
}

async function getToken() {
  return getAuthToken();
}

export async function GET() {
  const token = await getToken();

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
    const cart = await apiRequest<unknown>("cart", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Cart retrieved successfully.",
      data: cart,
      meta: null,
    });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: Request) {
  const token = await getToken();

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

  const body: unknown = await request.json().catch(() => null);

  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid request body.",
        data: null,
        errors: null,
      },
      { status: 400 },
    );
  }

  try {
    const cart = await apiRequest<unknown>("cart/items", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body,
    });

    return NextResponse.json({
      success: true,
      message: "Cart item added successfully.",
      data: cart,
      meta: null,
    });
  } catch (error) {
    return errorResponse(error);
  }
}
