"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

import { AuthServiceError, exchangeGoogleCode, getCurrentUser, logout as logoutService } from "@/features/auth/services/auth-service";

import type { AuthUser } from "@/types/auth";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

interface AuthContextValue {
  user: AuthUser | null;
  status: AuthStatus;
  error: string | null;
  loginWithGoogleCode: (code: string) => Promise<void>;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [error, setError] = useState<string | null>(null);

  const refreshUser = useCallback(async () => {
    setStatus("loading");
    setError(null);

    try {
      const currentUser = await getCurrentUser();

      setUser(currentUser);
      setStatus("authenticated");
    } catch (error) {
      setUser(null);
      setStatus("unauthenticated");

      if (error instanceof AuthServiceError && error.status !== 401) {
        setError(error.message);
      }
    }
  }, []);

  useEffect(() => {
    let active = true;

    async function initializeAuth() {
      try {
        const currentUser = await getCurrentUser();

        if (!active) return;

        setUser(currentUser);
        setStatus("authenticated");
      } catch (error) {
        if (!active) return;

        setUser(null);
        setStatus("unauthenticated");

        if (error instanceof AuthServiceError && error.status !== 401) {
          setError(error.message);
        }
      }
    }

    void initializeAuth();

    return () => {
      active = false;
    };
  }, []);

  const loginWithGoogleCode = useCallback(async (code: string) => {
    setStatus("loading");
    setError(null);

    try {
      const authenticatedUser = await exchangeGoogleCode(code);

      setUser(authenticatedUser);
      setStatus("authenticated");
    } catch (error) {
      setUser(null);
      setStatus("unauthenticated");

      if (error instanceof Error) {
        setError(error.message);
      }

      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    setError(null);

    try {
      await logoutService();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }

      throw error;
    } finally {
      setUser(null);
      setStatus("unauthenticated");
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        status,
        error,
        loginWithGoogleCode,
        refreshUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }

  return context;
}
