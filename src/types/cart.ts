import type { ProductImage } from "@/types/product";

export interface CartVariantSize {
  uuid: string | null;
  name: string | null;
}

export interface CartVariantColor {
  uuid: string | null;
  name: string | null;
  hex_code: string | null;
}

export interface CartItemVariant {
  uuid: string | null;
  sku: string | null;
  size: CartVariantSize;
  color: CartVariantColor;
}

export interface CartItemProduct {
  uuid: string | null;
  name: string | null;
  slug: string | null;
  image: ProductImage | null;
}

export interface CartItem {
  variant: CartItemVariant;
  product: CartItemProduct;
  quantity: number;
  unit_price: number;
  effective_unit_price: number;
  line_subtotal: number;
  line_discount: number;
  line_total: number;
}

export interface CartSummary {
  items_count: number;
  total_quantity: number;
  subtotal: number;
  discount_total: number;
  total: number;
}

export interface Cart {
  uuid: string;
  items: CartItem[];
  summary: CartSummary;
  created_at: string;
  updated_at: string;
}

export interface AddCartItemPayload {
  variant_uuid: string;
  quantity: number;
}

export interface UpdateCartItemPayload {
  quantity: number;
}
