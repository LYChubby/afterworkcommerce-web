export interface ShippingRateItemPayload {
  variant_uuid: string;
  quantity: number;
}

export interface ShippingRatePayload {
  postal_code: string;
  items: ShippingRateItemPayload[];
}

export interface ShippingRateOption {
  quote_uuid: string;
  courier_code: string;
  courier_name: string;
  courier_service_code: string | null;
  courier_service_name: string | null;
  description: string | null;
  duration: string | null;
  shipping_fee: number;
  currency: string;
  expires_at: string;
}

export interface ShippingRateResponse {
  quote_group_uuid: string | null;
  expires_at: string | null;
  options: ShippingRateOption[];
}
