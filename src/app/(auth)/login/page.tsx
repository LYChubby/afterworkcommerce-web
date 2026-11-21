import Link from "next/link";

import { GuestGuard } from "@/features/auth/components/guest-guard";
import { LoginForm } from "@/features/auth/components/login-form";
import { GoogleLoginButton } from "@/features/auth/components/google-login-button";

export default function LoginPage() {
  return (
    <GuestGuard>
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-12 sm:px-6">
        <div aria-hidden="true" className="pointer-events-none absolute -right-32 -top-32 size-96 rounded-full bg-accent/10 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-40 -left-32 size-96 rounded-full bg-primary/10 blur-3xl" />

        <section className="relative w-full max-w-md">
          <header className="mb-8 space-y-3 text-center">
            <Link href="/" className="inline-flex flex-col items-center gap-1">
              <span className="font-heading text-3xl font-semibold tracking-wide text-primary">AFTERWORK</span>
              <span className="text-[10px] font-medium uppercase tracking-[0.35em] text-muted-foreground">Commerce</span>
            </Link>

            <div className="space-y-2 pt-4">
              <h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Selamat Datang Kembali</h1>

              <p className="text-sm leading-relaxed text-muted-foreground">Masuk ke akun AFTERWORK-COMMERCE kamu dan lanjutkan perjalanan gayamu.</p>
            </div>
          </header>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
            <div className="space-y-6">
              <LoginForm />

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>

                <div className="relative flex justify-center text-xs">
                  <span className="bg-card px-3 text-muted-foreground">Atau masuk dengan</span>
                </div>
              </div>

              <GoogleLoginButton />
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Belum punya akun?{" "}
            <Link href="/register" className="font-semibold text-primary underline-offset-4 transition hover:text-accent hover:underline">
              Daftar sekarang
            </Link>
          </p>

          <p className="mt-10 text-center text-xs text-muted-foreground">© 2026 AFTERWORK-COMMERCE</p>
        </section>
      </main>
    </GuestGuard>
  );
}
