"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { AddressServiceError, getAddress, updateAddress } from "@/features/addresses/services/address-service";
import type { AddressPayload } from "@/types/address";

interface AddressFormData {
  label: string;
  recipient_name: string;
  phone: string;
  address_line: string;
  province: string;
  city: string;
  district: string;
  subdistrict: string;
  postal_code: string;
  country: string;
  notes: string;
  is_default: boolean;
}

const initialFormData: AddressFormData = {
  label: "",
  recipient_name: "",
  phone: "",
  address_line: "",
  province: "",
  city: "",
  district: "",
  subdistrict: "",
  postal_code: "",
  country: "Indonesia",
  notes: "",
  is_default: false,
};

export default function EditAddressPage() {
  const params = useParams<{ uuid: string }>();
  const uuid = params.uuid;
  const router = useRouter();

  const [formData, setFormData] = useState<AddressFormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    async function loadAddress() {
      try {
        const address = await getAddress(uuid);

        if (isActive) {
          setFormData({
            label: address.label ?? "",
            recipient_name: address.recipient_name,
            phone: address.phone,
            address_line: address.address_line,
            province: address.province,
            city: address.city,
            district: address.district ?? "",
            subdistrict: address.subdistrict ?? "",
            postal_code: address.postal_code,
            country: address.country,
            notes: address.notes ?? "",
            is_default: address.is_default,
          });
        }
      } catch (err) {
        if (isActive) {
          setError(err instanceof AddressServiceError ? err.message : "Terjadi kesalahan saat mengambil data alamat.");
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    void loadAddress();

    return () => {
      isActive = false;
    };
  }, [uuid]);

  function updateField<K extends keyof AddressFormData>(field: K, value: AddressFormData[K]) {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSubmitting(true);
    setError(null);

    const payload: AddressPayload = {
      label: formData.label.trim() || null,
      recipient_name: formData.recipient_name.trim(),
      phone: formData.phone.trim(),
      address_line: formData.address_line.trim(),
      province: formData.province.trim(),
      city: formData.city.trim(),
      district: formData.district.trim() || null,
      subdistrict: formData.subdistrict.trim() || null,
      postal_code: formData.postal_code.trim(),
      country: formData.country.trim(),
      notes: formData.notes.trim() || null,
      is_default: formData.is_default,
    };

    try {
      await updateAddress(uuid, payload);
      router.push("/addresses");
      router.refresh();
    } catch (err) {
      setError(err instanceof AddressServiceError ? err.message : "Terjadi kesalahan saat memperbarui alamat.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <main className="flex flex-1 items-center justify-center bg-background p-6">
        <p className="text-sm text-muted-foreground" role="status">
          Memuat detail alamat...
        </p>
      </main>
    );
  }

  if (error && !formData.recipient_name) {
    return (
      <main className="flex flex-1 items-center justify-center bg-background p-6">
        <div className="max-w-md space-y-4 text-center">
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
          <Button asChild variant="outline">
            <Link href="/addresses">Kembali ke Alamat</Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-background">
      <div className="mx-auto w-full max-w-3xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
        <div className="space-y-4">
          <Link href="/addresses" className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground">
            <ArrowLeft className="size-4" aria-hidden="true" />
            Kembali ke Alamat
          </Link>

          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Akun Saya</p>
            <h1 className="font-serif text-3xl tracking-tight sm:text-4xl">Edit Alamat</h1>
            <p className="text-sm leading-6 text-muted-foreground">Perbarui informasi penerima dan alamat pengiriman.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 rounded-lg border border-border bg-card p-5 sm:p-8">
          <section className="space-y-5">
            <h2 className="text-sm font-semibold uppercase tracking-wider">Informasi Penerima</h2>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <label htmlFor="label" className="text-sm font-medium">
                  Label Alamat
                  <span className="ml-2 font-normal text-muted-foreground">(Opsional)</span>
                </label>
                <input
                  id="label"
                  value={formData.label}
                  onChange={(event) => updateField("label", event.target.value)}
                  maxLength={50}
                  placeholder="Contoh: Rumah, Kantor"
                  className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <label htmlFor="recipient_name" className="text-sm font-medium">
                  Nama Penerima
                </label>
                <input
                  id="recipient_name"
                  value={formData.recipient_name}
                  onChange={(event) => updateField("recipient_name", event.target.value)}
                  maxLength={255}
                  required
                  autoComplete="name"
                  className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <label htmlFor="phone" className="text-sm font-medium">
                  Nomor Telepon
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(event) => updateField("phone", event.target.value)}
                  maxLength={30}
                  required
                  autoComplete="tel"
                  className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
                />
              </div>
            </div>
          </section>

          <div className="border-t border-border" />

          <section className="space-y-5">
            <h2 className="text-sm font-semibold uppercase tracking-wider">Detail Alamat</h2>

            <div className="space-y-2">
              <label htmlFor="address_line" className="text-sm font-medium">
                Alamat Lengkap
              </label>
              <textarea
                id="address_line"
                value={formData.address_line}
                onChange={(event) => updateField("address_line", event.target.value)}
                required
                rows={3}
                className="w-full rounded-md border border-input bg-background px-3 py-3 text-sm outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="province" className="text-sm font-medium">
                  Provinsi
                </label>
                <input
                  id="province"
                  value={formData.province}
                  onChange={(event) => updateField("province", event.target.value)}
                  maxLength={255}
                  required
                  className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="city" className="text-sm font-medium">
                  Kota / Kabupaten
                </label>
                <input
                  id="city"
                  value={formData.city}
                  onChange={(event) => updateField("city", event.target.value)}
                  maxLength={255}
                  required
                  className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="district" className="text-sm font-medium">
                  Kecamatan
                  <span className="ml-2 font-normal text-muted-foreground">(Opsional)</span>
                </label>
                <input
                  id="district"
                  value={formData.district}
                  onChange={(event) => updateField("district", event.target.value)}
                  maxLength={255}
                  className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="subdistrict" className="text-sm font-medium">
                  Kelurahan / Desa
                  <span className="ml-2 font-normal text-muted-foreground">(Opsional)</span>
                </label>
                <input
                  id="subdistrict"
                  value={formData.subdistrict}
                  onChange={(event) => updateField("subdistrict", event.target.value)}
                  maxLength={255}
                  className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="postal_code" className="text-sm font-medium">
                  Kode Pos
                </label>
                <input
                  id="postal_code"
                  value={formData.postal_code}
                  onChange={(event) => updateField("postal_code", event.target.value)}
                  maxLength={10}
                  required
                  autoComplete="postal-code"
                  className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="country" className="text-sm font-medium">
                  Negara
                </label>
                <input
                  id="country"
                  value={formData.country}
                  onChange={(event) => updateField("country", event.target.value)}
                  maxLength={100}
                  required
                  autoComplete="country-name"
                  className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="notes" className="text-sm font-medium">
                Catatan Pengiriman
                <span className="ml-2 font-normal text-muted-foreground">(Opsional)</span>
              </label>
              <textarea
                id="notes"
                value={formData.notes}
                onChange={(event) => updateField("notes", event.target.value)}
                rows={2}
                className="w-full rounded-md border border-input bg-background px-3 py-3 text-sm outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
              />
            </div>
          </section>

          <div className="border-t border-border" />

          <label className="flex cursor-pointer items-start gap-3">
            <input type="checkbox" checked={formData.is_default} onChange={(event) => updateField("is_default", event.target.checked)} className="mt-0.5 size-4 accent-primary" />
            <span className="space-y-1">
              <span className="block text-sm font-medium">Jadikan alamat utama</span>
              <span className="block text-xs leading-5 text-muted-foreground">Alamat ini akan menjadi alamat utama untuk pengiriman.</span>
            </span>
          </label>

          {error && (
            <div role="alert" className="rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-end">
            <Button asChild variant="outline" disabled={isSubmitting}>
              <Link href="/addresses">Batal</Link>
            </Button>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
