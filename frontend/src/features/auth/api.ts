import { api } from "@/lib/api";
import type { AuthResponse, AuthUser } from "@/features/auth/types";

const TOKEN_KEY = "token";

export function getToken(): string | null {
  return typeof window === "undefined" ? null : localStorage.getItem(TOKEN_KEY);
}

function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export async function googleSignIn(credential: string): Promise<AuthResponse> {
  const res = await api<AuthResponse>("/auth/google/", {
    method: "POST",
    body: JSON.stringify({ credential }),
    skipAuth: true,
  });
  setToken(res.token);
  return res;
}

export async function register(
  email: string,
  password: string,
): Promise<AuthResponse> {
  const res = await api<AuthResponse>("/auth/register/", {
    method: "POST",
    body: JSON.stringify({ email, password }),
    skipAuth: true,
  });
  setToken(res.token);
  return res;
}

export async function emailLogin(
  email: string,
  password: string,
): Promise<AuthResponse> {
  const res = await api<AuthResponse>("/auth/login/", {
    method: "POST",
    body: JSON.stringify({ email, password }),
    skipAuth: true,
  });
  setToken(res.token);
  return res;
}

export async function logout(): Promise<void> {
  try {
    await api<void>("/auth/logout/", { method: "POST" });
  } finally {
    clearToken();
  }
}

export async function me(): Promise<AuthUser> {
  return api<AuthUser>("/auth/me/");
}
