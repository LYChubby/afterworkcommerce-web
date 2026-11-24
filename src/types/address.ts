export interface Address {
  uuid: string;
  label: string | null;
  recipient_name: string;
  phone: string;
  address_line: string;
  province: string;
  city: string;
  district: string | null;
  subdistrict: string | null;
  postal_code: string;
  country: string;
  notes: string | null;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface AddressPayload {
  label?: string | null;
  recipient_name: string;
  phone: string;
  address_line: string;
  province: string;
  city: string;
  district?: string | null;
  subdistrict?: string | null;
  postal_code: string;
  country?: string;
  notes?: string | null;
  is_default?: boolean;
}

export type UpdateAddressPayload = Partial<AddressPayload>;
