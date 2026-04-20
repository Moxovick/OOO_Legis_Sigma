"use client";
import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/api";
import type { ServiceDetail } from "@/types";

export default function AdminServices({ token }: { token: string }) {
  const [services, setServices] = useState<ServiceDetail[]>([]);
  const [editing, setEditing] = useState<ServiceDetail | null>(null);
  const [saving, setSaving] = useState(false);

  const load = () => adminFetch<ServiceDetail[]>("/api/admin/services", token).then(setServices);
  useEffect(() => { load(); }, [token]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    try {
      await adminFetch(`/api/admin/services/${editing.id}`, token, {
        method: "PATCH",
        body: JSON.stringify({
          title: editing.title,
          description: editing.description,
          sort_order: editing.sort_order,
          is_active: editing.is_active,
          content_design: editing.content_design,
          content_install: editing.content_install,
          content_maintain: editing.content_maintain,
          meta_title: editing.meta_title,
          meta_description: editing.meta_description,
        }),
      });
      setEditing(null);
      load();
    } finally {
      setSaving(false);
    }
  };

  if (editing) {
    return (
      <div>
        <button onClick={() => setEditing(null)} style={backBtn}>← Назад к списку</button>
        <h1 style={h1}>Редактировать: {editing.title}</h1>
        <form onSubmit={handleSave} style={{ maxWidth: "700px" }}>
          {[
            { key: "title", label: "Название" },
            { key: "description", label: "Описание (краткое)" },
            { key: "sort_order", label: "Порядок сортировки" },
            { key: "meta_title", label: "Meta title" },
            { key: "meta_description", label: "Meta description" },
            { key: "content_design", label: "Контент вкладки «Проектирование»", area: true },
            { key: "content_install", label: "Контент вкладки «Монтаж»", area: true },
            { key: "content_maintain", label: "Контент вкладки «Обслуживание»", area: true },
          ].map(({ key, label, area }) => (
            <div key={key} style={{ marginBottom: "1.25rem" }}>
              <label style={labelStyle}>{label}</label>
              {area ? (
                <textarea
                  value={(editing as any)[key] ?? ""}
                  onChange={(e) => setEditing((p) => p ? { ...p, [key]: e.target.value } : p)}
                  style={{ ...inputStyle, minHeight: "100px", resize: "vertical" }}
                />
              ) : (
                <input
                  type={key === "sort_order" ? "number" : "text"}
                  value={(editing as any)[key] ?? ""}
                  onChange={(e) => setEditing((p) => p ? { ...p, [key]: key === "sort_order" ? Number(e.target.value) : e.target.value } : p)}
                  style={inputStyle}
                />
              )}
            </div>
          ))}
          <div style={{ marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <input
              type="checkbox"
              checked={editing.is_active}
              onChange={(e) => setEditing((p) => p ? { ...p, is_active: e.target.checked } : p)}
            />
            <label>Активна</label>
          </div>
          <button type="submit" style={btnStyle} disabled={saving}>
            {saving ? "Сохранение..." : "Сохранить"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <h1 style={h1}>Услуги</h1>
      <p style={{ color: "#888", fontSize: "0.875rem", marginBottom: "1.5rem" }}>
        Иконки и изображения задаются через URL. Загрузите файл через кнопку "Загрузить файл" и вставьте URL.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {services.map((s) => (
          <div key={s.id} style={{ background: "#fff", border: "1px solid #dfe5ee", borderRadius: "8px", padding: "1rem 1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontWeight: 500 }}>{s.title}</div>
              <div style={{ fontSize: "0.75rem", color: "#888", marginTop: "0.25rem" }}>
                slug: {s.slug} · порядок: {s.sort_order} · {s.is_active ? "активна" : "скрыта"}
              </div>
            </div>
            <button onClick={() => setEditing(s)} style={editBtn}>Редактировать</button>
          </div>
        ))}
      </div>
    </div>
  );
}

const h1: React.CSSProperties = { fontSize: "1.5rem", fontWeight: 600, marginBottom: "1.5rem" };
const labelStyle: React.CSSProperties = { display: "block", fontSize: "0.8rem", fontWeight: 500, marginBottom: "0.375rem", color: "#555" };
const inputStyle: React.CSSProperties = { width: "100%", padding: "0.625rem 0.875rem", border: "1px solid #dfe5ee", borderRadius: "6px", fontSize: "0.9rem", boxSizing: "border-box" };
const btnStyle: React.CSSProperties = { background: "#0034D8", color: "#fff", border: "none", borderRadius: "6px", padding: "0.75rem 1.5rem", fontWeight: 600, cursor: "pointer", fontSize: "0.9rem" };
const editBtn: React.CSSProperties = { background: "#fff", color: "#0034D8", border: "1px solid #0034D8", borderRadius: "6px", padding: "0.4rem 0.875rem", cursor: "pointer", fontSize: "0.8rem", whiteSpace: "nowrap" };
const backBtn: React.CSSProperties = { background: "transparent", border: "none", color: "#0034D8", cursor: "pointer", fontSize: "0.875rem", marginBottom: "1rem", padding: 0 };
