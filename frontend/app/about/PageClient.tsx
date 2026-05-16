"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import type { SettingsMap, Stat, Partner, Service } from "@/types";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ServicesSection from "@/components/sections/ServicesSection";
import ContactFormSection from "@/components/sections/ContactFormSection";
import ContactsSection from "@/components/sections/ContactsSection";

const Modal = dynamic(() => import("@/components/ui/Modal"), { ssr: false });

const WHY_ITEMS = [
  {
    title: "Опыт",
    desc: "Завоёвываем признание клиентов с 1993 года. Накопленные за годы работы решения позволяют организовать защиту самого высокого уровня на объектах любой сложности.",
    icon: "/upload/iblock/414/o0n2vap51h0qchnzu5r13c75lw57vzzi.svg",
    image: "/upload/iblock/6f1/abmpx37jf947bwzc9la2gh5w01j3gyx2.webp",
  },
  {
    title: "Индивидуальный подход",
    desc: "Мы не используем шаблонные схемы. Разрабатываем комплекс технических средств защиты, отвечающий требованиям безопасности вашего предприятия.",
    icon: "/upload/iblock/86b/iw2qprus3jghrl2jt7yboqdt5dre8u3c.svg",
    image: "/upload/iblock/494/a7s7r4f6zlmh9ptuhkried43rjo12kz0.webp",
  },
  {
    title: "Широкий спектр услуг",
    desc: "Мы предлагаем разнообразные и современные решения по оснащению объектов: видеонаблюдение, СКУД, системы охранной и пожарной сигнализации и многие другие.",
    icon: "/upload/iblock/132/9cdc00wk521ozikvmiaop43f40mpaqaf.svg",
    image: "/upload/iblock/5ec/uwg6jf1x2ioz7gslfzgtnej9fr7yq6kz.webp",
  },
  {
    title: "Комплексный подход",
    desc: "В рамках любого вида услуг мы готовы предоставить комплексные решения, обеспечить проектирование, монтаж и обслуживание систем «под ключ», без посредников.",
    icon: "/upload/iblock/df0/mnpdhjnssb6z54iifqnzeuoz5eaqyjzp.svg",
    image: "/upload/iblock/886/0ymwzb2n6z1uwqi332cz32pedclnbmsg.webp",
  },
  {
    title: "Команда профессионалов",
    desc: "Клиентский сервис, современное оборудование, гарантия качества, ответственность за соответствующий ожиданиям уровень защиты – основы деятельности нашей компании.",
    icon: "/upload/iblock/192/vkrz5asfouh4huwwime51cgyhb5sv3t5.svg",
    image: "/upload/iblock/a78/jlh534lgg5uhciaa7nukv2pl2natk98b.webp",
  },
  {
    title: "Честное партнёрство",
    desc: "Мы подбираем только необходимые технические решения, отвечающие поставленным задачам. Вы сразу знаете стоимость каждой позиции и услуги, прописанной в предложении.",
    icon: "/upload/iblock/aee/u69rnqzy5tsiaxppj9ofq5y3npzo1ya9.svg",
    image: "/upload/iblock/f0c/4vmen0an9mzlmskslo9yui9wk9hew5me.jpg",
  },
];

const TEAM = [
  {
    name: "Леонид",
    role: "Инженер проектировщик",
    exp: "более 15 лет",
    photo: "/upload/resize_cache/iblock/99c/640_940_1/orn9if16x3gwovu4ooubodstr4112z81.jpg",
  },
  {
    name: "Олег",
    role: "Руководитель технического отдела",
    exp: "Более 15 лет",
    photo: "/upload/resize_cache/iblock/835/640_940_1/9unvt02treqe0zo7ixwkoac22yaps7jb.jpg",
  },
  {
    name: "Станислав",
    role: "Инженер",
    exp: "более 10 лет",
    photo: "/upload/resize_cache/iblock/f6f/640_940_1/u0uu2jcp3915j3vb9fn4g9grfwn0kj63.jpg",
  },
  {
    name: "Роман",
    role: "Технический специалист",
    exp: "более 10 лет",
    photo: "/upload/resize_cache/iblock/3b8/640_940_1/ol6fwwua6t2kmu5brcirn31ijk7ofhxn.jpg",
  },
];

const CERTS = [
  {
    title: "Лицензия на охранную деятельность",
    image: "/images/certs/licenziya-cho.jpg",
    desc: "Лицензия ЧО №047972 от 26 марта 2001 г. Осуществление частной охранной деятельности. ООО ЧОП «СИГМА-ПРОФИ».",
  },
  {
    title: "Лицензия ФСБ",
    image: "/images/certs/licenziya-fsb.jpg",
    desc: "Лицензия УФСБ России №0115785 от 18 декабря 2019 г. Проведение работ, связанных с использованием сведений, составляющих государственную тайну.",
  },
  {
    title: "Сертификат о прохождении обучения",
    image: "/images/certs/sert-obuchenie.jpg",
    desc: "Сертификат №48ц-04/2018. Сотрудники отдела личной охраны ГК «Сигма-Профи» прошли курс «Комплексное обеспечение безопасности охраняемого лица. Уровень 3».",
  },
  {
    title: "Сертификат НП «Тактика»",
    image: "/images/certs/sert-taktika.jpg",
    desc: "Сертификат №541 от 05 ноября 2010 г. Сотрудники ООО ЧОП «СИГМА-ПРОФИ» прошли обучение по программе «Тактико-специальная подготовка сотрудников личной охраны».",
  },
  {
    title: "Сертификат МОО «Элита»",
    image: "/images/certs/sert-elita.jpg",
    desc: "Сертификат от 13 января 2012 г. Охранники ЧОП «СИГМА-ПРОФИ» прошли обучение в тренинговом клубе телохранителей «Элита» и показали хорошие результаты.",
  },
];

interface Props {
  settings: SettingsMap;
  stats: Stat[];
  partners: Partner[];
  services: Service[];
}

export default function PageClient({ settings, stats, partners, services }: Props) {
  const [modal, setModal] = useState<string | null>(null);
  const [whyIdx, setWhyIdx] = useState(0);

  return (
    <>
      <Header settings={settings} onModal={setModal} />
      <main>
        {/* Hero */}
        <section className="section section--dark section--top-0 overflow-hidden">
          <img className="section-about-image section-about-image--2" src="/images/team-sigma.png" width={1040} height={640} alt="" />
          <div className="section-glare section-glare--6"></div>
          <div className="wrapper">
            <ul className="breadcrumbs">
              <li className="breadcrumbs__item"><Link className="breadcrumbs__item-link" href="/">Главная</Link></li>
              <li className="breadcrumbs__item current"><span>О компании</span></li>
            </ul>
            <h1>О компании</h1>
            <div className="sigma-text">
              <div className="sigma-text__start">
                <span className="text-primary">«СИГМА-ПРОФИ» —</span> всегда
              </div>
              <div className="sigma-text__end">
                на шаг впереди.
              </div>
            </div>
            <div className="about-block mw-50-desktop spacing-t">
              <div className="text-styles">
                <h2>Компания<br />с большой историей</h2>
                <p>
                  Компания была основана в 1993 году как частное охранное предприятие «СИГМА-ПРОФИ»,
                  предоставляющее комплекс услуг по технической безопасности. На сегодняшний день — это самостоятельное
                  динамично развивающееся предприятие, входящее в состав Группы Компаний «СИГМА-ПРОФИ» — лидера отрасли
                  услуг безопасности с более чем 30-летней деловой репутацией.
                </p>
                <p>
                  За эти годы мы накопили огромный опыт, позволяющий реализовать защиту под задачу любой сложности.
                  Наши инженеры годами совершенствуют свои навыки работы с техническими средствами охраны.
                  Разработанные проекты постоянно обновляются, отвечая новым вызовам и угрозам безопасности.
                </p>
                <h3>«СИГМА-ПРОФИ» — всегда на шаг впереди.</h3>
              </div>
            </div>

            {/* Stats */}
            {stats.length > 0 && (
              <div className="spacing-y">
                <div className="js-nums-frame-holder nums">
                  <div className="nums__frame">
                    <div className="nums__frame-inner"></div>
                    <div className="nums__frame-glare"></div>
                  </div>
                  {stats.map((stat) => (
                    <div key={stat.id} className="nums__item">
                      <div className="nums__item-value">{stat.value}</div>
                      <div className="nums__item-name">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Why us */}
          <div className="spacing-y wrap-left position-relative z-2">
            <h2 className="wrap-right">Почему нас выбирают</h2>
            <div className="js-auto-carousel-desktop auto-carousel auto-carousel--desktop swiper">
              <div className="swiper-wrapper">
                {WHY_ITEMS.map((item, i) => (
                  <div key={i} className="swiper-slide">
                    <div className="why-item">
                      <div className="why-item__info">
                        <div className="why-item__info-top">
                          <img className="why-item__icon" src={item.icon} width={44} height={44} alt={item.title} />
                          <div className="why-item__title">{item.title}</div>
                        </div>
                        <div className="why-item__desc">{item.desc}</div>
                      </div>
                      <img className="why-item__image" src={item.image} width={310} height={348} alt={item.title} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Services tabs */}
        {services.length > 0 && (
          <ServicesSection services={services} onModal={setModal} />
        )}

        {/* Team */}
        <section className="section section--dark">
          <div className="wrapper">
            <div className="spacing-y">
              <div className="title-desc">
                <h2>Наша команда</h2>
                <div className="title-desc__text">
                  Наша команда – дипломированные специалисты, имеющие многолетний опыт практической работы.
                  Все наши инженеры регулярно проходят курсы повышения квалификации и сдают ежегодную аттестацию.
                </div>
              </div>
              <div className="grid-cols grid-cols--4">
                {TEAM.map((member, i) => (
                  <div key={i} className="grid-cols__col">
                    <div className="team-item">
                      <img className="team-item__image" src={member.photo} width={270} height={256} alt={member.name} />
                      <div className="team-item__title">{member.name}</div>
                      <div className="team-item__par">
                        <div className="team-item__par-title">Должность</div>
                        <div className="team-item__par-value">{member.role}</div>
                      </div>
                      <div className="team-item__par">
                        <div className="team-item__par-title">Опыт работы:</div>
                        <div className="team-item__par-value">{member.exp}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Certificates */}
            <div className="spacing-y">
              <div className="grid-cols grid-cols--2 grid-cols--tab-1col">
                <div className="grid-cols__col">
                  <div className="mw-1 text-styles">
                    <h2>Лицензии и сертификаты</h2>
                    <p>
                      Имеем все необходимые лицензии и допуски на осуществление деятельности по монтажу,
                      техническому обслуживанию и ремонту средств обеспечения пожарной безопасности зданий и сооружений.
                    </p>
                  </div>
                </div>
                <div className="grid-cols__col">
                  <div
                    style={{ display: "flex", gap: "1.5rem", overflowX: "auto", paddingBottom: "1rem" }}
                  >
                    {CERTS.map((cert, i) => (
                      <div key={i} className="cert-item" style={{ minWidth: "160px", flex: "0 0 160px" }}>
                        <div className="cert-item__title">{cert.title}</div>
                        <div className="cert-item__images">
                          <a href={cert.image} target="_blank" rel="noopener">
                            <img src={cert.image} width={160} height={220} alt={cert.title} />
                          </a>
                        </div>
                        <div className="cert-item__desc">{cert.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Partners */}
            {partners.length > 0 && (
              <div className="spacing-y">
                <h2>Нам доверяют</h2>
                <div className="js-carousel carousel swiper">
                  <div className="swiper-wrapper" style={{ display: "flex", flexDirection: "row", overflowX: "auto" }}>
                    {partners.map((partner) => (
                      <div key={partner.id} className="swiper-slide" style={{ width: "auto", flex: "0 0 auto", minWidth: "160px" }}>
                        <div className="partner-item">
                          {partner.logo_url ? (
                            <img
                              src={partner.logo_url}
                              alt={partner.name}
                              style={{ maxHeight: "60px", maxWidth: "140px", objectFit: "contain", display: "block" }}
                            />
                          ) : (
                            <span style={{ opacity: 0.6, fontSize: "0.875rem" }}>{partner.name}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
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
