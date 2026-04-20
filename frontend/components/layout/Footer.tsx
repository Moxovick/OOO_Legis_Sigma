import Link from "next/link";
import type { SettingsMap } from "@/types";

const SERVICES = [
  { href: "/services/skud", label: "СКУД" },
  { href: "/services/videonablyudenie", label: "Видеонаблюдение" },
  { href: "/services/pozharnaya-bezopasnost", label: "Пожарная безопасность" },
  { href: "/services/okhrannaya-signalizatsiya", label: "Охранная сигнализация" },
  { href: "/services/kompleksnye-sistemy-bezopasnosti", label: "Комплексные системы безопасности" },
];

interface Props {
  settings: SettingsMap;
  onModal: (type: string) => void;
}

export default function Footer({ settings, onModal }: Props) {
  const year = new Date().getFullYear();

  return (
    <footer className="section section--dark section--footer">
      <div className="section-glare section-glare--3 section-glare--anim-to-r"></div>
      <div className="section-glare section-glare--4 section-glare--anim-to-l"></div>
      <div className="wrapper">
        <div className="footer-row">
          <div className="footer-col mob-hide">
            <nav className="nav">
              <Link className="nav__link" href="/about"><span>О компании</span></Link>
              <Link className="nav__link" href="/contacts"><span>Контакты</span></Link>
              <Link className="nav__link" href="/prices"><span>Цены</span></Link>
            </nav>
          </div>
          <div className="footer-col mob-hide">
            <nav className="nav">
              {SERVICES.map((s) => (
                <Link key={s.href} className="nav__link" href={s.href}><span>{s.label}</span></Link>
              ))}
              <Link className="nav__link" href="/services"><span>Все услуги</span></Link>
            </nav>
          </div>
          <div className="footer-col">
            <div className="button-anim">
              <span className="button-anim__circle"></span>
              <button className="button button--primary" onClick={() => onModal("order")}>
                <span>Заказать услугу</span>
              </button>
            </div>
            <div className="contact-item">
              <div className="contact-item__title">Контактный центр</div>
              <a href={settings.phone_href}><span>{settings.phone}</span></a>
            </div>
            <div className="contact-item">
              <div className="contact-item__title">Email для запросов</div>
              <a href={`mailto:${settings.email}`}><span>{settings.email}</span></a>
            </div>
            <div className="contact-item contact-item--addr">
              <div className="contact-item__title">Центральный офис</div>
              {settings.address}
            </div>
          </div>
        </div>
        <div className="footer-row">
          <div className="footer-col text-muted">
            © {settings.copyright_year}–{year} {settings.company_name}
          </div>
          <div className="footer-col flex-column-tab">
            <Link className="footer-link" href="/terms"><span>Политика конфиденциальности</span></Link>
          </div>
          <div className="footer-col"></div>
        </div>
      </div>
    </footer>
  );
}
