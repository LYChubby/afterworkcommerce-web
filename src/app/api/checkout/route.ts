import { NextResponse } from "next/server";

import { ApiError, apiRequest } from "@/lib/api-client";
import { getAuthToken } from "@/lib/auth-session";
import type { CheckoutPayload, Order } from "@/types/order";

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
      message: "Unable to process checkout request.",
      data: null,
      errors: null,
    },
    { status: 502 },
  );
}

export async function POST(request: Request) {
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
    const order = await apiRequest<Order>("checkout", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: body as CheckoutPayload,
    });

    return NextResponse.json({
      success: true,
      message: "Order created successfully.",
      data: order,
      meta: null,
    });
  } catch (error) {
    return errorResponse(error);
  }
}
