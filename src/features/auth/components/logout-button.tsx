"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import { useAuth } from "@/features/auth/providers/auth-provider";

interface LogoutButtonProps {
  iconOnly?: boolean;
}

export function LogoutButton({ iconOnly = false }: LogoutButtonProps) {
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
    <div className="w-full">
      <button
        type="button"
        onClick={handleLogout}
        disabled={status !== "authenticated" || isLoggingOut}
        title={iconOnly ? "Keluar" : undefined}
        aria-label={isLoggingOut ? "Sedang keluar dari akun" : "Keluar dari akun"}
        className={`inline-flex h-10 items-center justify-center gap-2 rounded-md border text-sm font-medium transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50 ${iconOnly ? "w-full px-0" : "w-full px-4"}`}
      >
        <LogOut className="size-4 shrink-0" aria-hidden="true" />
        {!iconOnly && <span>{isLoggingOut ? "Sedang keluar..." : "Keluar"}</span>}
      </button>

      {error && (
        <p className="mt-2 break-words text-xs text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
