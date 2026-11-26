import { NextRequest, NextResponse } from "next/server";

import { fetchProductApi } from "@/features/products/services/product-api";
import type { Product } from "@/types/product";

const ALLOWED_FILTERS = ["search", "category", "min_price", "max_price", "availability", "sort", "per_page", "page"] as const;

export async function GET(request: NextRequest) {
  const searchParams = new URLSearchParams();

  for (const key of ALLOWED_FILTERS) {
    const value = request.nextUrl.searchParams.get(key);

    if (value !== null && value.trim() !== "") {
      searchParams.set(key, value);
    }
  }

  try {
    const response = await fetchProductApi<Product[]>("products", searchParams);

    return NextResponse.json(response, {
      status: 200,
    });
  } catch (error) {
    console.error("[GET /api/products]", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to retrieve products.",
        data: null,
        errors: null,
      },
      {
        status: 500,
      },
    );
  }
}
