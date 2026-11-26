"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";

import { AuthServiceError, exchangeGoogleCode, getCurrentUser, loginWithEmailPassword, registerWithEmailPassword, updateCurrentUser, logout as logoutService } from "@/features/auth/services/auth-service";

import type { UserProfile, UpdateProfilePayload } from "@/types/auth";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

interface AuthContextValue {
  user: UserProfile | null;
  status: AuthStatus;
  error: string | null;
  loginWithGoogleCode: (code: string) => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<UserProfile>;
  registerWithEmail: (name: string, email: string, password: string, passwordConfirmation: string) => Promise<UserProfile>;
  updateProfile: (payload: UpdateProfilePayload) => Promise<UserProfile>;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [error, setError] = useState<string | null>(null);

  const operationRef = useRef(0);

  const refreshUser = useCallback(async () => {
    const operation = ++operationRef.current;

    setError(null);

    try {
      const currentUser = await getCurrentUser();

      if (operation !== operationRef.current) return;

      setUser(currentUser);
      setStatus("authenticated");
    } catch (error) {
      if (operation !== operationRef.current) return;

      setUser(null);
      setStatus("unauthenticated");

      if (error instanceof Error) {
        setError(error.message);
      }

      throw error;
    }
  }, []);

  const updateProfile = useCallback(async (payload: UpdateProfilePayload): Promise<UserProfile> => {
    const operation = operationRef.current;

    const updatedUser = await updateCurrentUser(payload);

    if (operation === operationRef.current) {
      setUser(updatedUser);
      setStatus("authenticated");
      setError(null);
    }

    return updatedUser;
  }, []);

  useEffect(() => {
    let active = true;
    const operation = ++operationRef.current;

    async function initializeAuth() {
      try {
        const currentUser = await getCurrentUser();

        if (!active || operation !== operationRef.current) return;

        setUser(currentUser);
        setStatus("authenticated");
      } catch (error) {
        if (!active || operation !== operationRef.current) return;

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
    const operation = ++operationRef.current;

    setStatus("loading");
    setError(null);

    try {
      await exchangeGoogleCode(code);

      const currentUser = await getCurrentUser();

      if (operation !== operationRef.current) return;

      setUser(currentUser);
      setStatus("authenticated");
    } catch (error) {
      if (operation === operationRef.current) {
        setUser(null);
        setStatus("unauthenticated");

        if (error instanceof Error) {
          setError(error.message);
        }
      }

      throw error;
    }
  }, []);

  const loginWithEmail = useCallback(async (email: string, password: string): Promise<UserProfile> => {
    const operation = ++operationRef.current;

    setError(null);

    try {
      await loginWithEmailPassword(email, password);

      const currentUser = await getCurrentUser();

      if (operation !== operationRef.current) {
        return currentUser;
      }

      setUser(currentUser);
      setStatus("authenticated");
      setError(null);

      return currentUser;
    } catch (error) {
      if (operation === operationRef.current) {
        setUser(null);
        setStatus("unauthenticated");

        if (error instanceof AuthServiceError) {
          setError(error.message);
        } else {
          setError("Unable to complete authentication.");
        }
      }

      throw error;
    }
  }, []);

  const registerWithEmail = useCallback(async (name: string, email: string, password: string, passwordConfirmation: string): Promise<UserProfile> => {
    const operation = ++operationRef.current;

    setError(null);

    try {
      await registerWithEmailPassword(name, email, password, passwordConfirmation);

      const currentUser = await getCurrentUser();

      if (operation !== operationRef.current) {
        return currentUser;
      }

      setUser(currentUser);
      setStatus("authenticated");
      setError(null);

      return currentUser;
    } catch (error) {
      if (operation === operationRef.current) {
        setUser(null);
        setStatus("unauthenticated");

        if (error instanceof AuthServiceError) {
          setError(error.message);
        } else {
          setError("Unable to complete registration.");
        }
      }

      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    const operation = ++operationRef.current;

    setError(null);

    try {
      await logoutService();

      if (operation !== operationRef.current) return;

      setUser(null);
      setStatus("unauthenticated");
    } catch (error) {
      if (operation === operationRef.current && error instanceof Error) {
        setError(error.message);
      }

      throw error;
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        status,
        error,
        loginWithGoogleCode,
        loginWithEmail,
        registerWithEmail,
        updateProfile,
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
