import Link from "next/link";

import { AuthActions } from "@/features/auth/components/auth-actions";

export function StorefrontHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="shrink-0 text-xl font-bold tracking-tight" aria-label="AFTERWORK-COMMERCE Homepage">
          AFTERWORK
        </Link>

        <nav aria-label="Main navigation" className="hidden items-center gap-6 text-sm font-medium md:flex">
          <Link href="/" className="text-muted-foreground transition-colors hover:text-foreground">
            Beranda
          </Link>

          <Link href="/products" className="text-muted-foreground transition-colors hover:text-foreground">
            Produk
          </Link>
        </nav>

        <div className="shrink-0">
          <AuthActions />
        </div>
      </div>
    </header>
  );
}
