"use client";
import { useState } from "react";
import Link from "next/link";
import type { Service } from "@/types";

const TABS = [
  { key: "design", label: "Проектирование" },
  { key: "install", label: "Монтаж" },
  { key: "maintain", label: "Обслуживание" },
];

// Tile images per tab per service slug (from original site)
const TAB_IMAGES: Record<string, Record<string, string>> = {
  design: {
    "skud": "/upload/iblock/ffd/n2353c5x3f152ak9t8lou9j03iou979u.webp",
    "videonablyudenie": "/upload/iblock/999/1ec3023zi657bhznp6c062gs6j90m6ls.png",
    "pozharnaya-bezopasnost": "/upload/iblock/036/f6lp4ci2biaa1ee5ndvh95nq250v3kc3.png",
    "okhrannaya-signalizatsiya": "/upload/iblock/357/wh36vqs16t16ccd1shovx0l54avyexen.webp",
    "kompleksnye-sistemy-bezopasnosti": "/upload/iblock/fe2/b2qb63y9blr88ivdbrggsfaswyd2tfzf.png",
  },
  install: {
    "skud": "/upload/iblock/aa9/gt3t62sflwm3fcucj1tglx8dm5i2kztj.png",
    "videonablyudenie": "/upload/iblock/ed3/aju6mf5um41jd4t2oxrirl3i2dae8kej.webp",
    "pozharnaya-bezopasnost": "/upload/iblock/7b3/iixa73dxhstz7mmxncowp76nuzpvr5yp.webp",
    "okhrannaya-signalizatsiya": "/upload/iblock/dea/wspuetvl8i9o1pv6zs0t4hr4o0i40zqm.png",
    "kompleksnye-sistemy-bezopasnosti": "/upload/iblock/fe2/b2qb63y9blr88ivdbrggsfaswyd2tfzf.png",
  },
  maintain: {
    "skud": "/upload/iblock/aa9/gt3t62sflwm3fcucj1tglx8dm5i2kztj.png",
    "videonablyudenie": "/upload/iblock/999/1ec3023zi657bhznp6c062gs6j90m6ls.png",
    "pozharnaya-bezopasnost": "/upload/iblock/036/f6lp4ci2biaa1ee5ndvh95nq250v3kc3.png",
    "okhrannaya-signalizatsiya": "/upload/iblock/dea/wspuetvl8i9o1pv6zs0t4hr4o0i40zqm.png",
    "kompleksnye-sistemy-bezopasnosti": "/upload/iblock/fe2/b2qb63y9blr88ivdbrggsfaswyd2tfzf.png",
  },
};

interface Props {
  services: Service[];
  onModal: (type: string) => void;
}

function ServicePane({ services, tabKey, onModal }: { services: Service[]; tabKey: string; onModal: (type: string) => void }) {
  const images = TAB_IMAGES[tabKey] || {};
  return (
    <div className="grid-cols grid-cols--3 grid-cols--tab-2col">
      {services.map((service) => (
        <div key={service.id} className="grid-cols__col">
          <Link className="tile tile--hover h-100" href={`/services/${service.slug}`}>
            {service.icon_url && (
              <div className="tile__icon-holder">
                <img src={service.icon_url} alt={service.title} />
              </div>
            )}
            <div className="tile__name">{service.title}</div>
            {images[service.slug] && (
              <img
                className="tile__image"
                src={images[service.slug]}
                width={120}
                height={160}
                alt={service.title}
              />
            )}
          </Link>
        </div>
      ))}
      <div className="grid-cols__col">
        <div className="cta-small h-100">
          <div className="cta-small__top">
            <div className="cta-small__title">Не нашли подходящую услугу?</div>
            <div className="cta-small__desc">Для индивидуального заказа воспользуйтесь бесплатной консультацией!</div>
          </div>
          <div className="button-anim button-anim--hover-light">
            <span className="button-anim__circle"></span>
            <button className="button button--primary" onClick={() => onModal("consult")}>
              <span>Бесплатная консультация</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ServicesSection({ services, onModal }: Props) {
  const [activeTab, setActiveTab] = useState("install");

  return (
    <section className="section overflow-hidden">
      <div className="section-glare section-glare--11 tab-hide"></div>
      <div className="section-glare section-glare--12 tab-hide"></div>
      <div className="wrapper">
        <h2>Оказываем полный<br />цикл услуг</h2>

        <div className="tabs-nav">
          {TABS.map((tab) => (
            <div
              key={tab.key}
              className={`tabs-nav__btn${activeTab === tab.key ? " is-active" : ""}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </div>
          ))}
        </div>

        {TABS.map((tab) => (
          <div
            key={tab.key}
            className={`tab-pane${activeTab === tab.key ? " is-active is-animated" : ""}`}
          >
            <ServicePane services={services} tabKey={tab.key} onModal={onModal} />
          </div>
        ))}
      </div>
    </section>
  );
}
