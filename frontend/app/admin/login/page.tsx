"use client";
import { useState } from "react";
import { adminLogin } from "@/lib/api";
import { saveTokens } from "@/lib/adminAuth";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await adminLogin(email, password);
      saveTokens(data.access_token, data.refresh_token);
      window.location.replace("/admin");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Неверный email или пароль");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
    }}>
      <div style={{
        background: "#fff",
        borderRadius: "16px",
        padding: "2.5rem",
        width: "100%",
        maxWidth: "400px",
        boxShadow: "0 24px 64px rgba(0,0,0,0.35)",
      }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <img src="/images/logo.svg" alt="Легис-Тех" style={{ height: "36px" }} />
          <p style={{ marginTop: "0.75rem", color: "#94a3b8", fontSize: "0.85rem", margin: "0.75rem 0 0" }}>
            Панель управления
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label style={lbl}>Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inp}
              placeholder="admin@legis-teh.com"
              autoComplete="email"
            />
          </div>
          <div>
            <label style={lbl}>Пароль</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inp}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", padding: "0.75rem 1rem", fontSize: "0.85rem", color: "#dc2626" }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              background: loading ? "#94a3b8" : "#0034D8",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              padding: "0.875rem",
              fontWeight: 700,
              fontSize: "0.95rem",
              cursor: loading ? "not-allowed" : "pointer",
              marginTop: "0.25rem",
              letterSpacing: "0.01em",
              transition: "background 0.2s",
            }}
          >
            {loading ? "Вход..." : "Войти"}
          </button>
        </form>
      </div>
    </div>
  );
}

const lbl: React.CSSProperties = { display: "block", fontSize: "0.8rem", fontWeight: 600, marginBottom: "0.4rem", color: "#475569" };
const inp: React.CSSProperties = {
  width: "100%", padding: "0.7rem 0.875rem",
  border: "1.5px solid #e2e8f0", borderRadius: "8px",
  fontSize: "0.95rem", outline: "none", boxSizing: "border-box",
  background: "#f8fafc", color: "#0f172a",
};
