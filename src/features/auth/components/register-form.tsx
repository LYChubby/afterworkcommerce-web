"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Check, Circle, LoaderCircle } from "lucide-react";

import { AuthServiceError } from "@/features/auth/services/auth-service";
import { useAuth } from "@/features/auth/providers/auth-provider";

const passwordRules = [
  {
    label: "Minimal 8 karakter",
    test: (value: string) => value.length >= 8,
  },
  {
    label: "Huruf kecil",
    test: (value: string) => /[a-z]/.test(value),
  },
  {
    label: "Huruf besar",
    test: (value: string) => /[A-Z]/.test(value),
  },
  {
    label: "Angka",
    test: (value: string) => /[0-9]/.test(value),
  },
  {
    label: "Simbol",
    test: (value: string) => /[^A-Za-z0-9]/.test(value),
  },
];

export function RegisterForm() {
  const router = useRouter();
  const { registerWithEmail } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const passwordIsValid = passwordRules.every((rule) => rule.test(password));

  const inputClassName =
    "w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/70 focus:border-accent focus:ring-2 focus:ring-accent/20 disabled:cursor-not-allowed disabled:opacity-60";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) return;

    setError(null);

    if (!passwordIsValid) {
      setError("Password belum memenuhi seluruh persyaratan.");
      return;
    }

    if (password !== passwordConfirmation) {
      setError("Konfirmasi password tidak cocok.");
      return;
    }

    setIsSubmitting(true);

    try {
      await registerWithEmail(name, email, password, passwordConfirmation);

      router.replace("/");
      router.refresh();
    } catch (error) {
      if (error instanceof AuthServiceError) {
        const validationErrors = error.errors;
        const firstValidationError = validationErrors ? Object.values(validationErrors).flat()[0] : null;

        setError(firstValidationError || error.message || "Registrasi gagal. Silakan coba kembali.");
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Registrasi gagal. Silakan coba kembali.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <label htmlFor="name" className="block text-sm font-medium text-foreground">
          Nama lengkap
        </label>

        <input id="name" name="name" type="text" autoComplete="name" required value={name} onChange={(event) => setName(event.target.value)} disabled={isSubmitting} className={inputClassName} placeholder="Nama lengkap" />
      </div>

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
          autoComplete="new-password"
          minLength={8}
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          disabled={isSubmitting}
          className={inputClassName}
          placeholder="Buat password"
        />

        <p className="text-xs leading-relaxed text-muted-foreground">Gunakan kombinasi huruf besar, huruf kecil, angka, dan simbol.</p>
      </div>

      <div className="rounded-xl border border-border bg-muted/50 p-4">
        <p className="mb-3 text-xs font-semibold text-foreground">Persyaratan password</p>

        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {passwordRules.map((rule) => {
            const valid = rule.test(password);

            return (
              <li key={rule.label} className={`flex items-center gap-2 text-xs transition-colors ${valid ? "font-medium text-primary" : "text-muted-foreground"}`}>
                {valid ? <Check className="size-3.5 shrink-0" /> : <Circle className="size-3 shrink-0" />}
                {rule.label}
              </li>
            );
          })}
        </ul>
      </div>

      <div className="space-y-2">
        <label htmlFor="password_confirmation" className="block text-sm font-medium text-foreground">
          Konfirmasi password
        </label>

        <input
          id="password_confirmation"
          name="password_confirmation"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
          value={passwordConfirmation}
          onChange={(event) => setPasswordConfirmation(event.target.value)}
          disabled={isSubmitting}
          className={inputClassName}
          placeholder="Ulangi password"
        />

        {passwordConfirmation.length > 0 && (
          <p className={`text-xs ${password === passwordConfirmation ? "text-primary" : "text-destructive"}`}>{password === passwordConfirmation ? "Konfirmasi password cocok." : "Konfirmasi password belum cocok."}</p>
        )}
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
          "Buat Akun"
        )}
      </button>
    </form>
  );
}
