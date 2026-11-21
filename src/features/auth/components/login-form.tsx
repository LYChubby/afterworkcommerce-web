"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";

import { AuthServiceError } from "@/features/auth/services/auth-service";
import { useAuth } from "@/features/auth/providers/auth-provider";

export function LoginForm() {
  const router = useRouter();
  const { loginWithEmail } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) return;

    setError(null);
    setIsSubmitting(true);

    try {
      await loginWithEmail(email, password);
      router.replace("/");
      router.refresh();
    } catch (error) {
      if (error instanceof AuthServiceError) {
        setError(error.status === 401 ? "Email atau password yang kamu masukkan tidak sesuai." : error.message);
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Login gagal. Silakan coba kembali.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputClassName =
    "w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/70 focus:border-accent focus:ring-2 focus:ring-accent/20 disabled:cursor-not-allowed disabled:opacity-60";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium text-foreground">
          Email
        </label>

        <input id="email" name="email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} disabled={isSubmitting} className={inputClassName} placeholder="nama@email.com" />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium text-foreground">
          Password
        </label>

        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          disabled={isSubmitting}
          className={inputClassName}
          placeholder="Masukkan password"
        />
      </div>

      {error && (
        <div role="alert" className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? (
          <>
            <LoaderCircle className="size-4 animate-spin" />
            Memproses...
          </>
        ) : (
          "Masuk"
        )}
      </button>
    </form>
  );
}
