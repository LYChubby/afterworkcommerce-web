"use client";

import { GoogleLoginButton } from "@/features/auth/components/google-login-button";
import { LogoutButton } from "@/features/auth/components/logout-button";
import { useAuth } from "@/features/auth/providers/auth-provider";

export function AuthActions() {
  const { status } = useAuth();

  if (status === "loading") {
    return (
      <div className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm text-muted-foreground" role="status" aria-live="polite">
        Memeriksa sesi...
      </div>
    );
  }

  if (status === "authenticated") {
    return <LogoutButton />;
  }

  return <GoogleLoginButton />;
}
