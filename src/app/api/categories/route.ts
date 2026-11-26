import { NextResponse, connection } from "next/server";

import { fetchProductApi } from "@/features/products/services/product-api";
import type { ProductCategory } from "@/types/product";

export async function GET() {
  await connection();

  try {
    const response = await fetchProductApi<ProductCategory[]>("categories");

    return NextResponse.json(response, {
      status: 200,
    });
  } catch (error) {
    console.error("[GET /api/categories]", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to retrieve categories.",
        data: null,
        errors: null,
      },
      {
        status: 500,
      },
    );
  }
}
