"use client";

import { useRouter } from "next/navigation";

import { useAuth } from "@/features/auth/providers/auth-provider";

export function GoogleLoginButton() {
  const router = useRouter();
  const { status } = useAuth();

  const isDisabled = status !== "unauthenticated";

  function handleLogin() {
    router.push("/api/auth/google/redirect");
  }

  return (
    <button
      type="button"
      onClick={handleLogin}
      disabled={isDisabled}
      className="inline-flex w-full items-center justify-center gap-3 rounded-md border px-4 py-3 text-sm font-medium transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
    >
      {status === "loading" ? "Memeriksa sesi..." : status === "authenticated" ? "Sudah masuk" : "Lanjutkan dengan Google"}
    </button>
  );
}
