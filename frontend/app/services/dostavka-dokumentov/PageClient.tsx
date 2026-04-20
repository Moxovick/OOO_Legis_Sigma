"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import type { SettingsMap } from "@/types";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ContactFormSection from "@/components/sections/ContactFormSection";
import ContactsSection from "@/components/sections/ContactsSection";

const Modal = dynamic(() => import("@/components/ui/Modal"), { ssr: false });

// ── Defaults ──────────────────────────────────────────────────────────────────

const DEFAULT_FEATURES = [
  { icon: "🛡️", title: "Вооружённая охрана", desc: "Каждый заказ сопровождает вооружённый сотрудник охраны с действующей лицензией. Полная ответственность за груз на весь путь следования." },
  { icon: "⚡", title: "Максимальная оперативность", desc: "Выезд в течение 30–60 минут после заявки. Работаем круглосуточно, в том числе в выходные и праздничные дни." },
  { icon: "📋", title: "Юридическая чистота", desc: "Полный пакет сопроводительных документов, акты приёма-передачи, страхование груза. Работаем с юридическими и физическими лицами." },
  { icon: "🔒", title: "Конфиденциальность", desc: "Строгий регламент неразглашения. Информация о маршрутах, суммах и клиентах не передаётся третьим лицам." },
  { icon: "📍", title: "GPS-контроль", desc: "Все автомобили оснащены системой GPS-мониторинга. Вы можете отслеживать местонахождение курьера в реальном времени." },
  { icon: "💼", title: "Любые суммы и форматы", desc: "Перевозим наличные средства, ценные бумаги, документы, ювелирные изделия. Без ограничения по сумме — для каждого заказа подбирается маршрут и состав группы." },
];

const DEFAULT_PROCESS = [
  { step: "01", title: "Заявка", desc: "Оставьте заявку на сайте или позвоните нам. Уточним объём, маршрут и время — рассчитаем стоимость за 5 минут." },
  { step: "02", title: "Подготовка", desc: "Выделяем вооружённого сотрудника, бронированный/специальный автомобиль. Оформляем акт приёма-передачи." },
  { step: "03", title: "Доставка", desc: "Сопроводительный экипаж выезжает к отправителю, получает груз, следует по согласованному маршруту." },
  { step: "04", title: "Сдача", desc: "Передаём груз получателю под подпись. Предоставляем закрывающие документы и отчёт о выполнении." },
];

const DEFAULT_CAPABILITIES = [
  "Доставка наличных средств юридическим лицам",
  "Перевозка ценных документов и договоров",
  "Инкассация магазинов, ресторанов, аптек",
  "Доставка ювелирных изделий и драгоценностей",
  "Сопровождение при сделках с недвижимостью",
  "Перевозка нотариальных документов",
  "Регулярные маршруты по договору",
  "Работа с физическими лицами",
  "Экстренный выезд 24/7",
];

// ── Helper ────────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function g<T>(data: Record<string, unknown>, key: string, fallback: T): T {
  const v = data[key];
  if (v === undefined || v === null || v === "") return fallback;
  return v as T;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function PageClient({
  settings,
  pageData = {},
}: {
  settings: SettingsMap;
  pageData?: Record<string, unknown>;
}) {
  const [modal, setModal] = useState<string | null>(null);

  const hero_title      = g(pageData, "hero_title",      "Доставка документов и частные инкассации");
  const hero_subtitle   = g(pageData, "hero_subtitle",   "Делаем максимально оперативно и безопасно.\nОхрана под каждый заказ.");
  const features_title  = g(pageData, "features_title",  "Почему выбирают нас");
  const features_subtitle = g(pageData, "features_subtitle", "Более 15 лет на рынке охранных услуг. Собственный лицензированный персонал, специализированный транспорт, страхование грузов.");
  const features        = g(pageData, "features",        DEFAULT_FEATURES) as typeof DEFAULT_FEATURES;
  const process_title   = g(pageData, "process_title",   "Как мы работаем");
  const process_subtitle = g(pageData, "process_subtitle", "Простой и прозрачный процесс от заявки до сдачи груза получателю.");
  const process         = g(pageData, "process",         DEFAULT_PROCESS)  as typeof DEFAULT_PROCESS;
  const capabilities_title = g(pageData, "capabilities_title", "Что мы доставляем");
  const capabilities    = g(pageData, "capabilities",    DEFAULT_CAPABILITIES) as string[];
  const cta_title       = g(pageData, "cta_title",       "Нужна инкассация или доставка документов?");
  const cta_subtitle    = g(pageData, "cta_subtitle",    "Оставьте заявку — перезвоним в течение 5 минут и рассчитаем стоимость");

  return (
    <>
      <Header settings={settings} onModal={setModal} />
      <main>

        {/* ── Hero ── */}
        <section className="section section--dark section--top-0 dostavka-hero">
          {/* Background image */}
          <div
            className="dostavka-hero__bg"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1920&q=80')" }}
          />
          {/* Gradient overlay */}
          <div className="dostavka-hero__overlay" />

          <div className="wrapper dostavka-hero__content">
            <ul className="breadcrumbs">
              <li className="breadcrumbs__item">
                <Link className="breadcrumbs__item-link" href="/">Главная</Link>
              </li>
              <li className="breadcrumbs__item">
                <Link className="breadcrumbs__item-link" href="/services">Услуги</Link>
              </li>
            </ul>

            <h1 className="dostavka-hero__title">
              {hero_title}
            </h1>
            <p className="dostavka-hero__sub">
              {hero_subtitle.split("\n").map((line, i) => (
                <span key={i}>{i > 0 && <br />}{i === 1 ? <strong style={{ color: "#fff" }}>{line}</strong> : line}</span>
              ))}
            </p>
            <div className="button-anim dostavka-hero__cta">
              <span className="button-anim__circle"></span>
              <button className="button button--primary" onClick={() => setModal("order")}>
                <span>Оставить заявку</span>
              </button>
            </div>
          </div>
        </section>

        {/* ── Почему выбирают нас ── */}
        <section className="section overflow-hidden">
          <div className="wrapper">
            <h2>{features_title}</h2>
            <p className="dostavka-section-sub" style={{ color: "var(--colorTextMuted)" }}>
              {features_subtitle}
            </p>
            <div className="grid-cols grid-cols--3 grid-cols--tab-2col">
              {features.map((f) => (
                <div key={f.title} className="grid-cols__col">
                  <div className="tile tile--dark tile--hover h-100 dostavka-feature-tile">
                    <div className="dostavka-feature-tile__icon">{f.icon}</div>
                    <div className="tile__bottom">
                      <div className="dostavka-feature-tile__name">{f.title}</div>
                      <div className="dostavka-feature-tile__desc">{f.desc}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Как мы работаем ── */}
        <section className="section section--dark overflow-hidden">
          <div className="wrapper">
            <h2>{process_title}</h2>
            <p className="dostavka-section-sub" style={{ color: "rgba(255,255,255,0.6)" }}>
              {process_subtitle}
            </p>
            <div className="grid-cols grid-cols--4">
              {process.map((p) => (
                <div key={p.step} className="grid-cols__col">
                  <div className="dostavka-step">
                    <div className="dostavka-step__num">{p.step}</div>
                    <div className="dostavka-step__title">{p.title}</div>
                    <div className="dostavka-step__desc">{p.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Что мы доставляем ── */}
        <section className="section overflow-hidden">
          <div className="wrapper">
            <h2>{capabilities_title}</h2>
            <div className="grid-cols grid-cols--3 grid-cols--tab-2col dostavka-caps-grid">
              {capabilities.map((item) => (
                <div key={item} className="grid-cols__col">
                  <div className="tile tile--hover h-100 dostavka-cap-tile">
                    <div className="tile__bottom">
                      <div className="tile__title2 dostavka-cap-tile__text">{item}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="section section--dark overflow-hidden">
          <div className="section-glare section-glare--1"></div>
          <div className="wrapper dostavka-cta">
            <h2 className="dostavka-cta__title">{cta_title}</h2>
            <p className="dostavka-cta__sub">{cta_subtitle}</p>
            <div className="button-anim">
              <span className="button-anim__circle"></span>
              <button className="button button--primary" onClick={() => setModal("order")}>
                <span>Получить расчёт</span>
              </button>
            </div>
          </div>
        </section>

        <ContactFormSection />
        <ContactsSection settings={settings} />
      </main>
      <Footer settings={settings} onModal={setModal} />
      <Modal type={modal} onClose={() => setModal(null)} />
    </>
  );
}
