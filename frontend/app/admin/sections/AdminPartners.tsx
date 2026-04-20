"use client";
import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/api";
import type { Partner } from "@/types";

export default function AdminPartners({ token }: { token: string }) {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [editing, setEditing] = useState<Partial<Partner> | null>(null);
  const [saving, setSaving] = useState(false);

  const load = () => adminFetch<Partner[]>("/api/admin/partners", token).then(setPartners);
  useEffect(() => { load(); }, [token]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    try {
      if (editing.id) {
        await adminFetch(`/api/admin/partners/${editing.id}`, token, { method: "PATCH", body: JSON.stringify(editing) });
      } else {
        await adminFetch("/api/admin/partners", token, { method: "POST", body: JSON.stringify(editing) });
      }
      setEditing(null);
      load();
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Удалить партнёра?")) return;
    await adminFetch(`/api/admin/partners/${id}`, token, { method: "DELETE" });
    load();
  };

  if (editing !== null) {
    return (
      <div>
        <button onClick={() => setEditing(null)} style={backBtn}>← Назад</button>
        <h1 style={h1}>{editing.id ? "Редактировать партнёра" : "Новый партнёр"}</h1>
        <form onSubmit={handleSave} style={{ maxWidth: "500px" }}>
          <div style={{ marginBottom: "1.25rem" }}>
            <label style={labelStyle}>Название</label>
            <input required value={editing.name ?? ""} onChange={(e) => setEditing((p) => ({ ...p!, name: e.target.value }))} style={inputStyle} />
          </div>
          <div style={{ marginBottom: "1.25rem" }}>
            <label style={labelStyle}>Логотип (URL)</label>
            {editing.logo_url && <img src={editing.logo_url} alt="" style={{ maxHeight: "60px", marginBottom: "0.5rem", display: "block" }} />}
            <input
              value={editing.logo_url ?? ""}
              onChange={(e) => setEditing((p) => ({ ...p!, logo_url: e.target.value }))}
              style={inputStyle}
              placeholder="https://example.com/logo.png"
            />
          </div>
          <div style={{ marginBottom: "1.25rem" }}>
            <label style={labelStyle}>Порядок</label>
            <input type="number" value={editing.sort_order ?? 0} onChange={(e) => setEditing((p) => ({ ...p!, sort_order: Number(e.target.value) }))} style={inputStyle} />
          </div>
          <button type="submit" style={btnStyle} disabled={saving}>{saving ? "..." : "Сохранить"}</button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h1 style={h1}>Партнёры</h1>
        <button onClick={() => setEditing({ name: "", is_active: true, sort_order: partners.length })} style={btnStyle}>+ Добавить</button>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
        {partners.map((p) => (
          <div key={p.id} style={{ background: "#fff", border: "1px solid #dfe5ee", borderRadius: "8px", padding: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem", alignItems: "center", width: "160px" }}>
            {p.logo_url ? (
              <img src={p.logo_url} alt={p.name} style={{ maxHeight: "50px", maxWidth: "120px", objectFit: "contain" }} />
            ) : (
              <div style={{ height: "50px", display: "flex", alignItems: "center", justifyContent: "center", color: "#888", fontSize: "0.75rem" }}>нет лого</div>
            )}
            <div style={{ fontSize: "0.8rem", textAlign: "center" }}>{p.name}</div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button onClick={() => setEditing(p)} style={editBtn}>✎</button>
              <button onClick={() => handleDelete(p.id)} style={deleteBtn}>✕</button>
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
const editBtn: React.CSSProperties = { background: "#fff", color: "#0034D8", border: "1px solid #0034D8", borderRadius: "6px", padding: "0.375rem 0.6rem", cursor: "pointer", fontSize: "0.8rem" };
const deleteBtn: React.CSSProperties = { background: "#fff", color: "#c33", border: "1px solid #c33", borderRadius: "6px", padding: "0.375rem 0.6rem", cursor: "pointer", fontSize: "0.8rem" };
const backBtn: React.CSSProperties = { background: "transparent", border: "none", color: "#0034D8", cursor: "pointer", fontSize: "0.875rem", marginBottom: "1rem", padding: 0 };
