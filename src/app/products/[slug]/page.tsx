import { connection } from "next/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchProductApi } from "@/features/products/services/product-api";
import ProductGallery from "./ProductGallery";
import ProductVariants from "./ProductVariants";
import type { Product } from "@/types/product";

type ProductDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: ProductDetailPageProps) {
  const { slug } = await params;

  await connection();

  try {
    const response = await fetchProductApi<Product>(`products/${encodeURIComponent(slug)}`);

    if (!response.success || !response.data) {
      return {
        title: "Produk Tidak Ditemukan | AFTERWORK",
      };
    }

    return {
      title: `${response.data.name} | AFTERWORK`,
      description: response.data.description ?? `Detail produk ${response.data.name} dari AFTERWORK.`,
    };
  } catch {
    return {
      title: "Detail Produk | AFTERWORK",
    };
  }
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  await connection();

  const { slug } = await params;

  let product: Product | null = null;

  try {
    const response = await fetchProductApi<Product>(`products/${encodeURIComponent(slug)}`);

    if (response.success && response.data) {
      product = response.data;
    }
  } catch (error) {
    console.error("[ProductDetailPage] Failed to load product:", error);
  }

  if (product === null) {
    notFound();
  }

  const currentProduct = product;

  return (
    <main className="min-h-screen bg-[#F8F6F0]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link href="/products" className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-[#526454] transition-colors hover:text-[#243D2D] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#526454]">
          <span aria-hidden="true">←</span>
          Kembali ke Produk
        </Link>

        <p className="text-sm text-[#7B8176]">
          Home / Products / {currentProduct.category?.name ?? "Product"} / {currentProduct.name}
        </p>

        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          <ProductGallery images={currentProduct.images} productName={currentProduct.name} />

          <div className="space-y-6">
            <h1 className="text-2xl font-semibold text-[#243D2D] sm:text-3xl">{currentProduct.name}</h1>

            <p className="mt-2 text-sm text-[#7B8176]">{currentProduct.category?.name ?? "Uncategorized"}</p>

            <p className="mt-4 text-xl font-semibold text-[#243D2D]">
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                maximumFractionDigits: 0,
              }).format(Number(currentProduct.effective_price))}
            </p>

            {currentProduct.is_on_sale && currentProduct.discount_price && (
              <p className="mt-1 text-sm text-[#7B8176] line-through">
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  maximumFractionDigits: 0,
                }).format(Number(currentProduct.price))}
              </p>
            )}

            <p className="mt-4 text-sm text-[#526454]">{currentProduct.total_available_stock > 0 ? `Stok tersedia: ${currentProduct.total_available_stock}` : "Stok habis"}</p>

            <ProductVariants variants={currentProduct.variants} />

            {currentProduct.description && (
              <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
                <ProductGallery images={currentProduct.images} productName={currentProduct.name} />

                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-[#243D2D]">Deskripsi Produk</h2>

                  <p className="mt-2 whitespace-pre-line text-sm leading-7 text-[#526454]">{currentProduct.description}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
