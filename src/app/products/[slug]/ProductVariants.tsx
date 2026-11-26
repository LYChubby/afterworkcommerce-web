"use client";

import { useMemo, useState } from "react";
import type { ProductVariant } from "@/types/product";
import QuantitySelector from "./QuantitySelector";

type ProductVariantsProps = {
  variants: ProductVariant[];
};

type VariantOption = {
  id: string;
  name: string;
};

function getOptionId(uuid: string | null, name: string | null) {
  return uuid ?? name ?? "";
}

export default function ProductVariants({ variants }: ProductVariantsProps) {
  const availableVariants = variants.filter((variant) => variant.is_available);

  const sizes = useMemo<VariantOption[]>(() => {
    const unique = new Map<string, VariantOption>();

    for (const variant of variants) {
      const name = variant.size.name;
      const id = getOptionId(variant.size.uuid, name);

      if (name && id && !unique.has(id)) {
        unique.set(id, { id, name });
      }
    }

    return Array.from(unique.values());
  }, [variants]);

  const colors = useMemo<VariantOption[]>(() => {
    const unique = new Map<string, VariantOption>();

    for (const variant of variants) {
      const name = variant.color.name;
      const id = getOptionId(variant.color.uuid, name);

      if (name && id && !unique.has(id)) {
        unique.set(id, { id, name });
      }
    }

    return Array.from(unique.values());
  }, [variants]);

  const [selectedSize, setSelectedSize] = useState<string>(sizes.find((size) => availableVariants.some((variant) => getOptionId(variant.size.uuid, variant.size.name) === size.id))?.id ?? sizes[0]?.id ?? "");

  const [selectedColor, setSelectedColor] = useState<string>(colors.find((color) => availableVariants.some((variant) => getOptionId(variant.color.uuid, variant.color.name) === color.id))?.id ?? colors[0]?.id ?? "");

  const selectedVariant = variants.find((variant) => {
    const sizeMatches = !sizes.length || getOptionId(variant.size.uuid, variant.size.name) === selectedSize;

    const colorMatches = !colors.length || getOptionId(variant.color.uuid, variant.color.name) === selectedColor;

    return sizeMatches && colorMatches;
  });

  const isSizeAvailable = (sizeId: string) => {
    return variants.some((variant) => getOptionId(variant.size.uuid, variant.size.name) === sizeId && variant.is_available);
  };

  const isColorAvailable = (colorId: string) => {
    return variants.some((variant) => getOptionId(variant.color.uuid, variant.color.name) === colorId && variant.is_available);
  };

  if (variants.length === 0) {
    return <p className="text-sm text-[#7B8176]">Produk ini tidak memiliki pilihan varian.</p>;
  }

  return (
    <div className="space-y-6">
      {/* Size options */}
      {sizes.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-[#243D2D]">Ukuran</h3>

            {selectedSize && <span className="text-sm text-[#7B8176]">{sizes.find((size) => size.id === selectedSize)?.name}</span>}
          </div>

          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => {
              const selected = selectedSize === size.id;
              const disabled = !isSizeAvailable(size.id);

              return (
                <button
                  key={size.id}
                  type="button"
                  disabled={disabled}
                  onClick={() => setSelectedSize(size.id)}
                  aria-pressed={selected}
                  className={`min-w-12 rounded-lg border px-4 py-2.5 text-sm transition-colors ${selected ? "border-[#355640] bg-[#355640] text-white" : "border-[#D9D8CE] bg-white text-[#243D2D] hover:border-[#355640]"} ${
                    disabled ? "cursor-not-allowed opacity-40 line-through" : ""
                  }`}
                >
                  {size.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Color options */}
      {colors.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-[#243D2D]">Warna</h3>

            {selectedColor && <span className="text-sm text-[#7B8176]">{colors.find((color) => color.id === selectedColor)?.name}</span>}
          </div>

          <div className="flex flex-wrap gap-3">
            {colors.map((color) => {
              const selected = selectedColor === color.id;
              const disabled = !isColorAvailable(color.id);

              const colorVariant = variants.find((variant) => getOptionId(variant.color.uuid, variant.color.name) === color.id);

              const hexCode = colorVariant?.color.hex_code;

              return (
                <button
                  key={color.id}
                  type="button"
                  disabled={disabled}
                  onClick={() => setSelectedColor(color.id)}
                  aria-label={`Pilih warna ${color.name}`}
                  aria-pressed={selected}
                  title={color.name}
                  className={`flex items-center gap-2 rounded-full border px-3 py-2 transition-colors ${
                    selected ? "border-[#355640] ring-1 ring-[#355640]" : "border-[#D9D8CE] hover:border-[#355640]"
                  } ${disabled ? "cursor-not-allowed opacity-40" : ""}`}
                >
                  <span
                    className="h-5 w-5 rounded-full border border-black/10"
                    style={{
                      backgroundColor: hexCode || "#EAE7DE",
                    }}
                  />

                  <span className="text-sm text-[#243D2D]">{color.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Selected variant details */}
      <div className="rounded-xl bg-[#EFEEE7] p-4">
        {selectedVariant ? (
          <div className="space-y-2">
            <p className="text-sm font-medium text-[#243D2D]">SKU: {selectedVariant.sku}</p>

            <p className="text-sm text-[#526454]">{selectedVariant.is_available ? `Stok tersedia: ${selectedVariant.available_stock}` : "Varian ini sedang tidak tersedia"}</p>
          </div>
        ) : (
          <p className="text-sm text-[#7B8176]">Kombinasi ukuran dan warna ini tidak tersedia.</p>
        )}
      </div>
      {selectedVariant && <QuantitySelector key={selectedVariant.uuid} stock={selectedVariant.is_available ? selectedVariant.available_stock : 0} />}
    </div>
  );
}
