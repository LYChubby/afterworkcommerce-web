"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, House, ShoppingBag, ShoppingCart, Package, UserRound, MapPin, Info, Mail, LogIn, UserPlus } from "lucide-react";

import { LogoutButton } from "@/features/auth/components/logout-button";
import { useAuth } from "@/features/auth/providers/auth-provider";

interface MobileNavigationProps {
  open: boolean;
  onClose: () => void;
}

const publicNavigation = [
  { label: "Beranda", href: "/", icon: House },
  { label: "Katalog Produk", href: "/#products", icon: ShoppingBag },
  { label: "Tentang Kami", href: "/#about", icon: Info },
  { label: "Kontak", href: "/#contact", icon: Mail },
];

const customerNavigation = [
  { label: "Keranjang", href: "/cart", icon: ShoppingCart },
  { label: "Riwayat Pesanan", href: "/orders", icon: Package },
  { label: "Profil Saya", href: "/profile", icon: UserRound },
  { label: "Alamat Pengiriman", href: "/addresses", icon: MapPin },
];

export function MobileNavigation({ open, onClose }: MobileNavigationProps) {
  const pathname = usePathname();
  const { user, status } = useAuth();

  const isAuthenticated = status === "authenticated";

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function isActive(href: string) {
    if (href === "/") return pathname === "/";

    return pathname === href || pathname.startsWith(`${href}/`);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] md:hidden">
      <button type="button" aria-label="Tutup navigasi" onClick={onClose} className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

      <aside id="mobile-navigation" aria-label="Navigasi mobile" aria-modal="true" role="dialog" className="absolute inset-y-0 left-0 flex w-[min(85vw,320px)] flex-col border-r border-border bg-background shadow-2xl">
        <div className="flex h-20 shrink-0 items-center justify-between border-b border-border px-5">
          <Link href="/" onClick={onClose} className="flex flex-col leading-none">
            <span className="font-heading text-xl font-semibold tracking-wide text-primary">AFTERWORK</span>
            <span className="mt-1 text-[9px] font-medium uppercase tracking-[0.3em] text-muted-foreground">Commerce</span>
          </Link>

          <button type="button" onClick={onClose} aria-label="Tutup menu" className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
            <X className="size-5" />
          </button>
        </div>

        <nav aria-label="Navigasi utama" className="flex-1 space-y-6 overflow-y-auto px-4 py-6">
          <div className="space-y-2">
            <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Utama</p>

            {publicNavigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  aria-current={active ? "page" : undefined}
                  className={`flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors ${active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
                >
                  <Icon className="size-5" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          {isAuthenticated && (
            <div className="space-y-2">
              <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Akun Saya</p>

              {customerNavigation.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    aria-current={active ? "page" : undefined}
                    className={`flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors ${active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
                  >
                    <Icon className="size-5" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          )}
        </nav>

        <div className="shrink-0 border-t border-border p-4">
          {status === "loading" ? (
            <p className="px-2 py-2 text-sm text-muted-foreground">Memeriksa sesi...</p>
          ) : isAuthenticated ? (
            <div className="space-y-3">
              <div className="px-2">
                <p className="text-xs text-muted-foreground">Masuk sebagai</p>
                <p className="truncate text-sm font-medium text-foreground">{user?.name}</p>
              </div>

              <div onClick={onClose}>
                <LogoutButton />
              </div>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link href="/login" onClick={onClose} className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-border px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted">
                <LogIn className="size-4" />
                Masuk
              </Link>

              <Link href="/register" onClick={onClose} className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90">
                <UserPlus className="size-4" />
                Daftar
              </Link>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
