"use client";
import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/api";
import type { Offer } from "@/types";

export default function AdminOffers({ token }: { token: string }) {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [editing, setEditing] = useState<Partial<Offer> | null>(null);
  const [saving, setSaving] = useState(false);

  const load = () => adminFetch<Offer[]>("/api/admin/offers", token).then(setOffers);
  useEffect(() => { load(); }, [token]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    try {
      if (editing.id) {
        await adminFetch(`/api/admin/offers/${editing.id}`, token, { method: "PATCH", body: JSON.stringify(editing) });
      } else {
        await adminFetch("/api/admin/offers", token, { method: "POST", body: JSON.stringify(editing) });
      }
      setEditing(null);
      load();
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Удалить акцию?")) return;
    await adminFetch(`/api/admin/offers/${id}`, token, { method: "DELETE" });
    load();
  };

  if (editing !== null) {
    return (
      <div>
        <button onClick={() => setEditing(null)} style={backBtn}>← Назад</button>
        <h1 style={h1}>{editing.id ? "Редактировать акцию" : "Новая акция"}</h1>
        <form onSubmit={handleSave} style={{ maxWidth: "600px" }}>
          {[
            { key: "title", label: "Заголовок", required: true },
            { key: "description", label: "Описание" },
            { key: "sort_order", label: "Порядок" },
          ].map(({ key, label, required }) => (
            <div key={key} style={{ marginBottom: "1.25rem" }}>
              <label style={labelStyle}>{label}</label>
              <input
                type={key === "sort_order" ? "number" : "text"}
                required={required}
                value={(editing as any)[key] ?? ""}
                onChange={(e) => setEditing((p) => ({ ...p!, [key]: key === "sort_order" ? Number(e.target.value) : e.target.value }))}
                style={inputStyle}
              />
            </div>
          ))}
          <div style={{ marginBottom: "1.25rem", display: "flex", gap: "0.75rem", alignItems: "center" }}>
            <input type="checkbox" checked={editing.is_active ?? true} onChange={(e) => setEditing((p) => ({ ...p!, is_active: e.target.checked }))} />
            <label>Активна</label>
          </div>
          <button type="submit" style={btnStyle} disabled={saving}>{saving ? "..." : "Сохранить"}</button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h1 style={h1}>Акции</h1>
        <button onClick={() => setEditing({ title: "", is_active: true, sort_order: offers.length })} style={btnStyle}>+ Добавить</button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {offers.map((o) => (
          <div key={o.id} style={{ background: "#fff", border: "1px solid #dfe5ee", borderRadius: "8px", padding: "1rem 1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontWeight: 500 }}>{o.title}</div>
              <div style={{ fontSize: "0.8rem", color: "#888", marginTop: "0.25rem" }}>{o.description}</div>
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button onClick={() => setEditing(o)} style={editBtn}>Изменить</button>
              <button onClick={() => handleDelete(o.id)} style={deleteBtn}>Удалить</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const h1: React.CSSProperties = { fontSize: "1.5rem", fontWeight: 600, margin: 0 };
const labelStyle: React.CSSProperties = { display: "block", fontSize: "0.8rem", fontWeight: 500, marginBottom: "0.375rem", color: "#555" };
const inputStyle: React.CSSProperties = { width: "100%", padding: "0.625rem 0.875rem", border: "1px solid #dfe5ee", borderRadius: "6px", fontSize: "0.9rem", boxSizing: "border-box" };
const btnStyle: React.CSSProperties = { background: "#0034D8", color: "#fff", border: "none", borderRadius: "6px", padding: "0.625rem 1.25rem", fontWeight: 600, cursor: "pointer", fontSize: "0.875rem" };
const editBtn: React.CSSProperties = { background: "#fff", color: "#0034D8", border: "1px solid #0034D8", borderRadius: "6px", padding: "0.375rem 0.75rem", cursor: "pointer", fontSize: "0.8rem" };
const deleteBtn: React.CSSProperties = { background: "#fff", color: "#c33", border: "1px solid #c33", borderRadius: "6px", padding: "0.375rem 0.75rem", cursor: "pointer", fontSize: "0.8rem" };
const backBtn: React.CSSProperties = { background: "transparent", border: "none", color: "#0034D8", cursor: "pointer", fontSize: "0.875rem", marginBottom: "1rem", padding: 0 };
