"use client";
import { useEffect, useState, useCallback } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Feature {
  icon: string;
  title: string;
  desc: string;
}

interface ProcessStep {
  step: string;
  title: string;
  desc: string;
}

interface PageData {
  hero_title: string;
  hero_subtitle: string;
  features_title: string;
  features_subtitle: string;
  features: Feature[];
  process_title: string;
  process_subtitle: string;
  process: ProcessStep[];
  capabilities_title: string;
  capabilities: string[];
  cta_title: string;
  cta_subtitle: string;
}

const DEFAULT_DATA: PageData = {
  hero_title: "Доставка документов и частные инкассации",
  hero_subtitle: "Делаем максимально оперативно и безопасно.\nОхрана под каждый заказ.",
  features_title: "Почему выбирают нас",
  features_subtitle: "Более 15 лет на рынке охранных услуг. Собственный лицензированный персонал, специализированный транспорт, страхование грузов.",
  features: [
    { icon: "🛡️", title: "Вооружённая охрана", desc: "Каждый заказ сопровождает вооружённый сотрудник охраны с действующей лицензией. Полная ответственность за груз на весь путь следования." },
    { icon: "⚡", title: "Максимальная оперативность", desc: "Выезд в течение 30–60 минут после заявки. Работаем круглосуточно, в том числе в выходные и праздничные дни." },
    { icon: "📋", title: "Юридическая чистота", desc: "Полный пакет сопроводительных документов, акты приёма-передачи, страхование груза. Работаем с юридическими и физическими лицами." },
    { icon: "🔒", title: "Конфиденциальность", desc: "Строгий регламент неразглашения. Информация о маршрутах, суммах и клиентах не передаётся третьим лицам." },
    { icon: "📍", title: "GPS-контроль", desc: "Все автомобили оснащены системой GPS-мониторинга. Вы можете отслеживать местонахождение курьера в реальном времени." },
    { icon: "💼", title: "Любые суммы и форматы", desc: "Перевозим наличные средства, ценные бумаги, документы, ювелирные изделия. Без ограничения по сумме — для каждого заказа подбирается маршрут и состав группы." },
  ],
  process_title: "Как мы работаем",
  process_subtitle: "Простой и прозрачный процесс от заявки до сдачи груза получателю.",
  process: [
    { step: "01", title: "Заявка", desc: "Оставьте заявку на сайте или позвоните нам. Уточним объём, маршрут и время — рассчитаем стоимость за 5 минут." },
    { step: "02", title: "Подготовка", desc: "Выделяем вооружённого сотрудника, бронированный/специальный автомобиль. Оформляем акт приёма-передачи." },
    { step: "03", title: "Доставка", desc: "Сопроводительный экипаж выезжает к отправителю, получает груз, следует по согласованному маршруту." },
    { step: "04", title: "Сдача", desc: "Передаём груз получателю под подпись. Предоставляем закрывающие документы и отчёт о выполнении." },
  ],
  capabilities_title: "Что мы доставляем",
  capabilities: [
    "Доставка наличных средств юридическим лицам",
    "Перевозка ценных документов и договоров",
    "Инкассация магазинов, ресторанов, аптек",
    "Доставка ювелирных изделий и драгоценностей",
    "Сопровождение при сделках с недвижимостью",
    "Перевозка нотариальных документов",
    "Регулярные маршруты по договору",
    "Работа с физическими лицами",
    "Экстренный выезд 24/7",
  ],
  cta_title: "Нужна инкассация или доставка документов?",
  cta_subtitle: "Оставьте заявку — перезвоним в течение 5 минут и рассчитаем стоимость",
};

// ── Shared style helpers ───────────────────────────────────────────────────────

const card: React.CSSProperties = {
  background: "#fff",
  borderRadius: "12px",
  padding: "1.5rem",
  marginBottom: "1.5rem",
  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
};

const label: React.CSSProperties = {
  display: "block",
  fontSize: "0.78rem",
  fontWeight: 600,
  color: "#64748b",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  marginBottom: "0.4rem",
};

const input: React.CSSProperties = {
  width: "100%",
  padding: "0.6rem 0.75rem",
  border: "1px solid #e2e8f0",
  borderRadius: "8px",
  fontSize: "0.875rem",
  color: "#1e293b",
  boxSizing: "border-box",
  background: "#fff",
};

const textarea: React.CSSProperties = {
  ...input,
  minHeight: "80px",
  resize: "vertical",
  fontFamily: "inherit",
};

const sectionTitle: React.CSSProperties = {
  fontSize: "1rem",
  fontWeight: 700,
  color: "#1e293b",
  marginBottom: "1rem",
  paddingBottom: "0.5rem",
  borderBottom: "1px solid #e2e8f0",
};

const btnSmall: React.CSSProperties = {
  padding: "0.35rem 0.75rem",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "0.78rem",
  fontWeight: 600,
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function AdminDostavka({ token }: { token: string }) {
  const [data, setData] = useState<PageData>(DEFAULT_DATA);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/pages/dostavka-dokumentov")
      .then((r) => r.json())
      .then((res) => {
        if (res.data && res.data !== "{}") {
          try {
            const parsed = JSON.parse(res.data);
            setData({ ...DEFAULT_DATA, ...parsed });
          } catch {}
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const save = useCallback(async () => {
    setSaving(true);
    setSaved(false);
    try {
      const r = await fetch("/api/admin/pages/dostavka-dokumentov", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ data: JSON.stringify(data) }),
      });
      if (r.ok) setSaved(true);
    } finally {
      setSaving(false);
    }
  }, [data, token]);

  const set = <K extends keyof PageData>(key: K, val: PageData[K]) =>
    setData((d) => ({ ...d, [key]: val }));

  // ── Feature helpers ──
  const setFeature = (i: number, field: keyof Feature, val: string) =>
    setData((d) => {
      const f = [...d.features];
      f[i] = { ...f[i], [field]: val };
      return { ...d, features: f };
    });
  const addFeature = () =>
    setData((d) => ({ ...d, features: [...d.features, { icon: "⭐", title: "", desc: "" }] }));
  const removeFeature = (i: number) =>
    setData((d) => ({ ...d, features: d.features.filter((_, idx) => idx !== i) }));

  // ── Process helpers ──
  const setProcess = (i: number, field: keyof ProcessStep, val: string) =>
    setData((d) => {
      const p = [...d.process];
      p[i] = { ...p[i], [field]: val };
      return { ...d, process: p };
    });
  const addProcess = () =>
    setData((d) => ({
      ...d,
      process: [...d.process, { step: String(d.process.length + 1).padStart(2, "0"), title: "", desc: "" }],
    }));
  const removeProcess = (i: number) =>
    setData((d) => ({ ...d, process: d.process.filter((_, idx) => idx !== i) }));

  // ── Capabilities helpers ──
  const setCap = (i: number, val: string) =>
    setData((d) => {
      const c = [...d.capabilities];
      c[i] = val;
      return { ...d, capabilities: c };
    });
  const addCap = () => setData((d) => ({ ...d, capabilities: [...d.capabilities, ""] }));
  const removeCap = (i: number) =>
    setData((d) => ({ ...d, capabilities: d.capabilities.filter((_, idx) => idx !== i) }));

  if (loading) {
    return <div style={{ color: "#64748b", padding: "2rem" }}>Загрузка...</div>;
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#1e293b", margin: 0 }}>
            Страница: Доставка документов
          </h1>
          <p style={{ margin: "0.25rem 0 0", color: "#64748b", fontSize: "0.875rem" }}>
            /services/dostavka-dokumentov
          </p>
        </div>
        <button
          onClick={save}
          disabled={saving}
          style={{
            padding: "0.65rem 1.5rem",
            background: saving ? "#94a3b8" : saved ? "#16a34a" : "#0034D8",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            fontSize: "0.875rem",
            fontWeight: 600,
            cursor: saving ? "not-allowed" : "pointer",
            minWidth: "130px",
          }}
        >
          {saving ? "Сохранение..." : saved ? "✓ Сохранено" : "Сохранить"}
        </button>
      </div>

      {/* ── Hero ── */}
      <div style={card}>
        <div style={sectionTitle}>Главный экран (Hero)</div>
        <div style={{ marginBottom: "1rem" }}>
          <label style={label}>Заголовок H1</label>
          <input
            style={input}
            value={data.hero_title}
            onChange={(e) => set("hero_title", e.target.value)}
          />
        </div>
        <div>
          <label style={label}>Подзаголовок</label>
          <textarea
            style={textarea}
            value={data.hero_subtitle}
            onChange={(e) => set("hero_subtitle", e.target.value)}
          />
        </div>
      </div>

      {/* ── Features ── */}
      <div style={card}>
        <div style={sectionTitle}>Блок «Почему выбирают нас» (синие карточки)</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
          <div>
            <label style={label}>Заголовок раздела</label>
            <input style={input} value={data.features_title} onChange={(e) => set("features_title", e.target.value)} />
          </div>
          <div>
            <label style={label}>Подзаголовок раздела</label>
            <input style={input} value={data.features_subtitle} onChange={(e) => set("features_subtitle", e.target.value)} />
          </div>
        </div>
        {data.features.map((f, i) => (
          <div key={i} style={{ background: "#f8fafc", borderRadius: "8px", padding: "1rem", marginBottom: "0.75rem", position: "relative" }}>
            <div style={{ display: "grid", gridTemplateColumns: "60px 1fr 1fr", gap: "0.75rem", marginBottom: "0.5rem" }}>
              <div>
                <label style={label}>Иконка</label>
                <input style={input} value={f.icon} onChange={(e) => setFeature(i, "icon", e.target.value)} />
              </div>
              <div>
                <label style={label}>Название</label>
                <input style={input} value={f.title} onChange={(e) => setFeature(i, "title", e.target.value)} />
              </div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: "0.5rem" }}>
                <button
                  style={{ ...btnSmall, background: "#fee2e2", color: "#dc2626", marginBottom: "1px" }}
                  onClick={() => removeFeature(i)}
                >
                  Удалить
                </button>
              </div>
            </div>
            <div>
              <label style={label}>Описание</label>
              <textarea style={{ ...textarea, minHeight: "60px" }} value={f.desc} onChange={(e) => setFeature(i, "desc", e.target.value)} />
            </div>
          </div>
        ))}
        <button
          style={{ ...btnSmall, background: "#dbeafe", color: "#1d4ed8", padding: "0.5rem 1rem" }}
          onClick={addFeature}
        >
          + Добавить карточку
        </button>
      </div>

      {/* ── Process ── */}
      <div style={card}>
        <div style={sectionTitle}>Блок «Как мы работаем» (шаги)</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
          <div>
            <label style={label}>Заголовок раздела</label>
            <input style={input} value={data.process_title} onChange={(e) => set("process_title", e.target.value)} />
          </div>
          <div>
            <label style={label}>Подзаголовок раздела</label>
            <input style={input} value={data.process_subtitle} onChange={(e) => set("process_subtitle", e.target.value)} />
          </div>
        </div>
        {data.process.map((p, i) => (
          <div key={i} style={{ background: "#f8fafc", borderRadius: "8px", padding: "1rem", marginBottom: "0.75rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "80px 1fr auto", gap: "0.75rem", marginBottom: "0.5rem" }}>
              <div>
                <label style={label}>Номер</label>
                <input style={input} value={p.step} onChange={(e) => setProcess(i, "step", e.target.value)} />
              </div>
              <div>
                <label style={label}>Название шага</label>
                <input style={input} value={p.title} onChange={(e) => setProcess(i, "title", e.target.value)} />
              </div>
              <div style={{ display: "flex", alignItems: "flex-end" }}>
                <button
                  style={{ ...btnSmall, background: "#fee2e2", color: "#dc2626" }}
                  onClick={() => removeProcess(i)}
                >
                  Удалить
                </button>
              </div>
            </div>
            <div>
              <label style={label}>Описание</label>
              <textarea style={{ ...textarea, minHeight: "60px" }} value={p.desc} onChange={(e) => setProcess(i, "desc", e.target.value)} />
            </div>
          </div>
        ))}
        <button
          style={{ ...btnSmall, background: "#dbeafe", color: "#1d4ed8", padding: "0.5rem 1rem" }}
          onClick={addProcess}
        >
          + Добавить шаг
        </button>
      </div>

      {/* ── Capabilities ── */}
      <div style={card}>
        <div style={sectionTitle}>Блок «Что мы доставляем»</div>
        <div style={{ marginBottom: "1rem" }}>
          <label style={label}>Заголовок раздела</label>
          <input style={input} value={data.capabilities_title} onChange={(e) => set("capabilities_title", e.target.value)} />
        </div>
        {data.capabilities.map((c, i) => (
          <div key={i} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
            <input
              style={{ ...input, flex: 1 }}
              value={c}
              onChange={(e) => setCap(i, e.target.value)}
              placeholder={`Пункт ${i + 1}`}
            />
            <button style={{ ...btnSmall, background: "#fee2e2", color: "#dc2626" }} onClick={() => removeCap(i)}>
              ✕
            </button>
          </div>
        ))}
        <button
          style={{ ...btnSmall, background: "#dbeafe", color: "#1d4ed8", padding: "0.5rem 1rem", marginTop: "0.25rem" }}
          onClick={addCap}
        >
          + Добавить пункт
        </button>
      </div>

      {/* ── CTA ── */}
      <div style={card}>
        <div style={sectionTitle}>CTA-блок (призыв к действию)</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div>
            <label style={label}>Заголовок</label>
            <textarea style={{ ...textarea, minHeight: "60px" }} value={data.cta_title} onChange={(e) => set("cta_title", e.target.value)} />
          </div>
          <div>
            <label style={label}>Подзаголовок</label>
            <textarea style={{ ...textarea, minHeight: "60px" }} value={data.cta_subtitle} onChange={(e) => set("cta_subtitle", e.target.value)} />
          </div>
        </div>
      </div>

      {/* Bottom save */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "0.5rem" }}>
        <button
          onClick={save}
          disabled={saving}
          style={{
            padding: "0.65rem 1.5rem",
            background: saving ? "#94a3b8" : saved ? "#16a34a" : "#0034D8",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            fontSize: "0.875rem",
            fontWeight: 600,
            cursor: saving ? "not-allowed" : "pointer",
            minWidth: "130px",
          }}
        >
          {saving ? "Сохранение..." : saved ? "✓ Сохранено" : "Сохранить"}
        </button>
      </div>
    </div>
  );
}
