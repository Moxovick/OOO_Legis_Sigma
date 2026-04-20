"use client";
import { useEffect, useState } from "react";
import { submitLead } from "@/lib/api";

const TITLES: Record<string, string> = {
  order: "Заказать услугу",
  call: "Обратный звонок",
  consult: "Бесплатная консультация",
  contract: "Заключить договор",
};

interface Props {
  type: string | null;
  onClose: () => void;
}

export default function Modal({ type, onClose }: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [policy, setPolicy] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    if (!type) {
      setAnimated(false);
      return;
    }
    setSent(false);
    setError("");
    setName("");
    setPhone("");
    setMessage("");
    setPolicy(false);
    const id = requestAnimationFrame(() => setAnimated(true));
    return () => cancelAnimationFrame(id);
  }, [type]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  useEffect(() => {
    if (type) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [type]);

  if (!type) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) { setError("Укажите номер телефона"); return; }
    if (!policy) { setError("Подтвердите согласие на обработку данных"); return; }
    setSending(true);
    setError("");
    try {
      await submitLead({ name, phone, message, form_type: type });
      setSent(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Ошибка отправки");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className={`modal-window modal-window--sm-width is-active${animated ? " is-animated" : ""}`}>
      <div className="modal-window__window-overlay" onClick={onClose}></div>
      <div className="modal-window__window-holder">
        <div className="modal-window__window">
          <button className="modal-window__close" type="button" onClick={onClose}>
            <svg className="modal-window__close-icon" width="42" height="42">
              <use href="/images/sprite-1.svg?v=21#close"></use>
            </svg>
          </button>
          <div className="modal-window__title">{TITLES[type] ?? "Заявка"}</div>

          {sent ? (
            <div style={{ padding: "2rem 0", textAlign: "center", color: "var(--colorMain)" }}>
              <p style={{ fontSize: "1.25rem", fontWeight: 500 }}>Заявка отправлена!</p>
              <p style={{ marginTop: "0.5rem", opacity: 0.7 }}>Мы свяжемся с вами в ближайшее время.</p>
            </div>
          ) : (
            <form className="data-form data-form--dark" onSubmit={handleSubmit}>
              <div className="data-form__row data-form__row--1col">
                <div className="data-form__col">
                  <div className="data-form__fields">
                    <input type="text" placeholder="Имя" value={name} onChange={(e) => setName(e.target.value)} />
                    <input type="tel" placeholder="Телефон *" value={phone} onChange={(e) => setPhone(e.target.value)} />
                  </div>
                </div>
              </div>
              <div className="data-form__row data-form__row--1col">
                <div className="data-form__col">
                  <div className="data-form__fields">
                    <textarea placeholder="Ваш комментарий" value={message} onChange={(e) => setMessage(e.target.value)} />
                  </div>
                </div>
              </div>
              {error && (
                <div style={{
                  background: "rgba(220,38,38,0.12)",
                  border: "1px solid rgba(220,38,38,0.35)",
                  borderRadius: "8px",
                  padding: "0.6rem 0.875rem",
                  marginBottom: "0.5rem",
                  fontSize: "0.85rem",
                  color: "#ff6b6b",
                  fontFamily: "'NTSomic', -apple-system, BlinkMacSystemFont, sans-serif",
                  fontWeight: 500,
                }}>
                  {error}
                </div>
              )}
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
              <div className="data-form__row data-form__row--1col">
                <div className="data-form__col">
                  <div className="data-form__terms text-center">
                    <input type="checkbox" checked={policy} onChange={(e) => setPolicy(e.target.checked)} />
                    {" "}Я подтверждаю ознакомление с{" "}
                    <a href="/terms" target="_blank">Политикой обработки персональных данных</a>
                    {" "}и даю{" "}
                    <a href="/terms" target="_blank">Согласие на обработку персональных данных</a>
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
