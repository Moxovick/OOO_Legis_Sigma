"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import type { SettingsMap } from "@/types";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ContactFormSection from "@/components/sections/ContactFormSection";
import ContactsSection from "@/components/sections/ContactsSection";

const Modal = dynamic(() => import("@/components/ui/Modal"), { ssr: false });

type PriceRow = [string, string];
type SubSection = { title: string; rows: PriceRow[] };
type PriceCategory = { title: string; sections: SubSection[] };

const PRICES: PriceCategory[] = [
  {
    title: "Системы видеонаблюдения и охранного телевизионного наблюдения",
    sections: [
      {
        title: "Монтаж систем видеонаблюдения и СОТН",
        rows: [
          ["Монтаж внутренней видеокамеры", "от 2500 ₽"],
          ["Монтаж уличной видеокамеры", "от 2800 ₽"],
          ["Монтаж PTZ видеокамеры", "от 3200 ₽"],
          ["Монтаж видеорегистратора", "от 1800 ₽"],
          ["Монтаж сетевого устройства (коммутатор, роутер, точка доступа и т.д.)", "от 1600 ₽"],
          ["Монтаж блока питания", "от 1500 ₽"],
          ["Монтаж кабеля", "от 75 ₽"],
          ["Монтаж гофрированной трубы", "от 60 ₽"],
          ["Монтаж кронштейна", "от 850 ₽"],
          ["Сборка, установка серверного шкафа", "от 2200 ₽"],
        ],
      },
      {
        title: "Проектирование систем видеонаблюдения и СОТН",
        rows: [
          ["Площадь объекта до 100 м²", "от 18000 ₽"],
          ["Площадь объекта 100 – 200 м²", "от 21600 ₽"],
          ["Площадь объекта 200 – 400 м²", "от 96 ₽/м²"],
          ["Площадь объекта 400 – 700 м²", "от 84 ₽/м²"],
          ["Площадь объекта 700 – 1000 м²", "от 78 ₽/м²"],
          ["Площадь объекта 1000 – 2000 м²", "от 72 ₽/м²"],
          ["Площадь объекта 2000 – 3000 м²", "от 66 ₽/м²"],
          ["Площадь объекта 3000 – 5000 м²", "от 60 ₽/м²"],
          ["Площадь объекта от 5000 м²", "от 48 ₽/м²"],
        ],
      },
      {
        title: "Техническое обслуживание систем видеонаблюдения и СОТН",
        rows: [
          ["До 8 камер", "от 400 ₽/камера"],
          ["От 8 до 16 камер", "от 350 ₽/камера"],
          ["От 16 до 32 камер", "от 300 ₽/камера"],
          ["От 32 до 64 камер", "от 250 ₽/камера"],
          ["От 64 до 150 камер", "от 200 ₽/камера"],
        ],
      },
    ],
  },
  {
    title: "Пожарная безопасность",
    sections: [
      {
        title: "Монтаж системы пожарной безопасности",
        rows: [
          ["Монтаж дымового извещателя", "от 650 ₽"],
          ["Монтаж ручного извещателя", "от 650 ₽"],
          ["Монтаж линейного извещателя", "от 1200 ₽"],
          ["Монтаж оповещателя", "от 500 ₽"],
          ["Монтаж речевого оповещателя", "от 650 ₽"],
          ["Монтаж приемно-контрольного прибора", "от 2500 ₽"],
          ["Монтаж клавиатуры", "от 1800 ₽"],
          ["Монтаж модуля расширения", "от 1200 ₽"],
          ["Монтаж блока питания", "от 1500 ₽"],
          ["Монтаж кабеля", "от 75 ₽"],
          ["Монтаж гофрированной трубы", "от 60 ₽"],
        ],
      },
      {
        title: "Проектирование системы пожарной безопасности",
        rows: [
          ["Площадь объекта до 500 м²", "от 39000 ₽"],
          ["Площадь объекта 500 – 1000 м²", "от 52000 ₽"],
          ["Площадь объекта 1000 – 3000 м²", "от 55250 ₽"],
          ["Площадь объекта 3000 – 5000 м²", "от 93275 ₽"],
          ["Площадь объекта от 5000 м²", "от 109200 ₽"],
        ],
      },
      {
        title: "Техническое обслуживание системы пожарной безопасности",
        rows: [
          ["До 10 ед. оборудования", "от 3000 ₽"],
          ["От 10 до 20 ед. оборудования", "от 3500 ₽"],
          ["От 20 до 30 ед. оборудования", "от 4000 ₽"],
          ["От 30 до 50 ед. оборудования", "от 4800 ₽"],
          ["От 50 до 100 ед. оборудования", "от 7500 ₽"],
          ["От 100 до 200 ед. оборудования", "от 9500 ₽"],
        ],
      },
    ],
  },
  {
    title: "Системы контроля и управления доступом (СКУД)",
    sections: [
      {
        title: "Монтаж системы контроля и управления доступом (СКУД)",
        rows: [
          ["Монтаж электромагнитного замка", "от 2800 ₽"],
          ["Монтаж врезного замка", "от 3200 ₽"],
          ["Монтаж считывателя", "от 1600 ₽"],
          ["Монтаж кнопки выход", "от 500 ₽"],
          ["Монтаж контроллера", "от 2500 ₽"],
          ["Монтаж блока питания", "от 1500 ₽"],
          ["Монтаж кабеля", "от 75 ₽"],
          ["Монтаж гофрированной трубы", "от 60 ₽"],
          ["Монтаж доводчика", "от 1950 ₽"],
          ["Установка вызывной панели домофона", "от 2200 ₽"],
          ["Установка домофона", "от 1500 ₽"],
          ["Установка кнопки разблокировки", "от 700 ₽"],
        ],
      },
      {
        title: "Проектирование системы контроля и управления доступом (СКУД)",
        rows: [
          ["от 100 до 500 м² / до 5 точек доступа", "от 7800 ₽"],
          ["от 500 до 1000 м² / до 10 точек доступа", "от 12000 ₽"],
          ["от 1000 м² / более 10 точек доступа", "от 22000 ₽"],
        ],
      },
      {
        title: "Техническое обслуживание системы контроля и управления доступом (СКУД)",
        rows: [
          ["Обслуживание оборудования СКУД", "от 3000 ₽"],
          ["Обслуживание шлагбаума", "от 3000 ₽"],
          ["Обслуживание турникета", "от 3500 ₽"],
          ["Обслуживание домофона", "от 500 ₽"],
        ],
      },
    ],
  },
  {
    title: "Охранная сигнализация",
    sections: [
      {
        title: "Монтаж системы охранной сигнализации",
        rows: [
          ["Монтаж охранного извещателя в помещении", "от 1200 ₽"],
          ["Монтаж охранного извещателя на улице", "от 2200 ₽"],
          ["Монтаж магнитоконтактного извещателя (геркона)", "от 950 ₽"],
          ["Монтаж тревожной кнопки", "от 750 ₽"],
          ["Монтаж оповещателя", "от 1200 ₽"],
          ["Монтаж приемно-контрольного прибора", "от 2500 ₽"],
          ["Монтаж клавиатуры", "от 1800 ₽"],
          ["Монтаж модуля расширения", "от 1200 ₽"],
          ["Монтаж блока питания", "от 1500 ₽"],
          ["Монтаж кабеля", "от 75 ₽"],
          ["Монтаж гофрированной трубы", "от 60 ₽"],
        ],
      },
      {
        title: "Проектирование системы охранной сигнализации",
        rows: [
          ["Площадь объекта до 500 м²", "от 26000 ₽"],
          ["Площадь объекта 500 – 1000 м²", "от 32500 ₽"],
          ["Площадь объекта 1000 – 3000 м²", "от 41080 ₽"],
          ["Площадь объекта 3000 – 5000 м²", "от 51610 ₽"],
          ["Площадь объекта от 5000 м²", "от 80730 ₽"],
        ],
      },
      {
        title: "Техническое обслуживание системы охранной сигнализации",
        rows: [
          ["До 10 ед. оборудования", "от 3000 ₽"],
          ["От 10 до 20 ед. оборудования", "от 3500 ₽"],
          ["От 20 до 30 ед. оборудования", "от 4000 ₽"],
          ["От 30 до 50 ед. оборудования", "от 4800 ₽"],
          ["От 50 до 100 ед. оборудования", "от 7500 ₽"],
          ["От 100 до 200 ед. оборудования", "от 9500 ₽"],
        ],
      },
    ],
  },
];

function SubSpoiler({ title, rows, onModal }: { title: string; rows: PriceRow[]; onModal: (t: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`spoiler spoiler--compact${open ? " is-open" : ""}`}>
      <div className="spoiler__trigger" onClick={() => setOpen((v) => !v)}>{title}</div>
      <div
        className="spoiler__content"
        style={{ maxHeight: open ? "2000px" : "0", overflow: "hidden", transition: "max-height 0.35s ease" }}
      >
        <div className="spoiler__content-inner text-styles">
          <table>
            <thead>
              <tr>
                <th>Наименование работ</th>
                <th className="text-right">Стоимость</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(([name, price], i) => (
                <tr key={i}>
                  <td>{name}</td>
                  <td className="text-right">{price}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="button-anim">
            <span className="button-anim__circle"></span>
            <button className="button button--primary" onClick={() => onModal("order")}>
              <span>Заказать</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function MainSpoiler({ category, onModal }: { category: PriceCategory; onModal: (t: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`spoiler${open ? " is-open" : ""}`}>
      <div className="spoiler__trigger" onClick={() => setOpen((v) => !v)}>{category.title}</div>
      <div
        className="spoiler__content"
        style={{ maxHeight: open ? "6000px" : "0", overflow: "hidden", transition: "max-height 0.4s ease" }}
      >
        <div className="spoiler__content-inner text-styles">
          {category.sections.map((section, i) => (
            <SubSpoiler key={i} title={section.title} rows={section.rows} onModal={onModal} />
          ))}
        </div>
      </div>
    </div>
  );
}

interface Props {
  settings: SettingsMap;
}

export default function PageClient({ settings }: Props) {
  const [modal, setModal] = useState<string | null>(null);

  return (
    <>
      <Header settings={settings} onModal={setModal} />
      <main>
        <section className="section section--top-0 no-overlap">
          <div className="wrapper">
            <ul className="breadcrumbs">
              <li className="breadcrumbs__item"><a className="breadcrumbs__item-link" href="/">Главная</a></li>
              <li className="breadcrumbs__item current"><span>Цены</span></li>
            </ul>
            <h1>Стоимость технических средств охраны: цены на услуги «Легис-Тех»</h1>
            <div className="spacing-y-sm text-styles">
              <p>
                Цены, представленные на сайте, являются ориентировочными и могут быть изменены
                в зависимости от функционала системы, требований Заказчика, типа объекта, и других факторов.
                Для получения индивидуального расчёта позвоните нам или оставьте заявку на сайте.
              </p>
            </div>

            {PRICES.map((cat, i) => (
              <MainSpoiler key={i} category={cat} onModal={setModal} />
            ))}

            {/* Offers slider */}
            <div style={{ marginTop: "3rem", textAlign: "center" }}>
              <div className="button-anim" style={{ display: "inline-flex" }}>
                <span className="button-anim__circle"></span>
                <button className="button button--primary" onClick={() => setModal("consult")}>
                  <span>Получить индивидуальное предложение</span>
                </button>
              </div>
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
