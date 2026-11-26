import { connection } from "next/server";

import ProductsClient from "./ProductsClient";

import { fetchProductApi } from "@/features/products/services/product-api";
import type { Product, ProductCategory, ProductPaginationMeta } from "@/types/product";

const DEFAULT_META: ProductPaginationMeta = {
  current_page: 1,
  last_page: 1,
  per_page: 12,
  total: 0,
  from: null,
  to: null,
};

function isProductPaginationMeta(value: unknown): value is ProductPaginationMeta {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const meta = value as Record<string, unknown>;

  return (
    typeof meta.current_page === "number" &&
    typeof meta.last_page === "number" &&
    typeof meta.per_page === "number" &&
    typeof meta.total === "number" &&
    (typeof meta.from === "number" || meta.from === null) &&
    (typeof meta.to === "number" || meta.to === null)
  );
}

export default async function ProductsPage() {
  await connection();

  let initialProducts: Product[] = [];
  let initialCategories: ProductCategory[] = [];
  let initialMeta: ProductPaginationMeta = DEFAULT_META;

  const productParams = new URLSearchParams({
    page: "1",
    per_page: "12",
    sort: "latest",
  });

  const [productsResult, categoriesResult] = await Promise.allSettled([fetchProductApi<Product[]>("products", productParams), fetchProductApi<ProductCategory[]>("categories")]);

  if (productsResult.status === "fulfilled") {
    const response = productsResult.value;

    if (response.success && response.data !== null) {
      initialProducts = response.data;

      if (isProductPaginationMeta(response.meta)) {
        initialMeta = response.meta;
      }
    } else {
      console.error("[ProductsPage] Product API returned an unsuccessful response:", response.message);
    }
  } else {
    console.error("[ProductsPage] Failed to load products:", productsResult.reason);
  }

  if (categoriesResult.status === "fulfilled") {
    const response = categoriesResult.value;

    if (response.success && response.data !== null) {
      initialCategories = response.data;
    } else {
      console.error("[ProductsPage] Category API returned an unsuccessful response:", response.message);
    }
  } else {
    console.error("[ProductsPage] Failed to load categories:", categoriesResult.reason);
  }

  return <ProductsClient initialProducts={initialProducts} initialCategories={initialCategories} initialMeta={initialMeta} />;
}
