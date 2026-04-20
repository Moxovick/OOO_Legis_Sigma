"use client";

export function saveTokens(access: string, refresh: string) {
  localStorage.setItem("admin_access", access);
  localStorage.setItem("admin_refresh", refresh);
}

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("admin_access");
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("admin_refresh");
}

export function clearTokens() {
  localStorage.removeItem("admin_access");
  localStorage.removeItem("admin_refresh");
}

export function isLoggedIn(): boolean {
  return !!getAccessToken();
}
