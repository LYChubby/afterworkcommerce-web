"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/features/auth/providers/auth-provider";

export function LogoutButton() {
  const router = useRouter();
  const { logout, status } = useAuth();

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogout() {
    if (isLoggingOut || status !== "authenticated") {
      return;
    }

    setIsLoggingOut(true);
    setError(null);

    try {
      await logout();
      router.replace("/");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Gagal keluar dari akun.");
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleLogout}
        disabled={status !== "authenticated" || isLoggingOut}
        className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoggingOut ? "Sedang keluar..." : "Keluar"}
      </button>

      {error && (
        <p className="mt-2 text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
