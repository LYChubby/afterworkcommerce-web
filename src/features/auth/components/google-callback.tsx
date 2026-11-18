"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import { AuthServiceError } from "@/features/auth/services/auth-service";
import { useAuth } from "@/features/auth/providers/auth-provider";

interface GoogleCallbackProps {
  code: string | null;
}

export function GoogleCallback({ code }: GoogleCallbackProps) {
  const { loginWithGoogleCode } = useAuth();

  const started = useRef(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!code || started.current) {
      return;
    }

    started.current = true;

    // Remove the one-time OAuth code from the visible URL.
    window.history.replaceState(null, "", "/auth/callback");

    async function completeLogin() {
      if (!code) {
        setError("Kode otorisasi Google tidak ditemukan.");
        return;
      }

      try {
        await loginWithGoogleCode(code);
        window.location.replace("/");
      } catch (error) {
        if (error instanceof AuthServiceError) {
          setError(error.message);
          return;
        }

        if (error instanceof Error) {
          setError(error.message);
          return;
        }

        setError("Google authentication failed.");
      }
    }

    void completeLogin();
  }, [code, loginWithGoogleCode]);

  if (!code) {
    return (
      <main className="flex min-h-screen items-center justify-center p-6">
        <div className="max-w-md text-center">
          <h1 className="text-xl font-semibold">Authentication failed</h1>
          <p className="mt-2 text-sm text-muted-foreground">OAuth authorization code was not found.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="max-w-md text-center">
        {error ? (
          <>
            <h1 className="text-xl font-semibold">Unable to sign in</h1>
            <p className="mt-2 text-sm text-destructive">{error}</p>
            <Link href="/" className="mt-6 inline-block text-sm underline underline-offset-4">
              Return to homepage
            </Link>
          </>
        ) : (
          <>
            <h1 className="text-xl font-semibold">Completing sign in</h1>
            <p className="mt-2 text-sm text-muted-foreground">Please wait while we verify your account.</p>
          </>
        )}
      </div>
    </main>
  );
}
