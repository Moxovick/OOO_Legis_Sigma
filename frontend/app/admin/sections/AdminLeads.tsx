"use client";
import { useEffect, useState, useCallback } from "react";
import { adminFetch } from "@/lib/api";
import type { LeadList, Lead } from "@/types";

/* ── Types ──────────────────────────────────────────────────────────────── */

const TYPES = [
  { key: "all",      label: "Все заявки",          color: "#64748b", bg: "#f1f5f9" },
  { key: "order",    label: "Заказ услуги",         color: "#0034D8", bg: "#eff6ff" },
  { key: "consult",  label: "Консультация",          color: "#7c3aed", bg: "#f5f3ff" },
  { key: "call",     label: "Обратный звонок",       color: "#0891b2", bg: "#ecfeff" },
  { key: "main",     label: "Свяжитесь с нами",      color: "#059669", bg: "#f0fdf4" },
  { key: "contacts", label: "Страница контактов",    color: "#0f766e", bg: "#f0fdfa" },
  { key: "contract", label: "Договор",               color: "#d97706", bg: "#fffbeb" },
] as const;

function getType(key: string) {
  return TYPES.find((t) => t.key === key) ?? TYPES[0];
}

function fmtDate(iso: string) {
  const d = new Date(iso);
  const today = new Date();
  const isToday = d.toDateString() === today.toDateString();
  if (isToday) return "Сегодня, " + d.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
  return d.toLocaleDateString("ru-RU", { day: "2-digit", month: "short" }) + ", " +
    d.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
}

/* ── Component ──────────────────────────────────────────────────────────── */

export default function AdminLeads({ token }: { token: string }) {
  const [data, setData] = useState<LeadList | null>(null);
  const [page, setPage] = useState(1);
  const [readFilter, setReadFilter] = useState<boolean | null>(null);
  const [typeFilter, setTypeFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    const p = new URLSearchParams({ page: String(page), per_page: "20" });
    if (readFilter !== null) p.set("is_read", String(readFilter));
    if (typeFilter !== "all") p.set("form_type", typeFilter);
    adminFetch<LeadList>(`/api/admin/leads?${p}`, token)
      .then(setData).finally(() => setLoading(false));
  }, [page, readFilter, typeFilter, token]);

  useEffect(() => { load(); }, [load]);

  const markRead = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    await adminFetch(`/api/admin/leads/${id}/read`, token, { method: "PATCH" });
    load();
  };

  const markAllRead = async () => {
    if (!data) return;
    await Promise.all(
      data.items.filter((l) => !l.is_read)
        .map((l) => adminFetch(`/api/admin/leads/${l.id}/read`, token, { method: "PATCH" }))
    );
    load();
  };

  const del = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Удалить заявку?")) return;
    await adminFetch(`/api/admin/leads/${id}`, token, { method: "DELETE" });
    load();
  };

  const unread = data?.items.filter((l) => !l.is_read).length ?? 0;
  const totalPages = data ? Math.ceil(data.total / 20) : 1;

  return (
    <div>
      {/* ── Header ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.75rem", flexWrap: "wrap", gap: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
          <h1 style={S.h1}>Заявки</h1>
          {unread > 0 && (
            <span style={{ background: "#0034D8", color: "#fff", borderRadius: "99px", padding: "0.2rem 0.75rem", fontSize: "0.75rem", fontWeight: 700 }}>
              {unread} новых
            </span>
          )}
          {data && (
            <span style={{ color: "#94a3b8", fontSize: "0.85rem" }}>/ {data.total} всего</span>
          )}
        </div>
        {unread > 0 && (
          <button onClick={markAllRead} style={S.outlineBtn}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ marginRight: 6 }}><polyline points="20 6 9 17 4 12"/></svg>
            Все прочитаны
          </button>
        )}
      </div>

      {/* ── Filters ── */}
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.25rem" }}>
        {/* Status */}
        <div style={{ display: "flex", background: "#fff", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "3px", gap: "2px" }}>
          {([null, false, true] as const).map((v) => (
            <button key={String(v)} onClick={() => { setReadFilter(v); setPage(1); }} style={{
              padding: "0.35rem 0.875rem", borderRadius: "7px", border: "none",
              background: readFilter === v ? "#0f172a" : "transparent",
              color: readFilter === v ? "#fff" : "#64748b",
              cursor: "pointer", fontSize: "0.8rem", fontWeight: 500, transition: "all 0.15s",
            }}>
              {v === null ? "Все" : v ? "Прочитанные" : "Новые"}
            </button>
          ))}
        </div>

        {/* Type */}
        {TYPES.map((t) => (
          <button key={t.key} onClick={() => { setTypeFilter(t.key); setPage(1); }} style={{
            padding: "0.375rem 0.875rem", borderRadius: "99px",
            border: `1.5px solid ${typeFilter === t.key ? t.color : "#e2e8f0"}`,
            background: typeFilter === t.key ? t.color : "#fff",
            color: typeFilter === t.key ? "#fff" : "#475569",
            cursor: "pointer", fontSize: "0.78rem", fontWeight: 500, transition: "all 0.15s",
          }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── List ── */}
      {loading ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "4rem", color: "#94a3b8" }}>
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ animation: "spin 1s linear infinite", marginRight: 8 }}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
          Загрузка...
        </div>
      ) : !data || data.items.length === 0 ? (
        <div style={{ background: "#fff", border: "1.5px dashed #e2e8f0", borderRadius: "12px", padding: "4rem", textAlign: "center" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>📭</div>
          <div style={{ color: "#94a3b8", fontSize: "0.95rem" }}>Заявок не найдено</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {data.items.map((lead) => {
            const t = getType(lead.form_type);
            const isOpen = expanded === lead.id;
            return (
              <div
                key={lead.id}
                onClick={() => setExpanded(isOpen ? null : lead.id)}
                style={{
                  background: "#fff",
                  border: `1.5px solid ${lead.is_read ? "#e2e8f0" : "#bfdbfe"}`,
                  borderRadius: "12px",
                  padding: "1rem 1.25rem",
                  cursor: "pointer",
                  transition: "box-shadow 0.15s",
                  boxShadow: isOpen ? "0 4px 20px rgba(0,0,0,0.08)" : "0 1px 4px rgba(0,0,0,0.04)",
                }}
              >
                {/* Row 1 */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                  {/* Unread dot */}
                  {!lead.is_read && (
                    <span style={{ width: 8, height: 8, minWidth: 8, borderRadius: "50%", background: "#0034D8", display: "inline-block" }} />
                  )}

                  {/* Type badge */}
                  <span style={{
                    background: t.bg, color: t.color,
                    border: `1px solid ${t.color}30`,
                    borderRadius: "6px", padding: "0.15rem 0.6rem",
                    fontSize: "0.72rem", fontWeight: 700,
                    whiteSpace: "nowrap",
                  }}>{t.label}</span>

                  {/* Name */}
                  <span style={{ fontWeight: 600, fontSize: "0.9rem", color: "#0f172a" }}>
                    {lead.name || "Без имени"}
                  </span>

                  {/* Phone */}
                  <a
                    href={`tel:${lead.phone.replace(/\D/g, "")}`}
                    onClick={(e) => e.stopPropagation()}
                    style={{ color: "#0034D8", fontSize: "0.9rem", fontWeight: 600, textDecoration: "none" }}
                  >
                    {lead.phone}
                  </a>

                  {/* Spacer */}
                  <span style={{ flex: 1 }} />

                  {/* Date */}
                  <span style={{ fontSize: "0.75rem", color: "#94a3b8", whiteSpace: "nowrap" }}>
                    {fmtDate(lead.created_at)}
                  </span>

                  {/* Actions */}
                  <div style={{ display: "flex", gap: "0.375rem" }} onClick={(e) => e.stopPropagation()}>
                    {!lead.is_read && (
                      <button onClick={(e) => markRead(lead.id, e)} style={S.greenBtn} title="Отметить прочитанным">
                        <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                      </button>
                    )}
                    <button onClick={(e) => del(lead.id, e)} style={S.redBtn} title="Удалить">
                      <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2"/></svg>
                    </button>
                  </div>
                </div>

                {/* Expanded message */}
                {isOpen && lead.message && (
                  <div style={{
                    marginTop: "0.875rem",
                    paddingTop: "0.875rem",
                    borderTop: "1px solid #f1f5f9",
                    fontSize: "0.875rem",
                    color: "#334155",
                    lineHeight: "1.6",
                  }}>
                    {lead.message}
                  </div>
                )}

                {/* Expand hint when no message */}
                {isOpen && !lead.message && (
                  <div style={{ marginTop: "0.75rem", paddingTop: "0.75rem", borderTop: "1px solid #f1f5f9", fontSize: "0.8rem", color: "#cbd5e1" }}>
                    Сообщение не оставлено
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "1.5rem" }}>
          <button disabled={page === 1} onClick={() => setPage((p) => p - 1)} style={S.pageBtn}>
            ← Назад
          </button>
          <div style={{ flex: 1, textAlign: "center", fontSize: "0.8rem", color: "#64748b" }}>
            {page} / {totalPages}
          </div>
          <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} style={S.pageBtn}>
            Вперёд →
          </button>
        </div>
      )}

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

const S: Record<string, React.CSSProperties> = {
  h1: { fontSize: "1.5rem", fontWeight: 700, margin: 0, color: "#0f172a" },
  outlineBtn: {
    display: "flex", alignItems: "center",
    background: "#fff", color: "#0f172a",
    border: "1.5px solid #e2e8f0", borderRadius: "8px",
    padding: "0.5rem 1rem", cursor: "pointer",
    fontSize: "0.8rem", fontWeight: 600,
  },
  greenBtn: {
    display: "flex", alignItems: "center", justifyContent: "center",
    width: 30, height: 30, border: "1.5px solid #bbf7d0",
    background: "#f0fdf4", color: "#16a34a", borderRadius: "7px",
    cursor: "pointer", padding: 0,
  },
  redBtn: {
    display: "flex", alignItems: "center", justifyContent: "center",
    width: 30, height: 30, border: "1.5px solid #fecaca",
    background: "#fef2f2", color: "#dc2626", borderRadius: "7px",
    cursor: "pointer", padding: 0,
  },
  pageBtn: {
    padding: "0.5rem 1.25rem", border: "1.5px solid #e2e8f0",
    borderRadius: "8px", background: "#fff", cursor: "pointer",
    fontSize: "0.8rem", fontWeight: 500, color: "#374151",
  },
};
