import { NextResponse } from "next/server";

import { ApiError, apiRequest } from "@/lib/api-client";
import { getAuthToken } from "@/lib/auth-session";

interface CartItemRouteContext {
  params: Promise<{
    variantUuid: string;
  }>;
}

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

async function getVariantUuid(params: CartItemRouteContext["params"]) {
  const { variantUuid } = await params;

  return variantUuid.trim();
}

export async function PATCH(request: Request, { params }: CartItemRouteContext) {
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

  const variantUuid = await getVariantUuid(params);

  if (!variantUuid) {
    return NextResponse.json(
      {
        success: false,
        message: "Variant UUID is required.",
        data: null,
        errors: null,
      },
      { status: 400 },
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
    const cart = await apiRequest<unknown>(`cart/items/${encodeURIComponent(variantUuid)}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body,
    });

    return NextResponse.json({
      success: true,
      message: "Cart item updated successfully.",
      data: cart,
      meta: null,
    });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(_request: Request, { params }: CartItemRouteContext) {
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

  const variantUuid = await getVariantUuid(params);

  if (!variantUuid) {
    return NextResponse.json(
      {
        success: false,
        message: "Variant UUID is required.",
        data: null,
        errors: null,
      },
      { status: 400 },
    );
  }

  try {
    const cart = await apiRequest<unknown>(`cart/items/${encodeURIComponent(variantUuid)}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Cart item removed successfully.",
      data: cart,
      meta: null,
    });
  } catch (error) {
    return errorResponse(error);
  }
}
