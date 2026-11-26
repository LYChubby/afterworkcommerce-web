"use client";

import { useCallback, useState } from "react";
import { ShoppingBag, LoaderCircle } from "lucide-react";
import ProductVariants from "./ProductVariants";
import { CartService, CartServiceError } from "@/features/cart/services/cart-service";
import { useNotification } from "@/components/ui/notification-provider";
import type { ProductVariant } from "@/types/product";

type ProductPurchaseProps = {
  variants: ProductVariant[];
};

type ProductSelection = {
  variantUuid: string;
  quantity: number;
};

export default function ProductPurchase({ variants }: ProductPurchaseProps) {
  const { notify } = useNotification();

  const [selection, setSelection] = useState<ProductSelection | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelectionChange = useCallback((nextSelection: ProductSelection | null) => {
    setSelection(nextSelection);
  }, []);

  async function handleAddToCart() {
    if (!selection || isSubmitting) return;

    setIsSubmitting(true);

    try {
      await CartService.addItem({
        variant_uuid: selection.variantUuid,
        quantity: selection.quantity,
      });

      notify("success", {
        title: "Berhasil ditambahkan",
        description: "Produk berhasil ditambahkan ke keranjang.",
      });
    } catch (error) {
      notify("error", {
        title: "Gagal menambahkan produk",
        description: error instanceof CartServiceError ? error.message : "Terjadi kesalahan saat menambahkan produk ke keranjang. Silakan coba lagi.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-5">
      <ProductVariants variants={variants} onSelectionChange={handleSelectionChange} />

      <button
        type="button"
        onClick={handleAddToCart}
        disabled={!selection || isSubmitting}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#355640] px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#243D2D] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#526454] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? (
          <>
            <LoaderCircle size={18} className="animate-spin" />
            Menambahkan...
          </>
        ) : (
          <>
            <ShoppingBag size={18} />
            Tambah ke Keranjang
          </>
        )}
      </button>
    </div>
  );
}
