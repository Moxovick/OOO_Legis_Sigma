"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken, clearTokens } from "@/lib/adminAuth";
import AdminLeads from "./sections/AdminLeads";
import AdminContacts from "./sections/AdminContacts";
import AdminDostavka from "./sections/AdminDostavka";
import AdminServices from "./sections/AdminServices";
import AdminOffers from "./sections/AdminOffers";
import AdminPartners from "./sections/AdminPartners";
import AdminStats from "./sections/AdminStats";

type Section = "leads" | "contacts" | "dostavka" | "services" | "offers" | "partners" | "stats";

export default function AdminPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [section, setSection] = useState<Section>("leads");

  useEffect(() => {
    const t = getAccessToken();
    if (!t) { window.location.replace("/admin/login"); return; }
    setToken(t);
  }, []);

  const handleLogout = useCallback(async () => {
    if (token) {
      try {
        const refresh = localStorage.getItem("admin_refresh");
        if (refresh) {
          await fetch("/api/admin/logout", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ refresh_token: refresh }),
          });
        }
      } catch {}
    }
    clearTokens();
    router.push("/admin/login");
  }, [token, router]);

  if (!token) return null;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f1f5f9", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>

      {/* ── Sidebar ── */}
      <aside style={{
        width: "256px", minWidth: "256px",
        background: "#0f172a",
        display: "flex", flexDirection: "column",
        position: "sticky", top: 0, height: "100vh", overflowY: "auto",
      }}>
        {/* Logo */}
        <div style={{ padding: "1.75rem 1.5rem 1.25rem" }}>
          <img src="/images/logo.svg" alt="Сигма-Профи" style={{ height: "28px", filter: "brightness(0) invert(1)", display: "block" }} />
          <div style={{ marginTop: "0.5rem", fontSize: "0.7rem", color: "#475569", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>
            Панель управления
          </div>
        </div>

        <div style={{ height: "1px", background: "#1e293b", margin: "0 1.5rem" }} />

        {/* Nav */}
        <nav style={{ flex: 1, padding: "1rem 0.75rem" }}>
          <NavItem icon={<IconLeads />} label="Заявки" active={section === "leads"} onClick={() => setSection("leads")} />
          <NavItem icon={<IconContacts />} label="Контакты" active={section === "contacts"} onClick={() => setSection("contacts")} />
          <div style={{ height: "1px", background: "#1e293b", margin: "0.5rem 0.125rem" }} />
          <div style={{ fontSize: "0.65rem", color: "#475569", textTransform: "uppercase", letterSpacing: "0.08em", padding: "0.25rem 0.875rem 0.25rem", fontWeight: 600 }}>Контент</div>
          <NavItem icon={<IconServices />} label="Услуги" active={section === "services"} onClick={() => setSection("services")} />
          <NavItem icon={<IconOffers />} label="Акции" active={section === "offers"} onClick={() => setSection("offers")} />
          <NavItem icon={<IconPartners />} label="Партнёры" active={section === "partners"} onClick={() => setSection("partners")} />
          <NavItem icon={<IconStats />} label="Цифры компании" active={section === "stats"} onClick={() => setSection("stats")} />
          <div style={{ height: "1px", background: "#1e293b", margin: "0.5rem 0.125rem" }} />
          <div style={{ fontSize: "0.65rem", color: "#475569", textTransform: "uppercase", letterSpacing: "0.08em", padding: "0.25rem 0.875rem 0.25rem", fontWeight: 600 }}>Страницы</div>
          <NavItem icon={<IconPage />} label="Доставка документов" active={section === "dostavka"} onClick={() => setSection("dostavka")} />
        </nav>

        {/* Footer */}
        <div style={{ padding: "1rem 1.5rem 1.5rem", borderTop: "1px solid #1e293b" }}>
          <div style={{ fontSize: "0.75rem", color: "#475569", marginBottom: "0.75rem" }}>Сигма-Профи © 2024</div>
          <button onClick={handleLogout} style={{
            width: "100%", background: "transparent", color: "#64748b",
            border: "1px solid #1e293b", borderRadius: "8px",
            padding: "0.5rem", cursor: "pointer", fontSize: "0.8rem",
            display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
          }}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>
            Выйти
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main style={{ flex: 1, minWidth: 0, padding: "2rem 2.5rem", overflowX: "hidden" }}>
        {section === "leads" && <AdminLeads token={token} />}
        {section === "contacts" && <AdminContacts token={token} />}
        {section === "services" && <AdminServices token={token} />}
        {section === "offers" && <AdminOffers token={token} />}
        {section === "partners" && <AdminPartners token={token} />}
        {section === "stats" && <AdminStats token={token} />}
        {section === "dostavka" && <AdminDostavka token={token} />}
      </main>
    </div>
  );
}

function NavItem({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{
      display: "flex", alignItems: "center", gap: "0.75rem",
      width: "100%", padding: "0.7rem 0.875rem",
      background: active ? "#1e3a8a" : "transparent",
      color: active ? "#fff" : "#94a3b8",
      border: "none", borderRadius: "8px", cursor: "pointer",
      fontSize: "0.875rem", fontWeight: active ? 600 : 400,
      textAlign: "left", marginBottom: "2px",
      transition: "all 0.15s",
    }}>
      <span style={{ opacity: active ? 1 : 0.7, display: "flex" }}>{icon}</span>
      {label}
    </button>
  );
}

function IconLeads() {
  return (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
      <rect x="9" y="3" width="6" height="4" rx="1"/>
      <path d="M9 12h6M9 16h4"/>
    </svg>
  );
}

function IconContacts() {
  return (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.23h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.37a16 16 0 0 0 6.72 6.72l1.2-.87a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  );
}

function IconPage() {
  return (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
      <polyline points="10 9 9 9 8 9"/>
    </svg>
  );
}

function IconServices() {
  return (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
    </svg>
  );
}

function IconOffers() {
  return (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
      <line x1="7" y1="7" x2="7.01" y2="7"/>
    </svg>
  );
}

function IconPartners() {
  return (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  );
}

function IconStats() {
  return (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>
    </svg>
  );
}
