"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, ShoppingBag, ShoppingCart, Package, UserRound, MapPin, Info, Mail, LogIn, UserPlus, PanelLeftClose, PanelLeftOpen } from "lucide-react";

import { LogoutButton } from "@/features/auth/components/logout-button";
import { useAuth } from "@/features/auth/providers/auth-provider";

interface SiteSidebarProps {
  expanded: boolean;
  onToggle: () => void;
}

const publicNavigation = [
  {
    label: "Beranda",
    href: "/",
    icon: House,
  },
  {
    label: "Katalog Produk",
    href: "/#products",
    icon: ShoppingBag,
  },
  {
    label: "Tentang Kami",
    href: "/#about",
    icon: Info,
  },
  {
    label: "Kontak",
    href: "/#contact",
    icon: Mail,
  },
];

const customerNavigation = [
  {
    label: "Keranjang",
    href: "/cart",
    icon: ShoppingCart,
  },
  {
    label: "Riwayat Pesanan",
    href: "/orders",
    icon: Package,
  },
  {
    label: "Profil Saya",
    href: "/profile",
    icon: UserRound,
  },
  {
    label: "Alamat Pengiriman",
    href: "/addresses",
    icon: MapPin,
  },
];

export function SiteSidebar({ expanded, onToggle }: SiteSidebarProps) {
  const pathname = usePathname();
  const { user, status } = useAuth();

  const isAuthenticated = status === "authenticated";

  function isActive(href: string) {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <aside className={`sticky top-0 hidden h-svh shrink-0 flex-col border-r border-border bg-background transition-[width] duration-300 md:flex ${expanded ? "w-64" : "w-20"}`}>
      <div className={`flex h-20 shrink-0 items-center border-b border-border ${expanded ? "justify-between px-5" : "justify-center"}`}>
        <Link href="/" aria-label="AFTERWORK-COMMERCE" className="flex min-w-0 flex-col leading-none">
          {expanded ? (
            <>
              <span className="font-heading text-xl font-semibold tracking-wide text-primary">AFTERWORK</span>
              <span className="mt-1 text-[9px] font-medium uppercase tracking-[0.3em] text-muted-foreground">Commerce</span>
            </>
          ) : (
            <span className="font-heading text-2xl font-semibold text-primary">AW</span>
          )}
        </Link>

        {expanded && (
          <button type="button" onClick={onToggle} aria-label="Collapse sidebar" title="Collapse sidebar" className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
            <PanelLeftClose className="size-5" />
          </button>
        )}
      </div>

      {!expanded && (
        <button type="button" onClick={onToggle} aria-label="Expand sidebar" title="Expand sidebar" className="mx-auto mt-4 rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
          <PanelLeftOpen className="size-5" />
        </button>
      )}

      <nav aria-label="Navigasi utama" className="flex-1 space-y-6 overflow-y-auto px-3 py-6">
        <div className="space-y-2">
          {expanded && <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Utama</p>}

          {publicNavigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                title={!expanded ? item.label : undefined}
                aria-label={item.label}
                aria-current={active ? "page" : undefined}
                className={`flex h-11 items-center gap-3 rounded-lg text-sm font-medium transition-colors ${expanded ? "px-3" : "justify-center"} ${
                  active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="size-5 shrink-0" />
                {expanded && <span>{item.label}</span>}
              </Link>
            );
          })}
        </div>

        {isAuthenticated && (
          <div className="space-y-2">
            {expanded && <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Akun Saya</p>}

            {customerNavigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={!expanded ? item.label : undefined}
                  aria-label={item.label}
                  aria-current={active ? "page" : undefined}
                  className={`flex h-11 items-center gap-3 rounded-lg text-sm font-medium transition-colors ${expanded ? "px-3" : "justify-center"} ${
                    active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon className="size-5 shrink-0" />
                  {expanded && <span>{item.label}</span>}
                </Link>
              );
            })}
          </div>
        )}
      </nav>

      <div className="shrink-0 border-t border-border p-3">
        {status === "authenticated" ? (
          <div className="space-y-3">
            {expanded && (
              <div className="truncate px-2">
                <p className="text-xs text-muted-foreground">Masuk sebagai</p>
                <p className="truncate text-sm font-medium text-foreground">{user?.name}</p>
              </div>
            )}

            <LogoutButton />
          </div>
        ) : status === "unauthenticated" ? (
          <div className="space-y-2">
            <Link
              href="/login"
              title={!expanded ? "Masuk" : undefined}
              aria-label="Masuk"
              className={`flex h-10 items-center justify-center gap-2 rounded-lg border border-border text-sm font-medium text-foreground transition-colors hover:bg-muted ${expanded ? "w-full px-3" : "w-full"}`}
            >
              <LogIn className="size-4 shrink-0" />
              {expanded && <span>Masuk</span>}
            </Link>

            {expanded && (
              <Link href="/register" className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary px-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90">
                <UserPlus className="size-4" />
                Daftar
              </Link>
            )}
          </div>
        ) : (
          <div className="h-10" />
        )}
      </div>
    </aside>
  );
}
