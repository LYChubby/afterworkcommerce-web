"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/features/auth/providers/auth-provider";

interface AuthGuardProps {
  children: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const { status } = useAuth();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  if (status === "loading" || status === "unauthenticated") {
    return (
      <main className="flex min-h-screen items-center justify-center p-6">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Memeriksa autentikasi...</p>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}
