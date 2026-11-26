"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import type { FormEvent } from "react";

import { ChevronLeft, ChevronRight, ImageIcon, Search, SlidersHorizontal } from "lucide-react";

import { getProducts } from "@/features/products/services/product-service";
import type { ProductFilters } from "@/types/product";
import type { Product, ProductCategory, ProductPaginationMeta } from "@/types/product";

const CURRENCY_FORMATTER = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

type ProductsClientProps = {
  initialProducts: Product[];
  initialCategories: ProductCategory[];
  initialMeta: ProductPaginationMeta;
};

function formatPrice(price: string | number): string {
  return CURRENCY_FORMATTER.format(Number(price));
}

export default function ProductsClient({ initialProducts, initialCategories, initialMeta }: ProductsClientProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const categories = initialCategories;
  const [meta, setMeta] = useState<ProductPaginationMeta>(initialMeta);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState<ProductFilters["sort"]>("latest");
  const [availability, setAvailability] = useState<ProductFilters["availability"]>();

  const [page, setPage] = useState(initialMeta.current_page);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCatalog = useCallback(async (filters: ProductFilters) => {
    setLoading(true);
    setError(null);

    try {
      const response = await getProducts(filters);

      setProducts(response.data);
      setMeta(response.meta);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat produk.");
    } finally {
      setLoading(false);
    }
  }, []);

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextSearch = searchInput.trim();

    setSearch(nextSearch);
    setPage(1);

    void fetchCatalog({
      search: nextSearch || undefined,
      category: category || undefined,
      sort,
      availability,
      page: 1,
      per_page: 12,
    });
  }

  function handleCategoryChange(value: string) {
    setCategory(value);
    setPage(1);

    void fetchCatalog({
      search: search || undefined,
      category: value || undefined,
      sort,
      availability,
      page: 1,
      per_page: 12,
    });
  }

  function handleSortChange(value: ProductFilters["sort"]) {
    setSort(value);
    setPage(1);

    void fetchCatalog({
      search: search || undefined,
      category: category || undefined,
      sort: value,
      availability,
      page: 1,
      per_page: 12,
    });
  }

  function handleAvailabilityChange(value: ProductFilters["availability"]) {
    setAvailability(value);
    setPage(1);

    void fetchCatalog({
      search: search || undefined,
      category: category || undefined,
      sort,
      availability: value,
      page: 1,
      per_page: 12,
    });
  }

  function handlePageChange(nextPage: number) {
    if (nextPage < 1 || nextPage > meta.last_page || loading) {
      return;
    }

    setPage(nextPage);

    void fetchCatalog({
      search: search || undefined,
      category: category || undefined,
      sort,
      availability,
      page: nextPage,
      per_page: 12,
    });
  }

  function handleResetFilters() {
    setSearchInput("");
    setSearch("");
    setCategory("");
    setSort("latest");
    setAvailability(undefined);
    setPage(1);

    void fetchCatalog({
      page: 1,
      per_page: 12,
      sort: "latest",
    });
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Page heading */}
      <section className="border-b border-border bg-muted/30">
        <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <span className="text-xs font-medium tracking-[0.2em] text-primary">THE AFTERWORK COLLECTION</span>

          <h1 className="mt-4 font-heading text-4xl leading-tight text-foreground sm:text-5xl">
            Discover Your
            <span className="ml-2 italic text-primary">Style.</span>
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">Temukan koleksi pilihan yang dirancang untuk menemani gaya sehari-hari dengan karakter, kenyamanan, dan kesederhanaan.</p>
        </div>
      </section>

      {/* Catalog */}
      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-12">
          {/* Filters */}
          <aside className="h-fit rounded-xl border border-border bg-card p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={17} className="text-primary" aria-hidden="true" />

                <h2 className="text-sm font-semibold text-foreground">Filter Produk</h2>
              </div>

              <button type="button" onClick={handleResetFilters} className="text-xs text-muted-foreground transition-colors hover:text-primary">
                Reset
              </button>
            </div>

            {/* Search */}
            <form onSubmit={handleSearchSubmit} className="mt-6">
              <label htmlFor="product-search" className="mb-2 block text-xs font-medium text-foreground">
                Cari produk
              </label>

              <div className="flex h-11 overflow-hidden rounded-md border border-input bg-background">
                <input
                  id="product-search"
                  type="search"
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  placeholder="Nama produk..."
                  className="min-w-0 flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-muted-foreground"
                />

                <button type="submit" aria-label="Cari produk" className="flex w-11 shrink-0 items-center justify-center bg-primary text-primary-foreground transition-colors hover:bg-primary/90">
                  <Search size={17} />
                </button>
              </div>
            </form>

            {/* Category */}
            <div className="mt-6">
              <label htmlFor="product-category" className="mb-2 block text-xs font-medium text-foreground">
                Kategori
              </label>

              <select
                id="product-category"
                value={category}
                onChange={(event) => handleCategoryChange(event.target.value)}
                className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-primary"
              >
                <option value="">Semua kategori</option>

                {categories.map((item) => (
                  <option key={item.uuid} value={item.slug}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Availability */}
            <div className="mt-6">
              <label htmlFor="product-availability" className="mb-2 block text-xs font-medium text-foreground">
                Ketersediaan
              </label>

              <select
                id="product-availability"
                value={availability ?? ""}
                onChange={(event) => handleAvailabilityChange((event.target.value || undefined) as ProductFilters["availability"])}
                className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-primary"
              >
                <option value="">Semua produk</option>
                <option value="available">Tersedia</option>
                <option value="out_of_stock">Stok habis</option>
              </select>
            </div>
          </aside>

          {/* Product listing */}
          <div className="min-w-0">
            {/* Listing toolbar */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{loading ? "Memuat produk..." : `${meta.total} produk ditemukan`}</p>
              </div>

              <div className="flex items-center gap-3">
                <label htmlFor="product-sort" className="shrink-0 text-xs text-muted-foreground">
                  Urutkan
                </label>

                <select
                  id="product-sort"
                  value={sort}
                  onChange={(event) => handleSortChange(event.target.value as ProductFilters["sort"])}
                  className="h-10 min-w-0 flex-1 rounded-md border border-input bg-card px-3 text-sm text-foreground outline-none focus:border-primary sm:flex-none"
                >
                  <option value="latest">Terbaru</option>
                  <option value="price_asc">Harga terendah</option>
                  <option value="price_desc">Harga tertinggi</option>
                  <option value="name_asc">Nama A–Z</option>
                </select>
              </div>
            </div>

            {/* Error state */}
            {error && (
              <div role="alert" className="mb-6 rounded-lg border border-destructive/30 bg-destructive/5 p-5">
                <p className="text-sm text-destructive">{error}</p>

                <button
                  type="button"
                  onClick={() =>
                    fetchCatalog({
                      search: search || undefined,
                      category: category || undefined,
                      sort,
                      availability,
                      page,
                      per_page: 12,
                    })
                  }
                  className="mt-3 text-sm font-medium text-primary underline underline-offset-4"
                >
                  Coba lagi
                </button>
              </div>
            )}

            {/* Loading state */}
            {loading && (
              <div className="grid grid-cols-2 gap-4 sm:gap-6 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="overflow-hidden rounded-lg border border-border bg-card">
                    <div className="aspect-[3/4] animate-pulse bg-muted" />

                    <div className="space-y-3 p-4">
                      <div className="h-3 w-1/3 animate-pulse rounded bg-muted" />
                      <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
                      <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty state */}
            {!loading && !error && products.length === 0 && (
              <div className="flex min-h-80 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card px-6 text-center">
                <Search size={30} strokeWidth={1.4} className="text-muted-foreground" />

                <h3 className="mt-5 font-heading text-2xl text-foreground">Produk tidak ditemukan</h3>

                <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">Coba ubah kata pencarian atau filter untuk menemukan koleksi yang kamu inginkan.</p>

                <button type="button" onClick={handleResetFilters} className="mt-6 rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
                  Reset Filter
                </button>
              </div>
            )}

            {/* Product grid */}
            {!loading && !error && products.length > 0 && (
              <>
                <div className="grid grid-cols-2 gap-4 sm:gap-6 xl:grid-cols-3">
                  {products.map((product) => {
                    const image = product.images.find((item) => item.is_primary) ?? product.images[0];

                    return (
                      <Link
                        key={product.uuid}
                        href={`/products/${product.slug}`}
                        className="group block min-w-0 overflow-hidden rounded-lg border border-border bg-card transition-shadow duration-300 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                      >
                        {/* Product image */}
                        <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                          {image ? (
                            <div
                              role="img"
                              aria-label={product.name}
                              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                              style={{
                                backgroundImage: `url("${image.url}")`,
                              }}
                            />
                          ) : (
                            <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
                              <ImageIcon size={30} strokeWidth={1.3} />
                              <span className="text-xs">Image unavailable</span>
                            </div>
                          )}

                          {product.is_on_sale && <span className="absolute left-2 top-2 rounded-sm bg-primary px-2 py-1 text-[10px] font-medium tracking-wide text-primary-foreground sm:left-3 sm:top-3">SALE</span>}

                          {product.total_available_stock <= 0 && <span className="absolute bottom-2 left-2 rounded-sm bg-foreground/80 px-2 py-1 text-[10px] font-medium text-background sm:bottom-3 sm:left-3">Stok habis</span>}
                        </div>

                        {/* Product information */}
                        <div className="p-3 sm:p-4">
                          {product.category && <p className="truncate text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground sm:text-xs">{product.category.name}</p>}

                          <h3 className="mt-2 line-clamp-2 min-h-10 text-sm font-medium leading-5 text-foreground sm:text-base">{product.name}</h3>

                          <div className="mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                            <span className="text-sm font-semibold text-primary sm:text-base">{formatPrice(product.effective_price)}</span>

                            {product.is_on_sale && <span className="text-xs text-muted-foreground line-through">{formatPrice(product.price)}</span>}
                          </div>

                          <p className="mt-3 text-[11px] text-muted-foreground sm:text-xs">{product.total_available_stock > 0 ? `${product.total_available_stock} tersedia` : "Tidak tersedia"}</p>
                        </div>
                      </Link>
                    );
                  })}
                </div>

                {/* Pagination */}
                {meta.last_page > 1 && (
                  <div className="mt-10 flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs text-muted-foreground">
                      Menampilkan {meta.from ?? 0}–{meta.to ?? 0} dari {meta.total} produk
                    </p>

                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page <= 1 || loading}
                        aria-label="Halaman sebelumnya"
                        className="flex size-10 items-center justify-center rounded-md border border-border text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <ChevronLeft size={17} />
                      </button>

                      <span className="px-3 text-sm tabular-nums text-foreground">
                        {page} / {meta.last_page}
                      </span>

                      <button
                        type="button"
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page >= meta.last_page || loading}
                        aria-label="Halaman selanjutnya"
                        className="flex size-10 items-center justify-center rounded-md border border-border text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <ChevronRight size={17} />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
