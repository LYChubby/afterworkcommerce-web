export interface ProductCategory {
  uuid: string;
  name: string;
  slug: string;
  description: string | null;
  is_active: boolean;
  products_count?: number;
}

export interface ProductImage {
  id: number;
  url: string;
  is_primary: boolean;
  sort_order: number;
}

export interface ProductVariantSize {
  uuid: string | null;
  name: string | null;
}

export interface ProductVariantColor {
  uuid: string | null;
  name: string | null;
  hex_code: string | null;
}

export interface ProductVariant {
  uuid: string;
  sku: string;
  size: ProductVariantSize;
  color: ProductVariantColor;
  available_stock: number;
  is_available: boolean;
}

export interface ProductDimensions {
  length_cm: number | null;
  width_cm: number | null;
  height_cm: number | null;
}

export interface Product {
  uuid: string;
  name: string;
  slug: string;
  is_active: boolean;
  description: string | null;

  price: string;
  discount_price: string | null;
  effective_price: string;
  is_on_sale: boolean;

  weight_grams: number | null;
  dimensions: ProductDimensions;

  category: ProductCategory | null;
  images: ProductImage[];
  variants: ProductVariant[];

  total_available_stock: number;
  created_at: string;
}

export interface ProductPaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
}

export interface ProductFilters {
  search?: string;
  category?: string;
  min_price?: number;
  max_price?: number;
  availability?: "available" | "out_of_stock";
  sort?: "latest" | "price_asc" | "price_desc" | "name_asc";
  per_page?: number;
  page?: number;
}

export interface ProductListResponse {
  data: Product[];
  meta: ProductPaginationMeta;
}
