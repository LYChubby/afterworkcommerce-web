import Link from "next/link";
import { ArrowDown, ArrowRight, Sparkles } from "lucide-react";
import { WhyChooseUs } from "@/components/home/why-choose-us";

export default function Home() {
  return (
    <main>
      <section id="home" className="relative isolate overflow-hidden bg-background">
        <div aria-hidden="true" className="pointer-events-none absolute -right-40 -top-40 -z-10 size-[500px] rounded-full bg-accent/10 blur-3xl" />

        <div className="mx-auto grid min-h-[calc(100svh-4.5rem)] w-full max-w-7xl items-center gap-14 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:gap-20 lg:px-8 lg:py-24">
          {/* Hero Content */}
          <div className="max-w-2xl">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-2 text-xs font-medium tracking-[0.18em] text-primary">
              <Sparkles size={14} />
              <span>EVERYDAY STYLE, ELEVATED</span>
            </div>

            <h1 className="font-heading text-5xl leading-[1.12] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              Discover Your
              <span className="mt-2 block italic text-primary">Everyday</span>
              <span className="block">Elegance.</span>
            </h1>

            <p className="mt-7 max-w-lg text-base leading-8 text-muted-foreground sm:text-lg">
              Temukan gaya yang merepresentasikan dirimu. Koleksi pilihan dengan perpaduan karakter, kenyamanan, dan sentuhan elegan untuk menemani setiap momen.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link href="/#products" className="inline-flex h-13 items-center justify-center gap-3 rounded-md bg-primary px-7 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
                Jelajahi Koleksi
                <ArrowRight size={17} />
              </Link>

              <Link href="/#about" className="inline-flex h-13 items-center justify-center gap-3 rounded-md border border-border px-7 text-sm font-medium text-foreground transition-colors hover:bg-muted">
                Tentang Kami
              </Link>
            </div>

            <div className="mt-14 flex items-center gap-3 text-xs font-medium tracking-[0.16em] text-muted-foreground">
              <span className="h-px w-10 bg-accent" />
              <span>STYLE THAT SPEAKS FOR YOU</span>
            </div>
          </div>

          {/* Editorial Visual */}
          <div className="relative mx-auto w-full max-w-lg">
            <div className="absolute -right-4 -top-4 size-28 rounded-full border border-accent/40 sm:-right-8 sm:-top-8 sm:size-36" />

            <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-primary">
              <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_25%,rgba(197,164,109,0.28),transparent_55%)]" />

              <div className="absolute inset-5 border border-primary-foreground/20 sm:inset-7" />

              <div className="absolute left-9 top-10 text-xs tracking-[0.3em] text-primary-foreground/70 sm:left-12 sm:top-12">AFTERWORK / EST.</div>

              <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center">
                <span className="font-heading text-6xl italic leading-none text-primary-foreground sm:text-7xl">Less,</span>
                <span className="mt-2 font-heading text-6xl leading-none text-primary-foreground sm:text-7xl">but better.</span>

                <span className="mt-8 h-px w-16 bg-accent" />

                <p className="mt-5 max-w-[220px] text-xs leading-6 tracking-[0.2em] text-primary-foreground/70">A THOUGHTFUL APPROACH TO EVERYDAY FASHION</p>
              </div>

              <div className="absolute bottom-10 right-9 text-right text-[10px] tracking-[0.25em] text-primary-foreground/60 sm:bottom-12 sm:right-12">
                <p>COLLECTION</p>
                <p className="mt-1">01 — 2026</p>
              </div>
            </div>

            <div className="absolute -bottom-6 -left-5 flex size-24 items-center justify-center rounded-full border border-accent/50 bg-background shadow-lg sm:-bottom-8 sm:-left-8 sm:size-28">
              <div className="flex flex-col items-center text-center">
                <span className="font-heading text-2xl italic text-primary">AW</span>
                <span className="mt-1 text-[8px] tracking-[0.2em] text-muted-foreground">YOUR STYLE</span>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 items-center gap-2 text-[10px] tracking-[0.2em] text-muted-foreground lg:flex">
          <ArrowDown size={13} />
          SCROLL TO EXPLORE
        </div>
      </section>
      <WhyChooseUs />
    </main>
  );
}
