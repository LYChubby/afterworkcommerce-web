import { NextResponse } from "next/server";

import { fetchProductApi } from "@/features/products/services/product-api";
import type { Product } from "@/types/product";

type ProductDetailRouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(_request: Request, context: ProductDetailRouteContext) {
  const { slug } = await context.params;
  const normalizedSlug = slug.trim();

  if (!normalizedSlug) {
    return NextResponse.json(
      {
        success: false,
        message: "Product slug is required.",
        data: null,
        errors: null,
      },
      {
        status: 400,
      },
    );
  }

  try {
    const response = await fetchProductApi<Product>(`products/${encodeURIComponent(normalizedSlug)}`);

    return NextResponse.json(response, {
      status: 200,
    });
  } catch (error) {
    console.error("[GET /api/products/[slug]]", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to retrieve product details.",
        data: null,
        errors: null,
      },
      {
        status: 500,
      },
    );
  }
}
