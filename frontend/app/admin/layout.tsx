import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Панель управления — Сигма-Профи",
  robots: "noindex, nofollow",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#f5f6fa",
      fontFamily: "'NTSomic', -apple-system, BlinkMacSystemFont, sans-serif",
    }}>
      {/* Reset site-wide body padding-top (added for the sticky site header) */}
      <style>{`
        body { padding-top: 0 !important; }
        body, input, textarea, button, select {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
          font-size: 14px;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
      `}</style>
      {children}
    </div>
  );
}
