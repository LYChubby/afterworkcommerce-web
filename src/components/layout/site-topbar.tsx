"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ShoppingCart } from "lucide-react";

import { LogoutButton } from "@/features/auth/components/logout-button";
import { useAuth } from "@/features/auth/providers/auth-provider";

interface SiteTopbarProps {
  onMobileMenuClick?: () => void;
}

const pageTitles: Record<string, string> = {
  "/": "Beranda",
  "/products": "Katalog Produk",
  "/cart": "Keranjang",
  "/orders": "Riwayat Pesanan",
  "/profile": "Profil Saya",
  "/addresses": "Alamat Pengiriman",
};

export function SiteTopbar({ onMobileMenuClick }: SiteTopbarProps) {
  const pathname = usePathname();
  const { user, status } = useAuth();

  const pageTitle = pageTitles[pathname] ?? (pathname.startsWith("/products/") ? "Detail Produk" : "AFTERWORK-COMMERCE");

  return (
    <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-border/70 bg-background/90 px-4 backdrop-blur-lg sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <button type="button" onClick={onMobileMenuClick} aria-label="Buka navigasi" className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-muted md:hidden">
          <Menu className="size-5" />
        </button>

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">{pageTitle}</p>
          <p className="hidden truncate text-xs text-muted-foreground sm:block">AFTERWORK-COMMERCE</p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-4">
        {status === "authenticated" && (
          <Link
            href="/cart"
            aria-label="Keranjang belanja"
            title="Keranjang belanja"
            className="relative inline-flex size-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <ShoppingCart className="size-5" />
          </Link>
        )}

        {status === "loading" ? (
          <span role="status" aria-live="polite" className="hidden text-xs text-muted-foreground sm:block">
            Memeriksa sesi...
          </span>
        ) : status === "authenticated" ? (
          <>
            <div className="hidden max-w-40 text-right sm:block">
              <p className="truncate text-sm font-medium text-foreground">{user?.name}</p>
              <p className="text-xs text-muted-foreground">Customer</p>
            </div>

            <div className="md:hidden">
              <LogoutButton />
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <Link href="/login" className="rounded-lg px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted">
              Masuk
            </Link>

            <Link href="/register" className="hidden rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 sm:inline-flex">
              Daftar
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
