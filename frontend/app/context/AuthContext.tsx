"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { getMe, logoutUser } from "../services/authService";
import type { UserResponse } from "../services/authService";

interface AuthContextType {
  user: UserResponse | null;
  accessToken: string | null;
  isLoading: boolean;
  setTokenAndUser: (token: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<UserResponse | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Al montar — intentamos refrescar la sesión con la cookie
  useEffect(() => {
    refreshSession();
  }, []);

  const refreshSession = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
        {
          method: "POST",
          credentials: "include", // manda la cookie HttpOnly automáticamente
        }
      );

      if (!res.ok) {
        setIsLoading(false);
        return;
      }

      const data = await res.json();
      const token = data.access_token;
      setAccessToken(token);

      const userData = await getMe(token);
      setUser(userData);
    } catch {
      // No hay sesión activa — es normal
    } finally {
      setIsLoading(false);
    }
  };

  const setTokenAndUser = async (token: string) => {
    setAccessToken(token);
    const userData = await getMe(token);
    setUser(userData);
  };

  const logout = async () => {
    try {
      if (accessToken) await logoutUser(accessToken);
    } catch (err) {
      console.error("Logout failed silently:", err);
    } finally {
      setAccessToken(null);
      setUser(null);
      router.push("/");
    }
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, isLoading, setTokenAndUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}