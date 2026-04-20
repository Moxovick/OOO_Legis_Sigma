import type { Setting, Service, ServiceDetail, Offer, Partner, Stat, LeadList } from "@/types";

const BASE = process.env.BACKEND_URL || "http://localhost:8000";

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5000); // 5 s timeout

  let res: Response;
  try {
    res = await fetch(`${BASE}${path}`, {
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        // Avoid reusing stale keep-alive connections on reload
        Connection: "close",
        ...(options?.headers ?? {}),
      },
      cache: "no-store",
    });
  } finally {
    clearTimeout(timer);
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }
  return res.json();
}

export async function getSettings(): Promise<Setting[]> {
  return apiFetch<Setting[]>("/api/settings");
}

export function settingsToMap(settings: Setting[]): Record<string, string> {
  return Object.fromEntries(settings.map((s) => [s.key, s.value ?? ""]));
}

export async function getServices(): Promise<Service[]> {
  return apiFetch<Service[]>("/api/services");
}

export async function getService(slug: string): Promise<ServiceDetail> {
  return apiFetch<ServiceDetail>(`/api/services/${slug}`);
}

export async function getOffers(): Promise<Offer[]> {
  return apiFetch<Offer[]>("/api/offers");
}

export async function getPartners(): Promise<Partner[]> {
  return apiFetch<Partner[]>("/api/partners");
}

export async function getStats(): Promise<Stat[]> {
  return apiFetch<Stat[]>("/api/stats");
}

// ── Admin API (client-side only) ──────────────────────────────────────────────

export async function adminLogin(email: string, password: string) {
  const res = await fetch("/api/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error("Неверный email или пароль");
  return res.json();
}

export async function adminRefresh(refresh_token: string) {
  const res = await fetch("/api/admin/refresh", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token }),
  });
  if (!res.ok) throw new Error("Сессия истекла");
  return res.json();
}

export function authHeaders(token: string) {
  return { Authorization: `Bearer ${token}` };
}

async function doFetch(path: string, token: string, options?: RequestInit) {
  return fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(token),
      ...(options?.headers ?? {}),
    },
  });
}

export async function adminFetch<T>(
  path: string,
  token: string,
  options?: RequestInit
): Promise<T> {
  let res = await doFetch(path, token, options);

  // Auto-refresh access token on 401
  if (res.status === 401 && typeof window !== "undefined") {
    const refresh = localStorage.getItem("admin_refresh");
    if (refresh) {
      try {
        const refreshRes = await fetch("/api/admin/refresh", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh_token: refresh }),
        });
        if (refreshRes.ok) {
          const data = await refreshRes.json();
          localStorage.setItem("admin_access", data.access_token);
          localStorage.setItem("admin_refresh", data.refresh_token);
          // Retry original request with new token
          res = await doFetch(path, data.access_token, options);
        } else {
          // Refresh token is also expired — force logout
          localStorage.removeItem("admin_access");
          localStorage.removeItem("admin_refresh");
          window.location.href = "/admin/login";
          throw new Error("Сессия истекла. Войдите заново.");
        }
      } catch (e) {
        if (e instanceof Error && e.message.includes("Сессия")) throw e;
        // Network error during refresh — fall through to original error
      }
    }
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status}: ${text}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export async function submitLead(data: {
  name?: string;
  phone: string;
  message?: string;
  form_type: string;
}) {
  const res = await fetch("/api/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.detail || "Ошибка отправки");
  }
  return res.json();
}
