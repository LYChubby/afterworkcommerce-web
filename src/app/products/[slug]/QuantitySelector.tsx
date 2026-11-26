"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";

type QuantitySelectorProps = {
  stock: number;
  onQuantityChange?: (quantity: number) => void;
};

export default function QuantitySelector({ stock, onQuantityChange }: QuantitySelectorProps) {
  const maxStock = Math.max(0, stock);
  const [quantity, setQuantity] = useState(1);

  const isOutOfStock = maxStock <= 0;
  const currentQuantity = isOutOfStock ? 0 : Math.min(Math.max(quantity, 1), maxStock);

  function updateQuantity(nextQuantity: number) {
    const normalizedQuantity = Math.min(Math.max(nextQuantity, 1), maxStock);

    setQuantity(normalizedQuantity);
    onQuantityChange?.(normalizedQuantity);
  }

  function handleDecrease() {
    if (isOutOfStock) return;

    updateQuantity(currentQuantity - 1);
  }

  function handleIncrease() {
    if (isOutOfStock) return;

    updateQuantity(currentQuantity + 1);
  }

  function handleInputChange(value: string) {
    if (value === "") return;

    const parsedValue = Number(value);

    if (!Number.isInteger(parsedValue) || isOutOfStock) {
      return;
    }

    updateQuantity(parsedValue);
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-[#243D2D]">Jumlah</h3>

      <div className={`inline-flex items-center overflow-hidden rounded-xl border border-[#D9D8CE] bg-white ${isOutOfStock ? "opacity-50" : ""}`}>
        <button
          type="button"
          onClick={handleDecrease}
          disabled={isOutOfStock || currentQuantity <= 1}
          aria-label="Kurangi jumlah"
          className="flex h-11 w-11 items-center justify-center text-[#355640] transition-colors hover:bg-[#EFEEE7] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Minus size={16} />
        </button>

        <input
          type="number"
          min={1}
          max={maxStock}
          value={currentQuantity}
          onChange={(event) => handleInputChange(event.target.value)}
          disabled={isOutOfStock}
          aria-label="Jumlah pembelian"
          className="h-11 w-14 border-x border-[#D9D8CE] bg-transparent text-center text-sm font-medium text-[#243D2D] outline-none disabled:cursor-not-allowed"
        />

        <button
          type="button"
          onClick={handleIncrease}
          disabled={isOutOfStock || currentQuantity >= maxStock}
          aria-label="Tambah jumlah"
          className="flex h-11 w-11 items-center justify-center text-[#355640] transition-colors hover:bg-[#EFEEE7] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Plus size={16} />
        </button>
      </div>

      <p className="text-xs text-[#7B8176]">{isOutOfStock ? "Stok varian tidak tersedia" : `Maksimal pembelian ${maxStock} item`}</p>
    </div>
  );
}
