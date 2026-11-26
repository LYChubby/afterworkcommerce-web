"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageIcon } from "lucide-react";

import type { ProductImage } from "@/types/product";

type ProductGalleryProps = {
  images: ProductImage[];
  productName: string;
};

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const sortedImages = [...images].sort((a, b) => Number(b.is_primary) - Number(a.is_primary) || a.sort_order - b.sort_order);

  const [selectedImage, setSelectedImage] = useState<ProductImage | null>(sortedImages[0] ?? null);

  const activeImage = sortedImages.find((image) => image.id === selectedImage?.id) ?? sortedImages[0] ?? null;

  if (sortedImages.length === 0) {
    return (
      <div className="flex aspect-square w-full items-center justify-center rounded-2xl bg-[#EAE7DE] text-[#8B9387]">
        <div className="flex flex-col items-center gap-3">
          <ImageIcon size={48} strokeWidth={1.25} />
          <span className="text-sm">Foto produk belum tersedia</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main image */}
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-[#EAE7DE]">
        {activeImage && <Image src={activeImage.url} alt={`${productName} - foto produk`} fill priority unoptimized sizes="(max-width: 768px) 100vw, 50vw" className="object-contain" />}
      </div>

      {/* Thumbnail gallery */}
      {sortedImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {sortedImages.map((image, index) => {
            const isSelected = activeImage?.id === image.id;

            return (
              <button
                key={image.id}
                type="button"
                onClick={() => setSelectedImage(image)}
                aria-label={`Pilih foto ${index + 1} produk ${productName}`}
                aria-pressed={isSelected}
                className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-[#EAE7DE] transition-all sm:h-24 sm:w-24 ${isSelected ? "ring-2 ring-[#355640] ring-offset-2 ring-offset-[#F8F6F0]" : "opacity-70 hover:opacity-100"}`}
              >
                <Image src={image.url} alt={`${productName} - thumbnail ${index + 1}`} fill unoptimized sizes="96px" className="object-contain" />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
