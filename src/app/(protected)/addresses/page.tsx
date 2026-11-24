"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { MapPin, Plus, Star, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { AddressServiceError, deleteAddress, getAddresses } from "@/features/addresses/services/address-service";
import { useNotification } from "@/components/ui/notification-provider";
import type { Address } from "@/types/address";

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingUuid, setDeletingUuid] = useState<string | null>(null);
  const { confirm, notify } = useNotification();

  const loadAddresses = useCallback(async () => {
    setError(null);

    try {
      const data = await getAddresses();
      setAddresses(data);
    } catch (err) {
      setError(err instanceof AddressServiceError ? err.message : "Terjadi kesalahan saat mengambil data alamat.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  async function handleDeleteAddress(uuid: string) {
    const confirmed = await confirm({
      title: "Hapus alamat?",
      description: "Apakah Anda yakin ingin menghapus alamat ini? Tindakan ini tidak dapat dibatalkan.",
      confirmLabel: "Ya, hapus alamat",
      cancelLabel: "Batal",
    });

    if (!confirmed) {
      return;
    }

    setDeletingUuid(uuid);
    setError(null);

    try {
      await deleteAddress(uuid);

      notify("success", {
        title: "Alamat berhasil dihapus",
        description: "Alamat pengiriman telah berhasil dihapus.",
      });

      await loadAddresses();
    } catch (err) {
      notify("error", {
        title: "Gagal menghapus alamat",
        description: err instanceof AddressServiceError ? err.message : "Terjadi kesalahan saat menghapus alamat.",
        confirmLabel: "Mengerti",
      });
    } finally {
      setDeletingUuid(null);
    }
  }

  useEffect(() => {
    let isActive = true;

    async function fetchAddresses() {
      try {
        const data = await getAddresses();

        if (isActive) {
          setAddresses(data);
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

    void fetchAddresses();

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <main className="flex-1 bg-background">
      <div className="mx-auto w-full max-w-5xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Akun Saya</p>
            <h1 className="font-serif text-3xl tracking-tight sm:text-4xl">Alamat Pengiriman</h1>
            <p className="max-w-xl text-sm leading-6 text-muted-foreground">Kelola alamat pengiriman untuk mempermudah proses pemesanan.</p>
          </div>

          <Button asChild>
            <Link href="/addresses/create">
              <Plus aria-hidden="true" />
              Tambah Alamat
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="rounded-lg border border-border bg-card px-6 py-12 text-center" role="status">
            <p className="text-sm text-muted-foreground">Memuat alamat pengiriman...</p>
          </div>
        ) : error ? (
          <div className="rounded-lg border border-destructive/30 bg-card px-6 py-8 text-center" role="alert">
            <p className="text-sm text-destructive">{error}</p>
            <Button className="mt-5" variant="outline" onClick={() => void loadAddresses()}>
              Coba Lagi
            </Button>
          </div>
        ) : addresses.length === 0 ? (
          <div className="rounded-lg border border-border bg-card px-6 py-14 text-center">
            <MapPin className="mx-auto size-10 text-muted-foreground" aria-hidden="true" />
            <h2 className="mt-4 font-serif text-xl">Belum Ada Alamat</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">Tambahkan alamat pengiriman agar dapat digunakan saat checkout.</p>
            <Button asChild className="mt-6">
              <Link href="/addresses/create">
                <Plus aria-hidden="true" />
                Tambah Alamat
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {addresses.map((address) => (
              <article key={address.uuid} className="rounded-lg border border-border bg-card p-5 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-semibold">{address.label || "Alamat Pengiriman"}</h2>

                      {address.is_default && (
                        <span className="inline-flex items-center gap-1 rounded-sm bg-primary/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary">
                          <Star className="size-3" aria-hidden="true" />
                          Alamat Utama
                        </span>
                      )}
                    </div>

                    <div className="space-y-1 text-sm">
                      <p className="font-medium">{address.recipient_name}</p>
                      <p className="text-muted-foreground">{address.phone}</p>
                    </div>

                    <div className="space-y-1 text-sm leading-6 text-muted-foreground">
                      <p>{address.address_line}</p>
                      <p>{[address.subdistrict, address.district, address.city, address.province, address.postal_code].filter(Boolean).join(", ")}</p>
                      <p>{address.country}</p>
                    </div>

                    {address.notes && <p className="text-xs text-muted-foreground">Catatan: {address.notes}</p>}
                  </div>

                  <div className="flex shrink-0 flex-wrap gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/addresses/${address.uuid}/edit`}>Edit</Link>
                    </Button>

                    <Button type="button" variant="destructive" size="sm" disabled={deletingUuid !== null} onClick={() => void handleDeleteAddress(address.uuid)}>
                      <Trash2 aria-hidden="true" />
                      {deletingUuid === address.uuid ? "Menghapus..." : "Hapus"}
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
