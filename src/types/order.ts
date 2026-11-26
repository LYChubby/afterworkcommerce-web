export interface OrderItem {
  uuid: string;
  product_name: string;
  product_slug: string;
  sku: string;
  size_name: string;
  color_name: string;
  color_hex_code: string;
  unit_price: number;
  unit_discount: number;
  quantity: number;
  line_total: number;
}

export interface OrderShippingAddress {
  recipient_name: string;
  phone: string;
  address_line: string;
  province: string;
  city: string;
  district: string;
  postal_code: string;
  country: string;
  notes: string | null;
}

export interface OrderShipping {
  quote_uuid: string;
  courier_code: string;
  courier_name: string;
  courier_service_code: string | null;
  courier_service_name: string | null;
  description: string | null;
  duration: string | null;
  shipping_fee: number;
  currency: string;
}

export interface Order {
  uuid: string;
  order_number: string;
  status: string;
  payment_status: string;
  items: OrderItem[];
  shipping_address: OrderShippingAddress;
  shipping: OrderShipping;
  subtotal: number;
  item_discount_total: number;
  shipping_cost: number;
  grand_total: number;
  currency: string;
  payment_deadline_at: string;
  paid_at: string | null;
  created_at: string;
}

export type CheckoutSource = "direct" | "cart";

export interface CheckoutDirectItem {
  variant_uuid: string;
  quantity: number;
}

export interface CheckoutCartItem {
  variant_uuid: string;
}

export interface CheckoutPayload {
  source: CheckoutSource;
  items: CheckoutDirectItem[] | CheckoutCartItem[];
  address_uuid: string;
  shipping_quote_uuid: string;
  customer_note?: string;
}
