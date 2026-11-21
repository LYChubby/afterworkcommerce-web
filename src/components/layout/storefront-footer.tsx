import Link from "next/link";

export function StorefrontFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-2 lg:px-8">
        <div className="space-y-3">
          <Link href="/" className="inline-block text-lg font-bold tracking-tight">
            AFTERWORK
          </Link>

          <p className="max-w-sm text-sm leading-6 text-muted-foreground">Discover products and enjoy a seamless shopping experience with AFTERWORK-COMMERCE.</p>
        </div>

        <div className="flex flex-col gap-3 md:items-end">
          <h2 className="text-sm font-semibold">Navigasi</h2>

          <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
            <Link href="/" className="transition-colors hover:text-foreground">
              Beranda
            </Link>

            <Link href="/products" className="transition-colors hover:text-foreground">
              Produk
            </Link>
          </nav>
        </div>

        <div className="border-t pt-6 md:col-span-2">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} AFTERWORK-COMMERCE. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
