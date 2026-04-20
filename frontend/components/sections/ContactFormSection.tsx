"use client";
import { useState } from "react";
import Link from "next/link";
import { submitLead } from "@/lib/api";

export default function ContactFormSection() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [policy, setPolicy] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!policy) { setError("Подтвердите согласие"); return; }
    setSending(true);
    setError("");
    try {
      await submitLead({ name, phone, message, form_type: "main" });
      setSent(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Ошибка");
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="section section--light section--form">
      <div className="section-borders">
        <div className="section-borders__inner"></div>
      </div>
      <div className="wrapper">
        <div className="grid-cols grid-cols--2 grid-cols--tab-1col">
          <div className="grid-cols__col text-styles">
            <h2>Свяжитесь<br />с нами</h2>
            <p>
              Остались вопросы? Интересует стоимость? Хотите заказать услугу?<br />
              Оставьте контактные данные и мы свяжемся с вами в ближайшее время.
            </p>
          </div>
          <div className="grid-cols__col">
            {sent ? (
              <div style={{ padding: "2rem 0" }}>
                <p style={{ fontSize: "1.25rem", fontWeight: 500, color: "var(--colorMain)" }}>Заявка отправлена!</p>
                <p style={{ marginTop: "0.5rem", opacity: 0.7 }}>Мы свяжемся с вами в ближайшее время.</p>
              </div>
            ) : (
              <form className="data-form data-form--dark" onSubmit={handleSubmit}>
                <div className="data-form__row">
                  <div className="data-form__col">
                    <div className="data-form__fields">
                      <input type="text" placeholder="Имя" value={name} onChange={(e) => setName(e.target.value)} />
                      <input type="tel" placeholder="Телефон *" required value={phone} onChange={(e) => setPhone(e.target.value)} />
                    </div>
                  </div>
                  <div className="data-form__col">
                    <div className="data-form__fields h-100">
                      <textarea className="h-100" placeholder="Ваш вопрос" value={message} onChange={(e) => setMessage(e.target.value)} />
                    </div>
                  </div>
                </div>
                {error && <p style={{ color: "#e55", fontSize: "0.875rem" }}>{error}</p>}
                <div className="data-form__row data-form__row--1col">
                  <div className="data-form__col">
                    <div className="data-form__terms text-center">
                      <input type="checkbox" checked={policy} onChange={(e) => setPolicy(e.target.checked)} required />
                      {" "}Я подтверждаю ознакомление с{" "}
                      <Link href="/terms" target="_blank">Политикой обработки персональных данных</Link>
                      {" "}и даю{" "}
                      <Link href="/terms" target="_blank">Согласие на обработку персональных данных</Link>
                    </div>
                  </div>
                </div>
                <div className="data-form__row data-form__row--1col">
                  <div className="data-form__col">
                    <div className="button-anim button-anim--hover-light">
                      <span className="button-anim__circle"></span>
                      <button className={`button button--primary${sending ? " state-sending" : ""}`} type="submit">
                        <span>Оставить заявку</span>
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
