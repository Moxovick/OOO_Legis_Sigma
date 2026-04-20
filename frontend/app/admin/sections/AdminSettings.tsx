"use client";
import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/api";
import type { Setting } from "@/types";

const FIELD_LABELS: Record<string, string> = {
  phone: "Телефон",
  phone_href: "Телефон (href, напр. tel:84951281318)",
  email: "Email",
  address: "Адрес офиса",
  work_hours_weekdays: "Часы работы (пн-чт)",
  work_hours_friday: "Часы работы (пятница)",
  company_name: "Название компании",
  copyright_year: "Год в копирайте",
  hero_title: "Заголовок главной страницы",
  hero_text: "Текст главной страницы",
  about_title: "Заголовок секции «О компании»",
  about_text: "Текст секции «О компании»",
  seo_text_title: "SEO-заголовок (подвал главной)",
  seo_text: "SEO-текст (подвал главной)",
  map_lat: "Широта карты",
  map_lon: "Долгота карты",
  meta_title: "Meta title сайта",
  meta_description: "Meta description сайта",
};

export default function AdminSettings({ token }: { token: string }) {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    adminFetch<Setting[]>("/api/admin/settings", token).then((data) => {
      setSettings(Object.fromEntries(data.map((s) => [s.key, s.value ?? ""])));
    });
  }, [token]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      await adminFetch("/api/admin/settings", token, {
        method: "PATCH",
        body: JSON.stringify({ settings }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 style={h1}>Настройки сайта</h1>
      <form onSubmit={handleSave} style={{ maxWidth: "700px" }}>
        {Object.entries(FIELD_LABELS).map(([key, label]) => (
          <div key={key} style={{ marginBottom: "1.25rem" }}>
            <label style={labelStyle}>{label}</label>
            {key.endsWith("_text") || key === "meta_description" ? (
              <textarea
                value={settings[key] ?? ""}
                onChange={(e) => setSettings((p) => ({ ...p, [key]: e.target.value }))}
                style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }}
              />
            ) : (
              <input
                type="text"
                value={settings[key] ?? ""}
                onChange={(e) => setSettings((p) => ({ ...p, [key]: e.target.value }))}
                style={inputStyle}
              />
            )}
          </div>
        ))}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <button type="submit" style={btnStyle} disabled={saving}>
            {saving ? "Сохранение..." : "Сохранить"}
          </button>
          {saved && <span style={{ color: "green", fontSize: "0.875rem" }}>Сохранено</span>}
        </div>
      </form>
    </div>
  );
}

const h1: React.CSSProperties = { fontSize: "1.5rem", fontWeight: 600, marginBottom: "1.5rem" };
const labelStyle: React.CSSProperties = { display: "block", fontSize: "0.8rem", fontWeight: 500, marginBottom: "0.375rem", color: "#555" };
const inputStyle: React.CSSProperties = { width: "100%", padding: "0.625rem 0.875rem", border: "1px solid #dfe5ee", borderRadius: "6px", fontSize: "0.9rem", boxSizing: "border-box" };
const btnStyle: React.CSSProperties = { background: "#0034D8", color: "#fff", border: "none", borderRadius: "6px", padding: "0.75rem 1.5rem", fontWeight: 600, cursor: "pointer", fontSize: "0.9rem" };
