"use client";
import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/api";
import type { Stat } from "@/types";

export default function AdminStats({ token }: { token: string }) {
  const [stats, setStats] = useState<Stat[]>([]);
  const [saving, setSaving] = useState<number | null>(null);
  const [saved, setSaved] = useState<number | null>(null);

  const load = () => adminFetch<Stat[]>("/api/admin/stats", token).then(setStats);
  useEffect(() => { load(); }, [token]);

  const handleChange = (id: number, key: keyof Stat, value: string) => {
    setStats((prev) => prev.map((s) => s.id === id ? { ...s, [key]: value } : s));
  };

  const handleSave = async (stat: Stat) => {
    setSaving(stat.id);
    try {
      await adminFetch(`/api/admin/stats/${stat.id}`, token, {
        method: "PATCH",
        body: JSON.stringify({ value: stat.value, label: stat.label, sort_order: stat.sort_order }),
      });
      setSaved(stat.id);
      setTimeout(() => setSaved(null), 2000);
    } finally { setSaving(null); }
  };

  return (
    <div>
      <h1 style={h1}>Цифры компании</h1>
      <p style={{ color: "#888", fontSize: "0.875rem", marginBottom: "1.5rem" }}>
        Пример значения: "15+" — число + знак
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "600px" }}>
        {stats.map((stat) => (
          <div key={stat.id} style={{ background: "#fff", border: "1px solid #dfe5ee", borderRadius: "8px", padding: "1rem 1.25rem", display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <input
              value={stat.value}
              onChange={(e) => handleChange(stat.id, "value", e.target.value)}
              placeholder="15+"
              style={{ ...inputStyle, width: "100px", flex: "0 0 100px" }}
            />
            <input
              value={stat.label}
              onChange={(e) => handleChange(stat.id, "label", e.target.value)}
              placeholder="лет опыта"
              style={{ ...inputStyle, flex: 1 }}
            />
            <button onClick={() => handleSave(stat)} style={btnStyle} disabled={saving === stat.id}>
              {saving === stat.id ? "..." : saved === stat.id ? "✓" : "Сохранить"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const h1: React.CSSProperties = { fontSize: "1.5rem", fontWeight: 600, marginBottom: "0.5rem" };
const inputStyle: React.CSSProperties = { padding: "0.625rem 0.875rem", border: "1px solid #dfe5ee", borderRadius: "6px", fontSize: "0.9rem", boxSizing: "border-box" };
const btnStyle: React.CSSProperties = { background: "#0034D8", color: "#fff", border: "none", borderRadius: "6px", padding: "0.625rem 1rem", fontWeight: 600, cursor: "pointer", fontSize: "0.875rem", whiteSpace: "nowrap" };
