"use client";
import { useState } from "react";
import Link from "next/link";
import type { SettingsMap, Service } from "@/types";

const SERVICES: { href: string; label: string }[] = [
  { href: "/services/dostavka-dokumentov", label: "Доставка документов и частные инкассации" },
  { href: "/services/skud", label: "Системы контроля и управления доступом" },
  { href: "/services/videonablyudenie", label: "Видеонаблюдение" },
  { href: "/services/okhrannaya-signalizatsiya", label: "Охранная сигнализация" },
  { href: "/services/kompleksnye-sistemy-bezopasnosti", label: "Комплексные системы безопасности" },
];

interface Props {
  settings: SettingsMap;
  onModal: (type: string) => void;
}

export default function Header({ settings, onModal }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [megaReady, setMegaReady] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  return (
    <>
      <header className="header animated" style={megaOpen ? { overflow: "visible", height: "auto", zIndex: 1000 } : {}}>
        <div className="header__inner">
          <div className="header__top">
            <div className="header__top-left">
              <Link className="logo" href="/">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="logo__image" src="/images/logo.png" width={182} height={170} alt='ООО ЧОП "Сигма-Профи"' />
              </Link>
              <nav className="top-nav tab-hide">
                <Link className="top-nav__link" href="/about"><span>О компании</span></Link>
                <Link className="top-nav__link" href="/contacts"><span>Контакты</span></Link>
                <Link className="top-nav__link" href="/prices"><span>Цены</span></Link>
              </nav>
            </div>
            <div className="header__top-right">
              <div className="header-item tab-hide">
                {settings.work_hours_weekdays}. {settings.work_hours_friday}
              </div>
              <div className="header-contacts">
                <a className="header-item" href={settings.phone_href}>{settings.phone}</a>
                <a className="header-item" href={`mailto:${settings.email}`}>{settings.email}</a>
              </div>
              <div className="button-anim tab-hide">
                <span className="button-anim__circle"></span>
                <button className="button button--primary" onClick={() => onModal("call")}>
                  <span>Обратный звонок</span>
                </button>
              </div>
              <button
                className="icon-button icon-button--dark desktop-hide"
                onClick={() => setMobileOpen(true)}
                aria-label="Меню"
              >
                <svg width="24" height="24">
                  <use href="/images/sprite.svg?v=32#hamburger"></use>
                </svg>
              </button>
            </div>
          </div>

          <div className="header__bottom tab-hide">
            <div className="header__bottom-left">
              <button
                className={`js-mega-navigation-trigger navigation-trigger${megaOpen ? " is-active" : ""}`}
                type="button"
                onClick={() => {
                  const next = !megaOpen;
                  setMegaOpen(next);
                  if (next) {
                    setMegaReady(false);
                    requestAnimationFrame(() => setMegaReady(true));
                  } else {
                    setMegaReady(false);
                  }
                }}
              >
                <div className="navigation-trigger__icon"><span></span></div>
                Все услуги
              </button>
            </div>
            <div className="header__bottom-right">
              <nav className="nav nav--line">
                {SERVICES.map((s) => (
                  <Link key={s.href} className="nav__link" href={s.href} data-hover-text={s.label}>
                    <span>{s.label}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* Mega nav */}
        {megaOpen && (
          <>
            {/* Overlay — behind mega nav */}
            <div style={{ position: "fixed", inset: 0, zIndex: 9 }} onClick={() => { setMegaOpen(false); setMegaReady(false); }} />
            <div className={`js-mega-navigation mega-nav${megaReady ? " anim-ready" : ""}`} style={{ display: "flex", position: "relative", zIndex: 10 }}>
              <div className="mega-nav__glare1"></div>
              <div className="mega-nav__glare2"></div>
              <div className="mega-nav__left">
                <div className="mega-nav__col">
                  <nav className="mega-nav__menu">
                    <Link href="/about" onClick={() => { setMegaOpen(false); setMegaReady(false); }}>О компании</Link>
                    <Link href="/contacts" onClick={() => { setMegaOpen(false); setMegaReady(false); }}>Контакты</Link>
                    <Link href="/prices" onClick={() => { setMegaOpen(false); setMegaReady(false); }}>Цены</Link>
                  </nav>
                </div>
                <div className="mega-nav__col">
                  <nav className="mega-nav__menu">
                    {SERVICES.map((s) => (
                      <Link key={s.href} href={s.href} onClick={() => { setMegaOpen(false); setMegaReady(false); }}>{s.label}</Link>
                    ))}
                    <Link href="/services" onClick={() => { setMegaOpen(false); setMegaReady(false); }}>Все услуги</Link>
                  </nav>
                  <div className="button-anim">
                    <span className="button-anim__circle"></span>
                    <button className="button button--primary" onClick={() => { setMegaOpen(false); setMegaReady(false); onModal("order"); }}>
                      <span>Заказать услугу</span>
                    </button>
                  </div>
                </div>
              </div>
              <div className="mega-nav__right">
                <div className="contact-item">
                  <div className="contact-item__title">Контактный центр</div>
                  <a href={settings.phone_href}>{settings.phone}</a>
                </div>
                <div className="contact-item">
                  <div className="contact-item__title">Email для запросов</div>
                  <a className="text-primary" href={`mailto:${settings.email}`}>{settings.email}</a>
                </div>
                <div className="contact-item contact-item--addr">
                  <div className="contact-item__title">Центральный офис</div>
                  {settings.address}
                </div>
              </div>
            </div>
          </>
        )}
      </header>

      {/* Mobile sidebar */}
      <div className={`mobile-sidebar${mobileOpen ? " is-active" : ""}`}>
        <button className="mobile-sidebar__close" type="button" onClick={() => setMobileOpen(false)}>
          <svg className="mobile-sidebar__close-icon" width="42" height="42">
            <use href="/images/sprite-1.svg?v=21#close"></use>
          </svg>
        </button>
        <div className="mobile-sidebar__row pb-0">
          <div className={`nav-spoiler${servicesOpen ? " is-open" : ""}`}>
            <button className="nav-spoiler__trigger" onClick={() => setServicesOpen((v) => !v)}>
              Услуги
            </button>
            <div className="nav-spoiler__content" style={{ maxHeight: servicesOpen ? "500px" : "0", overflow: "hidden", transition: "max-height 0.3s ease" }}>
              <div className="nav-spoiler__content-inner">
                <nav className="top-nav">
                  {SERVICES.map((s) => (
                    <Link key={s.href} className="top-nav__link" href={s.href} onClick={() => setMobileOpen(false)}>
                      <span>{s.label}</span>
                    </Link>
                  ))}
                  <Link className="top-nav__link" href="/services" onClick={() => setMobileOpen(false)}>
                    <span>Все услуги</span>
                  </Link>
                </nav>
              </div>
            </div>
          </div>
        </div>
        <div className="mobile-sidebar__row">
          <nav className="top-nav">
            <Link className="top-nav__link" href="/about" onClick={() => setMobileOpen(false)}><span>О компании</span></Link>
            <Link className="top-nav__link" href="/contacts" onClick={() => setMobileOpen(false)}><span>Контакты</span></Link>
            <Link className="top-nav__link" href="/prices" onClick={() => setMobileOpen(false)}><span>Цены</span></Link>
          </nav>
        </div>
        <div className="mobile-sidebar__row">
          <button className="button button--primary" onClick={() => { setMobileOpen(false); onModal("order"); }}>
            <span>Заказать услугу</span>
          </button>
        </div>
        <div className="mobile-sidebar__row">
          <a className="header-item" href={settings.phone_href}>{settings.phone}</a>
        </div>
      </div>
    </>
  );
}
