"use client";
import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/api";
import type { Setting } from "@/types";

const GROUPS = [
  {
    icon: "📞",
    title: "Телефон и Email",
    hint: "Отображаются в шапке, подвале и разделе контактов",
    fields: [
      { key: "phone", label: "Телефон", placeholder: "8 495 128-13-18", type: "text" },
      { key: "email", label: "Email",   placeholder: "info@legis-teh.com", type: "email" },
    ],
  },
  {
    icon: "📍",
    title: "Адрес офиса",
    hint: "Выводится в разделе Контакты и подвале",
    fields: [
      { key: "address", label: "Полный адрес", placeholder: "101000, Москва, Большой Златоустинский переулок, 7/1", type: "text" },
    ],
  },
  {
    icon: "🕐",
    title: "Часы работы",
    hint: "Отображаются в шапке и разделе Контакты",
    fields: [
      { key: "work_hours_weekdays", label: "Пн–Чт",   placeholder: "Пн-Чт: 9:30–18:00", type: "text" },
      { key: "work_hours_friday",   label: "Пятница",  placeholder: "Пт: 9:30–17:00",    type: "text" },
    ],
  },
  {
    icon: "🗺️",
    title: "Карта",
    hint: "Координаты для встроенной Яндекс.Карты",
    fields: [
      { key: "map_lat", label: "Широта",  placeholder: "55.757222",  type: "text" },
      { key: "map_lon", label: "Долгота", placeholder: "37.635556",  type: "text" },
    ],
  },
];

const KEYS = GROUPS.flatMap((g) => g.fields.map((f) => f.key));

export default function AdminContacts({ token }: { token: string }) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "ok" | "err">("idle");

  useEffect(() => {
    adminFetch<Setting[]>("/api/admin/settings", token).then((data) => {
      const map = Object.fromEntries(data.map((s) => [s.key, s.value ?? ""]));
      setValues(Object.fromEntries(KEYS.map((k) => [k, map[k] ?? ""])));
    });
  }, [token]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setStatus("idle");
    try {
      // Auto-generate phone_href from phone number (strip non-digits, prepend tel:)
      const digits = (values.phone || "").replace(/\D/g, "");
      const settingsToSave = { ...values, phone_href: digits ? `tel:${digits}` : "" };
      await adminFetch("/api/admin/settings", token, {
        method: "PATCH", body: JSON.stringify({ settings: settingsToSave }),
      });
      setStatus("ok");
      setTimeout(() => setStatus("idle"), 3000);
    } catch { setStatus("err"); }
    finally { setSaving(false); }
  };

  const set = (key: string, val: string) => setValues((p) => ({ ...p, [key]: val }));

  return (
    <div style={{ maxWidth: 700 }}>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={S.h1}>Контактные данные</h1>
        <p style={{ color: "#64748b", fontSize: "0.875rem", margin: "0.25rem 0 0" }}>
          Изменения мгновенно применяются на всех страницах сайта
        </p>
      </div>

      <form onSubmit={save} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {GROUPS.map((group) => (
          <div key={group.title} style={S.card}>
            {/* Card header */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "1.25rem", paddingBottom: "1rem", borderBottom: "1px solid #f1f5f9" }}>
              <span style={{ fontSize: "1.1rem" }}>{group.icon}</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "#0f172a" }}>{group.title}</div>
                <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "1px" }}>{group.hint}</div>
              </div>
            </div>

            {/* Fields */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {group.fields.map((field) => (
                <div key={field.key}>
                  <label style={S.label}>{field.label}</label>
                  <input
                    type={field.type}
                    value={values[field.key] ?? ""}
                    placeholder={field.placeholder}
                    onChange={(e) => set(field.key, e.target.value)}
                    style={S.input}
                    onFocus={(e) => { e.currentTarget.style.borderColor = "#0034D8"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(0,52,216,0.1)"; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.boxShadow = "none"; }}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Save */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", paddingTop: "0.5rem" }}>
          <button type="submit" disabled={saving} style={{
            ...S.saveBtn,
            opacity: saving ? 0.75 : 1,
            cursor: saving ? "not-allowed" : "pointer",
          }}>
            {saving ? (
              <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ animation: "spin 1s linear infinite" }}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
                Сохранение...
              </span>
            ) : (
              <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                Сохранить изменения
              </span>
            )}
          </button>

          {status === "ok" && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "#16a34a", fontSize: "0.875rem", fontWeight: 600 }}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              Сохранено
            </div>
          )}
          {status === "err" && (
            <div style={{ color: "#dc2626", fontSize: "0.875rem" }}>Ошибка — попробуйте снова</div>
          )}
        </div>
      </form>

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

const S: Record<string, React.CSSProperties> = {
  h1: { fontSize: "1.5rem", fontWeight: 700, margin: 0, color: "#0f172a" },
  card: {
    background: "#fff",
    border: "1.5px solid #e2e8f0",
    borderRadius: "14px",
    padding: "1.25rem 1.5rem",
  },
  label: {
    display: "block",
    fontSize: "0.78rem",
    fontWeight: 600,
    color: "#475569",
    marginBottom: "0.375rem",
    textTransform: "uppercase" as const,
    letterSpacing: "0.04em",
  },
  input: {
    width: "100%",
    padding: "0.65rem 0.875rem",
    border: "1.5px solid #e2e8f0",
    borderRadius: "9px",
    fontSize: "0.9rem",
    outline: "none",
    boxSizing: "border-box" as const,
    background: "#f8fafc",
    color: "#0f172a",
    transition: "border-color 0.15s, box-shadow 0.15s",
  },
  saveBtn: {
    background: "#0034D8",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    padding: "0.75rem 1.75rem",
    fontWeight: 700,
    fontSize: "0.875rem",
    display: "flex",
    alignItems: "center",
  },
};
