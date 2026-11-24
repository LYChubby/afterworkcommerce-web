import { NextResponse } from "next/server";

import { ApiError, apiRequest } from "@/lib/api-client";
import { getAuthToken } from "@/lib/auth-session";

interface AddressRouteContext {
  params: Promise<{
    uuid: string;
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
      message: "Unable to process address request.",
      data: null,
      errors: null,
    },
    { status: 502 },
  );
}

async function getToken() {
  return getAuthToken();
}

export async function GET(_request: Request, { params }: AddressRouteContext) {
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

  const { uuid } = await params;

  try {
    const address = await apiRequest<unknown>(`addresses/${encodeURIComponent(uuid)}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Address retrieved successfully.",
      data: address,
      meta: null,
    });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PUT(request: Request, { params }: AddressRouteContext) {
  return updateAddress(request, params, "PUT");
}

export async function PATCH(request: Request, { params }: AddressRouteContext) {
  return updateAddress(request, params, "PATCH");
}

async function updateAddress(request: Request, params: AddressRouteContext["params"], method: "PUT" | "PATCH") {
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

  const { uuid } = await params;
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
    const address = await apiRequest<unknown>(`addresses/${encodeURIComponent(uuid)}`, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body,
    });

    return NextResponse.json({
      success: true,
      message: "Address updated successfully.",
      data: address,
      meta: null,
    });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(_request: Request, { params }: AddressRouteContext) {
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

  const { uuid } = await params;

  try {
    const result = await apiRequest<unknown>(`addresses/${encodeURIComponent(uuid)}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Address deleted successfully.",
      data: result,
      meta: null,
    });
  } catch (error) {
    return errorResponse(error);
  }
}
