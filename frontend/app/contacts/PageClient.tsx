"use client";
import { useState } from "react";
import Link from "next/link";
import { submitLead } from "@/lib/api";
import type { SettingsMap } from "@/types";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import dynamic from "next/dynamic";

const Modal = dynamic(() => import("@/components/ui/Modal"), { ssr: false });

const COMPANY_INFO = [
  { label: "ИНН",               value: "7707293185" },
  { label: "КПП",               value: "771601001" },
  { label: "ОГРН",              value: "1037739060666" },
  { label: "Дата образования",  value: "1993" },
  { label: "Юридический адрес", value: "127322, г. Москва, Огородный проезд, д. 20, стр. 27, 5 этаж" },
];

/* ── Contact Form ───────────────────────────────────────────────────────── */

function ContactForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [policy, setPolicy] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) { setError("Укажите номер телефона"); return; }
    if (!policy) { setError("Подтвердите согласие с политикой"); return; }
    setSending(true);
    setError("");
    try {
      await submitLead({ name, phone, message, form_type: "contacts" });
      setSent(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Ошибка при отправке");
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div style={{ padding: "2rem 0", textAlign: "center" }}>
        <p style={{ fontSize: "1.25rem", fontWeight: 500 }}>Заявка отправлена!</p>
        <p style={{ marginTop: "0.5rem", opacity: 0.7 }}>Мы свяжемся с вами в ближайшее время.</p>
      </div>
    );
  }

  return (
    <form className="data-form data-form--dark2" onSubmit={handleSubmit}>
      <div className="data-form__row">
        <div className="data-form__col">
          <input
            type="text"
            placeholder="Имя"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="data-form__col">
          <input
            type="tel"
            placeholder="Телефон *"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
      </div>
      <div className="data-form__row data-form__row--1col">
        <div className="data-form__col">
          <textarea
            placeholder="Ваш вопрос"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
      </div>

      {error && (
        <div className="data-form__row data-form__row--1col">
          <div className="data-form__col">
            <div style={{ background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.3)", borderRadius: "6px", padding: "0.5rem 0.75rem", fontSize: "0.85rem", color: "#dc2626" }}>
              {error}
            </div>
          </div>
        </div>
      )}

      <div className="data-form__row data-form__row--1col">
        <div className="data-form__col">
          <div className="data-form__terms">
            <input
              type="checkbox"
              id="policy-contacts"
              checked={policy}
              onChange={(e) => setPolicy(e.target.checked)}
            />
            {" "}Я подтверждаю ознакомление с{" "}
            <Link href="/terms" target="_blank">Политикой обработки персональных данных</Link>
            {" "}и даю{" "}
            <Link href="/terms" target="_blank">Согласие на обработку персональных данных</Link>
            {" "}в порядке и на условиях, указанных в Политике
          </div>
        </div>
      </div>
      <div className="data-form__row data-form__row--1col">
        <div className="data-form__col">
          <button
            type="submit"
            className={`button button--primary w-100${sending ? " state-sending" : ""}`}
          >
            <span>Оставить заявку</span>
          </button>
        </div>
      </div>
    </form>
  );
}

/* ── Page ───────────────────────────────────────────────────────────────── */

export default function PageClient({ settings }: { settings: SettingsMap }) {
  const [modal, setModal] = useState<string | null>(null);

  return (
    <>
      <Header settings={settings} onModal={setModal} />
      <main>

        {/* ── Dark section with tiles + map (original layout) ── */}
        <section className="section section--dark section--top-0 section--contacts">
          <div className="wrapper">
            <ul className="breadcrumbs">
              <li className="breadcrumbs__item">
                <Link className="breadcrumbs__item-link" href="/">Главная</Link>
              </li>
              <li className="breadcrumbs__item current">
                <span>Контакты</span>
              </li>
            </ul>

            <h1>Контакты компании «Сигма-Профи»</h1>

            <div className="grid-cols grid-cols--4">
              {/* Phone */}
              <div className="grid-cols__col">
                <a
                  className="tile tile--dark tile--minh-1 tile--between tile--hover-2"
                  href={settings.phone_href || `tel:${(settings.phone || "").replace(/\D/g, "")}`}
                >
                  <div className="tile__top">
                    <div className="tile__name tile__name--sm">
                      <svg width="24" height="24" fill="none">
                        <use href="/images/sprite.svg?v=32#phone"></use>
                      </svg>
                      Телефон
                    </div>
                  </div>
                  <div className="tile__bottom">
                    <div>{settings.phone || "8 495 128-13-18"}</div>
                  </div>
                </a>
              </div>

              {/* Email */}
              <div className="grid-cols__col">
                <a
                  className="tile tile--dark tile--minh-1 tile--between tile--hover-2"
                  href={`mailto:${settings.email || ""}`}
                >
                  <div className="tile__top">
                    <div className="tile__name tile__name--sm">
                      <svg width="24" height="24" fill="none">
                        <use href="/images/sprite.svg?v=32#mail"></use>
                      </svg>
                      Email
                    </div>
                  </div>
                  <div className="tile__bottom">
                    <div>{settings.email || "info@sigma-profi.org"}</div>
                  </div>
                </a>
              </div>

              {/* Hours */}
              <div className="grid-cols__col">
                <div className="tile tile--dark tile--minh-1 tile--between tile--hover-2">
                  <div className="tile__top">
                    <div className="tile__name tile__name--sm">
                      <svg width="24" height="24" fill="none">
                        <use href="/images/sprite.svg?v=32#time"></use>
                      </svg>
                      Время работы
                    </div>
                  </div>
                  <div className="tile__bottom">
                    <div>{settings.work_hours_weekdays || "Пн–Чт: 9:30–18:00"}</div>
                    {settings.work_hours_friday && (
                      <div>{settings.work_hours_friday}</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="grid-cols__col">
                <div className="tile tile--dark tile--minh-1 tile--between tile--hover-2">
                  <div className="tile__top">
                    <div className="tile__name tile__name--sm">
                      <svg width="24" height="24" fill="none">
                        <use href="/images/sprite.svg?v=32#pin"></use>
                      </svg>
                      Адрес
                    </div>
                  </div>
                  <div className="tile__bottom">
                    <div>{settings.address || "101000, Москва, Большой Златоустинский переулок, дом 7, строение 1"}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Map — full-width, outside wrapper */}
          <div className="map">
            <iframe
              src={`https://yandex.ru/map-widget/v1/?ll=${settings.map_lon || "37.632745"},${settings.map_lat || "55.758651"}&z=16&pt=${settings.map_lon || "37.632745"},${settings.map_lat || "55.758651"},pm2rdm`}
              width="100%"
              height="520"
              style={{ border: 0, display: "block" }}
              allowFullScreen
              loading="lazy"
              title="Карта"
            />
          </div>
        </section>

        {/* ── Реквизиты + Форма (original light2 section) ── */}
        <section className="section section--light2 overflow-clip">
          <div className="section-glare section-glare--2"></div>
          <div className="section-glare section-glare--8"></div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="section-art section-art--1" src="/images/section_art.svg" width={700} height={597} alt="" />
          <div className="wrapper">
            <div className="grid-cols grid-cols--2 grid-cols--tab-1col">

              {/* Реквизиты */}
              <div className="grid-cols__col">
                <div className="mw-1 text-styles">
                  <h2>Реквизиты</h2>
                  <p className="big-text">ООО ЧОП «СИГМА-ПРОФИ»</p>
                  <ul className="list">
                    {COMPANY_INFO.map((item) => (
                      <li key={item.label}>
                        <div className="info-item">
                          <div className="info-item__title">{item.label}</div>
                          <div className="info-item__value">{item.value}</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Обратная связь */}
              <div className="grid-cols__col justify-end-desktop">
                <div className="mw-1">
                  <div className="text-styles">
                    <h2>Обратная связь</h2>
                    <p>Ответим на ваши вопросы, составим смету, подберём оборудование под ваши задачи.</p>
                  </div>
                  <ContactForm />
                </div>
              </div>

            </div>
          </div>
        </section>

      </main>
      <Footer settings={settings} onModal={setModal} />
      <Modal type={modal} onClose={() => setModal(null)} />
    </>
  );
}
