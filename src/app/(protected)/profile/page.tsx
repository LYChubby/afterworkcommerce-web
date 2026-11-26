"use client";

import { useState, type FormEvent } from "react";
import { Mail, Phone, Save, UserRound } from "lucide-react";

import type { UserProfile } from "@/types/auth";
import { useAuth } from "@/features/auth/providers/auth-provider";
import { useNotification } from "@/components/ui/notification-provider";

interface ProfileFormProps {
  user: UserProfile;
  updateProfile: (payload: { name?: string; phone?: string | null }) => Promise<UserProfile>;
}

function ProfileForm({ user, updateProfile }: ProfileFormProps) {
  const { notify } = useNotification();

  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSaving) {
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      await updateProfile({
        name: name.trim(),
        phone: phone.trim() || null,
      });

      notify("success", {
        title: "Profil berhasil diperbarui",
        description: "Informasi profil kamu telah berhasil disimpan.",
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Terjadi kesalahan saat memperbarui profil.";

      setError(message);

      notify("error", {
        title: "Gagal memperbarui profil",
        description: message,
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <main className="flex-1 bg-background">
      <div className="mx-auto w-full max-w-5xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
        <section className="space-y-8">
          <div className="space-y-2">
            <p className="text-sm font-medium text-primary">Akun Saya</p>
            <h1 className="mt-2 font-serif text-3xl font-semibold text-foreground">Profil Saya</h1>
            <p className="mt-2 text-sm text-muted-foreground">Kelola informasi pribadi yang terhubung dengan akun kamu.</p>
          </div>

          <div className="rounded-lg border border-border bg-card p-5 sm:p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                <UserRound className="size-5" />
              </div>

              <div>
                <h2 className="font-medium text-foreground">Informasi Pribadi</h2>
                <p className="text-sm text-muted-foreground">Perbarui nama dan nomor telepon kamu.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="profile-name" className="text-sm font-medium text-foreground">
                  Nama Lengkap
                </label>

                <div className="relative">
                  <UserRound className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                  <input
                    id="profile-name"
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    maxLength={255}
                    required
                    autoComplete="name"
                    disabled={isSaving}
                    className="h-11 w-full rounded-md border bg-background pl-10 pr-3 text-sm outline-none transition-colors focus:border-primary disabled:opacity-60"
                    placeholder="Masukkan nama lengkap"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="profile-email" className="text-sm font-medium text-foreground">
                  Email
                </label>

                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                  <input id="profile-email" type="email" value={user.email} readOnly disabled className="h-11 w-full rounded-md border bg-muted/40 pl-10 pr-3 text-sm text-muted-foreground" />
                </div>

                <p className="text-xs text-muted-foreground">Email tidak dapat diubah melalui halaman ini.</p>
              </div>

              <div className="space-y-2">
                <label htmlFor="profile-phone" className="text-sm font-medium text-foreground">
                  Nomor Telepon
                </label>

                <div className="relative">
                  <Phone className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                  <input
                    id="profile-phone"
                    type="tel"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    maxLength={30}
                    autoComplete="tel"
                    disabled={isSaving}
                    className="h-11 w-full rounded-md border bg-background pl-10 pr-3 text-sm outline-none transition-colors focus:border-primary disabled:opacity-60"
                    placeholder="Masukkan nomor telepon"
                  />
                </div>
              </div>

              {error && (
                <p className="text-sm text-destructive" role="alert">
                  {error}
                </p>
              )}

              <div className="flex justify-end border-t pt-5">
                <button
                  type="submit"
                  disabled={isSaving || !name.trim()}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Save className="size-4" />
                  {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}

export default function ProfilePage() {
  const { user, status, updateProfile } = useAuth();

  if (status === "loading" || !user) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <p className="text-sm text-muted-foreground" role="status">
          Memuat profil...
        </p>
      </div>
    );
  }

  return <ProfileForm key={user.uuid} user={user} updateProfile={updateProfile} />;
}
