"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import type { SettingsMap, Service } from "@/types";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ContactFormSection from "@/components/sections/ContactFormSection";
import ContactsSection from "@/components/sections/ContactsSection";

const Modal = dynamic(() => import("@/components/ui/Modal"), { ssr: false });

// 176×176 art images for each service
const SERVICE_ART: Record<string, string> = {
  "skud": "/upload/uf/747/xl66byexgotvoudx3k5g79shkkovmsn2.svg",
  "pozharnaya-bezopasnost": "/upload/uf/5e2/wjhp3o4i1uydrk4k76ojg5zfs63j7jl5.svg",
  "videonablyudenie": "/upload/uf/800/84vvxdiixu4rf5jfxzlvjxxq91ejb7fk.svg",
  "okhrannaya-signalizatsiya": "/upload/uf/282/nrgiyuxcooh5q96nabzmpwvi7hy7r3vk.svg",
  "kompleksnye-sistemy-bezopasnosti": "/upload/uf/404/4zn7jl9cdpe8b31pc3nezt06tg6zn216.svg",
};

const SERVICE_SUBITEMS: Record<string, { label: string; href: string }[]> = {
  "skud": [
    { label: "Проектирование СКУД", href: "/services/skud/proektirovanie-skud" },
    { label: "Монтаж системы контроля и управления доступом", href: "/services/skud/montazh-skud" },
    { label: "Обслуживание и ремонт СКУД", href: "/services/skud/obsluzhivanie-skud" },
    { label: "Биометрические системы контроля доступа", href: "/services/skud/biometricheskie" },
  ],
  "pozharnaya-bezopasnost": [
    { label: "Проектирование пожарной сигнализации", href: "/services/pozharnaya-bezopasnost/proektirovanie-pozharnyh-sistem" },
    { label: "Монтаж пожарной сигнализации", href: "/services/pozharnaya-bezopasnost/montazh-pozharnyh-sistem" },
    { label: "Обслуживание пожарной сигнализации", href: "/services/pozharnaya-bezopasnost/obsluzhivanie-pozharnyh-sistem" },
    { label: "Пожарная сигнализация", href: "/services/pozharnaya-bezopasnost/pozharnaya-signalizatsiya" },
    { label: "Противопожарная защита", href: "/services/pozharnaya-bezopasnost/protivopozharnaya-zashchita" },
    { label: "Системы оповещения СОУЭ", href: "/services/pozharnaya-bezopasnost/soue" },
    { label: "Проектирование систем оповещения", href: "/services/pozharnaya-bezopasnost/proektirovanie-sistem-opoveshcheniya" },
    { label: "Обслуживание систем оповещения", href: "/services/pozharnaya-bezopasnost/obsluzhivanie-sistem-opoveshcheniya" },
    { label: "Установка систем оповещения", href: "/services/pozharnaya-bezopasnost/ustanovka-sistem-opoveshcheniya" },
  ],
  "videonablyudenie": [
    { label: "Проектирование систем видеонаблюдения", href: "/services/videonablyudenie/proektirovanie-videonablyudeniya" },
    { label: "Монтаж систем видеонаблюдения и СОТ", href: "/services/videonablyudenie/montazh-videonablyudeniya" },
    { label: "Обслуживание систем видеонаблюдения и СОТ", href: "/services/videonablyudenie/obsluzhivanie-videonablyudeniya" },
    { label: "Установка уличного видеонаблюдения", href: "/services/videonablyudenie/ustanovka-ulichnogo-videonablyudeniya" },
    { label: "Установка видеонаблюдения на парковках", href: "/services/videonablyudenie/ustanovka-videonablyudeniya-na-parkovkakh" },
    { label: "Установка системы видеонаблюдения на даче", href: "/services/videonablyudenie/ustanovka-videonablyudeniya-na-dachakh" },
    { label: "Установка видеонаблюдения в ресторанах", href: "/services/videonablyudenie/ustanovka-videonablyudeniya-v-restoranakh" },
    { label: "Установка видеонаблюдения в кафе", href: "/services/videonablyudenie/ustanovka-videonablyudeniya-v-kafe" },
    { label: "Установка видеонаблюдения на автомойках", href: "/services/videonablyudenie/ustanovka-videonablyudeniya-na-avtomoykakh" },
    { label: "Установка видеонаблюдения в школах", href: "/services/videonablyudenie/ustanovka-videonablyudeniya-v-shkolakh" },
    { label: "Установка видеонаблюдения в подъездах", href: "/services/videonablyudenie/ustanovka-videonablyudeniya-v-podezdakh" },
    { label: "Установка видеонаблюдения в лифтах", href: "/services/videonablyudenie/ustanovka-videonablyudeniya-v-liftakh" },
    { label: "Установка видеонаблюдения в детских садах", href: "/services/videonablyudenie/ustanovka-videonablyudeniya-v-detskikh-sadakh" },
    { label: "Установка видеонаблюдения и СОТ в аптеках", href: "/services/videonablyudenie/ustanovka-videonablyudeniya-i-sot-v-aptekakh" },
    { label: "Монтаж систем видеонаблюдения по периметру", href: "/services/videonablyudenie/ustanovka-videonablyudeniya-po-perimetru" },
    { label: "Монтаж систем видеонаблюдения на складе", href: "/services/videonablyudenie/ustanovka-videonablyudeniya-na-sklade" },
    { label: "Установка систем видеонаблюдения в торговых центрах", href: "/services/videonablyudenie/ustanovka-sistem-videonablyudeniya-v-torgovykh-tsentrakh" },
    { label: "Монтаж видеонаблюдения в офисе", href: "/services/videonablyudenie/ustanovka-videonablyudeniya-v-ofise" },
    { label: "Монтаж видеонаблюдения в магазине", href: "/services/videonablyudenie/ustanovka-videonablyudeniya-v-magazine" },
    { label: "Установка видеонаблюдения в квартире", href: "/services/videonablyudenie/ustanovka-videonablyudeniya-v-kvartirakh" },
    { label: "Установка видеонаблюдения в бизнес-центрах", href: "/services/videonablyudenie/ustanovka-videonablyudeniya-v-biznes-tsentrakh" },
    { label: "Аналоговые системы видеонаблюдения", href: "/services/videonablyudenie/analogovye-sistemy-videonablyudeniya" },
    { label: "Цифровые системы видеонаблюдения", href: "/services/videonablyudenie/tsifrovye-sistemy-videonablyudeniya" },
  ],
  "okhrannaya-signalizatsiya": [
    { label: "Проектирование охранной сигнализации", href: "/services/okhrannaya-signalizatsiya/proektirovanie-signalizacii" },
    { label: "Монтаж охранной сигнализации", href: "/services/okhrannaya-signalizatsiya/montazh-signalizacii" },
    { label: "Обслуживание охранной сигнализации", href: "/services/okhrannaya-signalizatsiya/obsluzhivanie-signalizacii" },
    { label: "Беспроводная сигнализация", href: "/services/okhrannaya-signalizatsiya/besprovodnaya-signalizatsiya" },
    { label: "GSM сигнализация", href: "/services/okhrannaya-signalizatsiya/gsm-signalizatsiya" },
  ],
  "kompleksnye-sistemy-bezopasnosti": [
    { label: "Монтаж комплексных систем", href: "/services/kompleksnye-sistemy-bezopasnosti/montazh-ksb" },
    { label: "Проектирование комплексных систем", href: "/services/kompleksnye-sistemy-bezopasnosti/proektirovanie-ksb" },
    { label: "Техническое обслуживание комплексных систем", href: "/services/kompleksnye-sistemy-bezopasnosti/obsluzhivanie-ksb" },
    { label: "Системы охраны периметра", href: "/services/kompleksnye-sistemy-bezopasnosti/sistemy-okhrany-perimetra" },
  ],
};

interface Props {
  settings: SettingsMap;
  services: Service[];
}

export default function ServicesPageClient({ settings, services }: Props) {
  const [modal, setModal] = useState<string | null>(null);

  return (
    <>
      <Header settings={settings} onModal={setModal} />
      <main>
        <section className="section section--dark">
          <div className="wrapper">
            <ul className="breadcrumbs">
              <li className="breadcrumbs__item"><Link className="breadcrumbs__item-link" href="/">Главная</Link></li>
              <li className="breadcrumbs__item current"><span>Наши услуги</span></li>
            </ul>
            <h1 className="page-title-normal">Наши услуги</h1>
            <div style={{ marginTop: "1.5rem" }}>
              <div className="button-anim">
                <span className="button-anim__circle"></span>
                <button className="button button--primary" onClick={() => setModal("order")}>
                  <span>Заказать услугу</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="wrapper">
            <h2 className="mt-increase-desktop">Оказываем полный<br />цикл услуг</h2>
            <div className="services-blocks-list">
              {services.map((service) => {
                const artImage = SERVICE_ART[service.slug];
                const subitems = SERVICE_SUBITEMS[service.slug] || [];
                return (
                  <div key={service.id} className="services-blocks-list__col">
                    <div className="services-block">
                      {artImage && (
                        <img className="services-block__art" src={artImage} alt={service.title} width={176} height={176} />
                      )}
                      <div className="services-block__title">
                        <Link href={`/services/${service.slug}`}>{service.title}</Link>
                      </div>
                      {service.description && (
                        <p className="services-block__desc">{service.description}</p>
                      )}
                      {subitems.length > 0 && (
                        <ul className="list list--2">
                          {subitems.map((item) => (
                            <li key={item.href}><Link href={item.href}>{item.label}</Link></li>
                          ))}
                        </ul>
                      )}
                      <div style={{ marginTop: "1.5rem" }}>
                        <div className="button-anim">
                          <span className="button-anim__circle"></span>
                          <button className="button button--primary" onClick={() => setModal("order")}>
                            <span>Заказать</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
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
