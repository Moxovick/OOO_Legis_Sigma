"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import type { SettingsMap, ServiceDetail } from "@/types";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ContactFormSection from "@/components/sections/ContactFormSection";
import ContactsSection from "@/components/sections/ContactsSection";

const Modal = dynamic(() => import("@/components/ui/Modal"), { ssr: false });

const TABS = [
  { key: "design", label: "Проектирование" },
  { key: "install", label: "Монтаж" },
  { key: "maintain", label: "Обслуживание" },
];

const HERO_IMAGES: Record<string, string> = {
  "skud": "/upload/resize_cache/iblock/8bc/1920_1080_1/xw4h93swf7ezejf04com4upxr7ylfdjv.jpg",
  "videonablyudenie": "/upload/resize_cache/iblock/062/1920_1080_1/8h7zz91wq8dagwazxbtg9wjqjwso22ns.jpg",
  "pozharnaya-bezopasnost": "/upload/resize_cache/iblock/8ac/1920_1080_1/ivrqa6s8nxmwmmur9b1cmejvexweef0c.jpg",
  "okhrannaya-signalizatsiya": "/upload/iblock/d0a/gsand083kvxywnf30z4q3bvyl9l6zpjk.jpg",
  "kompleksnye-sistemy-bezopasnosti": "/upload/resize_cache/iblock/b41/1920_1080_1/xe8p69hgjyi1ani5y5tkyd7qq09cwjue.jpg",
};

const DEVICE_SECTIONS: Record<string, { title: string; desc: string; items: { name: string; image: string; desc: string }[] }> = {
  "skud": {
    title: "Базовое устройство СКУД",
    desc: "Из чего состоит система контроля и управления доступом? Типовой состав, элементы и комплектующие.",
    items: [
      {
        name: "Идентификаторы",
        image: "/upload/iblock/7a4/stg18ud1cdxd81plcz5v2s9iwrjfsmnu.jpeg",
        desc: "Идентификатор — базовый элемент СКУД. Хранит код для идентификации владельца. Виды: бесконтактные карты, брелоки, браслеты, RFID-метки; биометрические (отпечаток пальца, лицо); ПИН-код.",
      },
      {
        name: "Считыватели",
        image: "/upload/iblock/508/qjwpveed943w26rh7swna8xrmurys4dh.png",
        desc: "Считыватель — устройство для считывания кодовой информации с идентификатора и передачи её в контроллер. Бывают контактные, бесконтактные, биометрические, GSM.",
      },
      {
        name: "Контроллеры",
        image: "/upload/iblock/39c/3fngfzjx4wdnn6fs2cg9ox22gds3cwuw.png",
        desc: "Контроллер — центральное устройство СКУД. Хранит базу данных пользователей и журнал событий, управляет преграждающими устройствами. Бывают автономные и сетевые.",
      },
      {
        name: "Преграждающие устройства",
        image: "/upload/iblock/19b/l2ni8nrk0fckazy9q7c9830qvmyquym6.png",
        desc: "Устройства физического ограничения доступа. На двери: электрозащелки, электромеханические и электромагнитные замки. На проходы: турникеты, ворота, шлагбаумы.",
      },
      {
        name: "Программное обеспечение",
        image: "/upload/iblock/dbe/6s4n0zkxgxdohs2usxpiuf8ggq4fsigt.png",
        desc: "ПО организует взаимодействие с контроллерами. Внедряется для аналитики событий, построения отчетов, настройки уведомлений и сетевого управления.",
      },
      {
        name: "Дополнительное оборудование",
        image: "/upload/iblock/a13/jbvpjmbrd1kxs6r3fv29tsb6kg680obj.jpg",
        desc: "Кнопки выхода, дверные доводчики, датчики открывания двери, датчики прохода/проезда, блоки питания.",
      },
    ],
  },
  "videonablyudenie": {
    title: "Базовое устройство системы видеонаблюдения",
    desc: "Из чего состоит система видеонаблюдения? Типовой состав, элементы и комплектующие.",
    items: [
      {
        name: "Видеокамера",
        image: "/upload/iblock/0b7/egyexvuo15z6hu5foz8qlynhdndekokj.png",
        desc: "Видеокамера — устройство получения видеоизображения и обработки сигнала. Бывают аналоговые и IP, внутренние и уличные, купольные и цилиндрические.",
      },
      {
        name: "Кабель",
        image: "/upload/iblock/426/sjz9so72rpbglvktbr8apykcxdqdgouj.jpeg",
        desc: "Система передачи сигнала — кабель (коаксиальный или витая пара) или беспроводные сети (WiFi). Обеспечивает надёжную передачу видео и питания.",
      },
      {
        name: "Видеорегистратор или сервер",
        image: "/upload/iblock/ee8/99z7ocq416x6kk0ht5fhylgh21h1kiwu.png",
        desc: "Видеорегистратор — устройство обработки, записи и хранения видеоизображения. Для хранения информации установлен жёсткий диск. Бывают аналоговые (DVR) и сетевые (NVR).",
      },
      {
        name: "Источник питания",
        image: "/upload/iblock/b55/37dwc89d3cle43auihb3578mtue18dtw.png",
        desc: "Блок питания или PoE-коммутатор необходим для питания видеокамер и сетевого оборудования. Обеспечивает стабильную работу всей системы.",
      },
      {
        name: "Устройство вывода изображения",
        image: "/upload/iblock/719/a4dnzzhjrivf0iwti6inxlywyvnx7i1q.jpeg",
        desc: "Монитор, смартфон, удалённое рабочее место и т.д. Позволяет просматривать видеопоток в режиме реального времени и архивные записи.",
      },
    ],
  },
  "pozharnaya-bezopasnost": {
    title: "Базовое устройство системы пожарной безопасности",
    desc: "Из чего состоит система пожарной безопасности? Типовой состав, элементы и комплектующие.",
    items: [
      {
        name: "Извещатели",
        image: "/upload/iblock/8be/51kuzww982xjus3d42low5pomi4pnx4b.jpeg",
        desc: "Датчики дыма, тепла, пламени, комбинированные и ручные извещатели. Обнаруживают признаки возгорания и формируют сигнал тревоги.",
      },
      {
        name: "Пульт или приемно-контрольный прибор",
        image: "/upload/iblock/b94/n4hel2au50v12mf1z0f2hviqrzww665g.jpeg",
        desc: "Центральный элемент системы. Принимает сигналы от датчиков, анализирует их, определяет наличие возгорания и активирует устройства оповещения и пожаротушения.",
      },
      {
        name: "Устройства оповещения и управления эвакуацией",
        image: "/upload/iblock/20c/k02r6qj0k29fc3x7acl6qgwcn58yk8hq.jpeg",
        desc: "Звуковые сирены, световые сигналы, табло «Выход», громкоговорители, проблесковые маяки. Информируют людей об опасности и направляют к выходам.",
      },
      {
        name: "Аварийное питание",
        image: "/upload/iblock/6e0/20xh2fw5vylqiqslq95ei2aeiwxjpibw.jpeg",
        desc: "Источник бесперебойного питания обеспечивает функционирование системы при отключении электричества. Обязательный компонент для надёжной защиты.",
      },
      {
        name: "Панели индикации и управления",
        image: "/upload/iblock/684/atgwh3i6kmfdm2u0ov73anlpkixotog3.jpeg",
        desc: "Для контроля работы пожарных извещателей и управления приборами. Позволяют оперативно получать информацию о состоянии системы.",
      },
      {
        name: "Кабельные линии и соединения",
        image: "/upload/iblock/0ce/as9oieptk8p5y3tu4epzdgjaap3lfsh1.webp",
        desc: "Строгие требования пожарной безопасности устанавливают нормы к типу кабеля, соединениям и способам прокладки. Используются огнестойкие кабели.",
      },
    ],
  },
  "okhrannaya-signalizatsiya": {
    title: "Базовое устройство охранной сигнализации",
    desc: "Из чего состоит система охранной сигнализации? Типовой состав, элементы и комплектующие.",
    items: [
      {
        name: "Датчики",
        image: "/upload/iblock/6e7/8lk3bvol23imozd8iakfsw8ydumkpcl3.jpeg",
        desc: "Датчики открытия дверей/окон, движения, разбития стекла, вибрационные, тепловые. Обнаруживают проникновение и формируют сигнал тревоги.",
      },
      {
        name: "Приемно-контрольный блок",
        image: "/upload/iblock/904/7eefnkhn1c2c743gr2nxyumonbs7yuow.jpeg",
        desc: "Принимает показания датчиков, собирает и обрабатывает информацию. При совпадении сигнала запускает алгоритм сигнализации и оповещения.",
      },
      {
        name: "Исполнительные устройства",
        image: "/upload/iblock/5b9/byxf0w2oqbz212vwqjxpa49r04nuf0gy.webp",
        desc: "Сообщают о проникновении или нарушении периметра. Передают данные в правоохранительные органы, охранные фирмы, выводят на дисплей.",
      },
      {
        name: "Пульт или панель управления",
        image: "/upload/iblock/d1d/nwv4fbjj4ko7zntfzxlmlnyj0eroaz1c.jpeg",
        desc: "Клавиатура с дисплеем, переносной пульт или брелок. Позволяет постановке/снятию системы с охраны авторизованными пользователями.",
      },
      {
        name: "Соединительные кабели",
        image: "/upload/iblock/f28/lmnhd16bio6s9xb9d8o6mvcmsbamcdmp.jpg",
        desc: "Передают питание и информацию между компонентами системы. В беспроводных системах охранной сигнализации кабели отсутствуют — используется GSM/радиоканал.",
      },
    ],
  },
  "kompleksnye-sistemy-bezopasnosti": {
    title: "Базовое устройство комплексной системы безопасности",
    desc: "Из чего состоит комплексная система безопасности? Интегрированные компоненты и их назначение.",
    items: [
      {
        name: "Системы видеонаблюдения (СВН)",
        image: "/upload/iblock/a6a/ch89ckqg4w0vfsya2xggommf7w7hbvkd.png",
        desc: "Камеры, видеорегистраторы, программное обеспечение для анализа видео. Используются для мониторинга, записи событий и видеоаналитики.",
      },
      {
        name: "Системы контроля доступа (СКУД)",
        image: "/upload/iblock/508/qjwpveed943w26rh7swna8xrmurys4dh.png",
        desc: "Турникеты, шлагбаумы, карты доступа, биометрические сканеры. Ограничивают доступ в определённые зоны и ведут учёт прохода.",
      },
      {
        name: "Охранная и тревожная сигнализация",
        image: "/upload/iblock/6e7/8lk3bvol23imozd8iakfsw8ydumkpcl3.jpeg",
        desc: "Датчики движения, разбития стекла, открытия. Оповещают о несанкционированном проникновении или аварийных ситуациях.",
      },
      {
        name: "Системы пожарной безопасности",
        image: "/upload/iblock/8be/51kuzww982xjus3d42low5pomi4pnx4b.jpeg",
        desc: "Датчики дыма, тепла, системы автоматического пожаротушения. Раннее обнаружение и ликвидация пожаров.",
      },
      {
        name: "Системы информационной безопасности",
        image: "/upload/iblock/dbe/6s4n0zkxgxdohs2usxpiuf8ggq4fsigt.png",
        desc: "Защита данных от утечек, кибератак, несанкционированного доступа. Включает антивирусы, межсетевые экраны, шифрование.",
      },
      {
        name: "Интеграция и управление",
        image: "/upload/iblock/b94/n4hel2au50v12mf1z0f2hviqrzww665g.jpeg",
        desc: "Программные платформы для централизованного управления всеми компонентами. Единый интерфейс для контроля, анализа и реагирования.",
      },
    ],
  },
};

const CAPABILITIES: Record<string, { title: string; items: string[] }> = {
  "skud": {
    title: "Возможности СКУД",
    items: [
      "Различные способы идентификации",
      "Учет рабочего времени / Интеграция с 1С для расчета",
      "Автоматизированная регистрация посетителей и разовых пропусков",
      "Алкотестирование / Контроль температуры посетителей",
      "Контроль доступа к отдельным зонам и общей территории предприятия",
      "Автоматическая разблокировка преграждающих устройств при ЧС",
      "Рассылка SMS-уведомлений о проходе",
      "Повышение уровня безопасности объекта",
      "Интеграция с другими системами безопасности",
    ],
  },
  "videonablyudenie": {
    title: "Возможности системы видеонаблюдения",
    items: [
      "Круглосуточная запись / запись по расписанию",
      "Интеллектуальная аналитика изображения",
      "Удаленный доступ",
      "Интеграция со смартфоном",
      "Масштабируемость системы",
      "Интеграция с другими системами безопасности",
    ],
  },
  "pozharnaya-bezopasnost": {
    title: "Возможности системы пожарной безопасности",
    items: [
      "Передача сигнала на пульт специальных служб",
      "Оповещение людей о возникновении экстренной ситуации",
      "Автоматизация средств пожаротушения / механизмов дымоудаления",
      "Разблокировка путей для эвакуации",
      "Включение аварийного питания и освещения",
      "Интеграция с другими системами безопасности",
    ],
  },
  "okhrannaya-signalizatsiya": {
    title: "Возможности системы охранной сигнализации",
    items: [
      "Обнаружение проникновения на охраняемый объект",
      "Технологические извещатели (протечки воды/газа и т.д.)",
      "Удаленный мониторинг",
      "Широкий ассортимент охранных извещателей",
      "Максимальная отказоустойчивость",
      "Интеграция с другими системами безопасности",
    ],
  },
  "kompleksnye-sistemy-bezopasnosti": {
    title: "Возможности комплексной системы безопасности",
    items: [
      "Комплексный подход к безопасности",
      "Эффективность системы",
      "Удалённый контроль",
      "Гибкость и масштабируемость",
      "Мониторинг и предотвращение угроз",
      "Автоматизация реакций на события",
    ],
  },
};

const CYCLE_LINKS: Record<string, { design: string; install: string; maintain: string }> = {
  "skud": {
    design: "/services/skud/proektirovanie-skud",
    install: "/services/skud/montazh-skud",
    maintain: "/services/skud/obsluzhivanie-skud",
  },
  "videonablyudenie": {
    design: "/services/videonablyudenie/proektirovanie-videonablyudeniya",
    install: "/services/videonablyudenie/montazh-videonablyudeniya",
    maintain: "/services/videonablyudenie/obsluzhivanie-videonablyudeniya",
  },
  "pozharnaya-bezopasnost": {
    design: "/services/pozharnaya-bezopasnost/proektirovanie-pozharnyh-sistem",
    install: "/services/pozharnaya-bezopasnost/montazh-pozharnyh-sistem",
    maintain: "/services/pozharnaya-bezopasnost/obsluzhivanie-pozharnyh-sistem",
  },
  "okhrannaya-signalizatsiya": {
    design: "/services/okhrannaya-signalizatsiya/proektirovanie-signalizacii",
    install: "/services/okhrannaya-signalizatsiya/montazh-signalizacii",
    maintain: "/services/okhrannaya-signalizatsiya/obsluzhivanie-signalizacii",
  },
  "kompleksnye-sistemy-bezopasnosti": {
    design: "/services/kompleksnye-sistemy-bezopasnosti/proektirovanie-ksb",
    install: "/services/kompleksnye-sistemy-bezopasnosti/montazh-ksb",
    maintain: "/services/kompleksnye-sistemy-bezopasnosti/obsluzhivanie-ksb",
  },
};

// Price tables per service (from original site)
type PriceRow = [string, string];
type PriceBlock = { title: string; rows: PriceRow[] };

const SERVICE_PRICES: Record<string, PriceBlock[]> = {
  "skud": [
    {
      title: "Монтаж системы контроля и управления доступом",
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
      title: "Проектирование системы контроля и управления доступом",
      rows: [
        ["от 100 до 500 м² / до 5 точек доступа", "от 7800 ₽"],
        ["от 500 до 1000 м² / до 10 точек доступа", "от 12000 ₽"],
        ["от 1000 м² / более 10 точек доступа", "от 22000 ₽"],
      ],
    },
    {
      title: "Техническое обслуживание СКУД",
      rows: [
        ["Обслуживание оборудования СКУД", "от 3000 ₽"],
        ["Обслуживание шлагбаума", "от 3000 ₽"],
        ["Обслуживание турникета", "от 3500 ₽"],
        ["Обслуживание домофона", "от 500 ₽"],
      ],
    },
  ],
  "videonablyudenie": [
    {
      title: "Монтаж систем видеонаблюдения",
      rows: [
        ["Монтаж внутренней видеокамеры", "от 2500 ₽"],
        ["Монтаж уличной видеокамеры", "от 2800 ₽"],
        ["Монтаж PTZ видеокамеры", "от 3200 ₽"],
        ["Монтаж видеорегистратора", "от 1800 ₽"],
        ["Монтаж сетевого устройства (коммутатор, роутер, точка доступа)", "от 1600 ₽"],
        ["Монтаж блока питания", "от 1500 ₽"],
        ["Монтаж кабеля за метр", "от 75 ₽/м"],
        ["Монтаж гофрированной трубы", "от 60 ₽"],
        ["Монтаж кронштейна", "от 850 ₽"],
        ["Сборка, установка серверного шкафа", "от 2200 ₽"],
      ],
    },
    {
      title: "Проектирование систем видеонаблюдения",
      rows: [
        ["Площадь объекта до 100 м²", "от 18000 ₽"],
        ["Площадь объекта 100–200 м²", "от 21600 ₽"],
        ["Площадь объекта 200–400 м²", "от 96 ₽/м²"],
        ["Площадь объекта 400–700 м²", "от 84 ₽/м²"],
        ["Площадь объекта 700–1000 м²", "от 78 ₽/м²"],
        ["Площадь объекта 1000–2000 м²", "от 72 ₽/м²"],
        ["Площадь объекта 2000–3000 м²", "от 66 ₽/м²"],
        ["Площадь объекта 3000–5000 м²", "от 60 ₽/м²"],
        ["Площадь объекта от 5000 м²", "от 48 ₽/м²"],
      ],
    },
    {
      title: "Техническое обслуживание систем видеонаблюдения",
      rows: [
        ["До 8 камер", "от 400 ₽/камера"],
        ["От 8 до 16 камер", "от 350 ₽/камера"],
        ["От 16 до 32 камер", "от 300 ₽/камера"],
        ["От 32 до 64 камер", "от 250 ₽/камера"],
        ["От 64 до 150 камер", "от 200 ₽/камера"],
      ],
    },
  ],
  "pozharnaya-bezopasnost": [
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
        ["Площадь объекта 500–1000 м²", "от 52000 ₽"],
        ["Площадь объекта 1000–3000 м²", "от 55250 ₽"],
        ["Площадь объекта 3000–5000 м²", "от 93275 ₽"],
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
  "okhrannaya-signalizatsiya": [
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
        ["Площадь объекта 500–1000 м²", "от 32500 ₽"],
        ["Площадь объекта 1000–3000 м²", "от 41080 ₽"],
        ["Площадь объекта 3000–5000 м²", "от 51610 ₽"],
        ["Площадь объекта от 5000 м²", "от 80730 ₽"],
      ],
    },
    {
      title: "Техническое обслуживание охранной сигнализации",
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
  "kompleksnye-sistemy-bezopasnosti": [
    {
      title: "Монтаж комплексных систем безопасности",
      rows: [
        ["Монтаж электромагнитного замка (СКУД)", "от 2800 ₽"],
        ["Монтаж считывателя (СКУД)", "от 1600 ₽"],
        ["Монтаж контроллера (СКУД)", "от 2500 ₽"],
        ["Монтаж внутренней видеокамеры", "от 2500 ₽"],
        ["Монтаж уличной видеокамеры", "от 2800 ₽"],
        ["Монтаж видеорегистратора", "от 1800 ₽"],
        ["Монтаж дымового извещателя", "от 650 ₽"],
        ["Монтаж приемно-контрольного прибора (ПБ)", "от 2500 ₽"],
        ["Монтаж охранного извещателя в помещении", "от 1200 ₽"],
        ["Монтаж кабеля", "от 75 ₽"],
      ],
    },
    {
      title: "Проектирование комплексных систем безопасности",
      rows: [
        ["до 5 точек доступа / до 100 м²", "от 7800 ₽"],
        ["до 10 точек доступа / до 500 м²", "от 12000 ₽"],
        ["более 10 точек доступа / от 1000 м²", "от 22000 ₽"],
      ],
    },
    {
      title: "Техническое обслуживание комплексных систем",
      rows: [
        ["До 10 ед. оборудования", "от 3000 ₽"],
        ["От 10 до 30 ед. оборудования", "от 4000 ₽"],
        ["От 30 до 100 ед. оборудования", "от 7500 ₽"],
        ["От 100 ед. оборудования", "от 9500 ₽"],
      ],
    },
  ],
};

// FAQ per service
const FAQS: Record<string, { q: string; a: string }[]> = {
  "skud": [
    {
      q: "Что такое СКУД?",
      a: "СКУД (система контроля и управления доступом) — это система, предназначенная для идентификации, регистрации и ограничения входа-выхода объектов (людей, транспорта) на контрольных точках заданной территории. При появлении объекта система должна его идентифицировать, зарегистрировать и разрешить/запретить доступ с учётом дня недели, времени суток и других факторов.",
    },
    {
      q: "Какие типы устройств есть в СКУД?",
      a: "В СКУД, как правило, используются следующие типы устройств: считыватели, идентификаторы, контроллеры, элементы питания и исполнительные устройства.",
    },
    {
      q: "Для чего необходим СКУД?",
      a: "СКУД обеспечивает контролируемый доступ к помещениям и зонам, предотвращает несанкционированный доступ, упрощает управление доступом, позволяет быстро изменять права, ведёт автоматический аудит событий и может интегрироваться с другими системами безопасности.",
    },
    {
      q: "Что входит в установку СКУД?",
      a: "Установка СКУД включает: предварительный анализ требований клиента и объекта, определение мест установки считывателей, прокладку кабелей, установку и настройку оборудования и ПО, тестирование системы и обучение пользователей.",
    },
  ],
  "videonablyudenie": [
    {
      q: "Как выбрать систему видеонаблюдения?",
      a: "Выбор системы зависит от размера объекта, количества зон, требований к качеству видео, бюджета и технических возможностей. Рекомендуется обратиться к специалистам для консультации и подбора оптимального решения.",
    },
    {
      q: "Из чего состоит система видеонаблюдения?",
      a: "Основные компоненты: видеокамеры, видеорегистраторы, мониторы для вывода видеоизображения, кабели для передачи данных и питания.",
    },
    {
      q: "Есть ли возможность просматривать видеонаблюдение удалённо?",
      a: "Да, большинство современных систем предоставляют возможность удалённого доступа через интернет. Вы можете просматривать видеопоток и записи с любого места и в любое время через мобильные устройства или компьютеры.",
    },
    {
      q: "Нужно ли обслуживать систему видеонаблюдения?",
      a: "Регулярное обслуживание рекомендуется для поддержания надлежащей работы. Включает проверку и очистку камер, обновление ПО, проверку и замену неисправного оборудования, оптимизацию настроек.",
    },
  ],
  "pozharnaya-bezopasnost": [
    {
      q: "Что такое пожарная сигнализация?",
      a: "Это совокупность технических устройств, установленных на объекте для обнаружения пожара, обработки и представления извещений, выдачи команд на включение автоматического пожаротушения, систем дымоудаления, оповещения и управления эвакуацией.",
    },
    {
      q: "Для чего нужна пожарная сигнализация?",
      a: "Основное назначение — оповещение людей об опасности и, если предусмотрено проектом, автоматическая ликвидация возгорания. Установка пожарной сигнализации является обязательным требованием для большинства объектов.",
    },
    {
      q: "От чего срабатывает пожарная сигнализация?",
      a: "Система срабатывает при обнаружении дыма, пожара, угарного газа или других ЧС. Сигналы могут активироваться автоматически от детекторов дыма и тепла или вручную с помощью ручных пожарных извещателей.",
    },
    {
      q: "Из чего состоит пожарная сигнализация?",
      a: "В состав входят: извещатели пожарные автоматические (дымовые, тепловые, пламени), извещатели пожарные ручные, приёмно-контрольный прибор (ППК), источник бесперебойного питания, устройства оповещения и управления эвакуацией.",
    },
  ],
  "okhrannaya-signalizatsiya": [
    {
      q: "Для чего нужна охранная сигнализация?",
      a: "Охранная сигнализация позволяет всегда быть уверенным в безопасности вашего дома, офиса, склада или производственного помещения. Она рассчитана на предупреждение несанкционированного доступа в охраняемую зону.",
    },
    {
      q: "Как работает охранная сигнализация?",
      a: "Датчики улавливают попытки проникновения. Приёмно-контрольные приборы получают и передают сигнал опасности. Клавиатуры позволяют управлять системой. Исполнительные устройства передают сигнал тревоги (звуковой, автодозвон, речевой).",
    },
    {
      q: "Из чего состоит система охранной сигнализации?",
      a: "Датчики: движения, разбития окна, магнитоконтактные, вибрационные. Контрольная панель принимает сигналы с датчиков и отправляет сообщения по телефонной линии, Wi-Fi или мобильной связи. Блок резервного питания и кабели.",
    },
    {
      q: "Какие виды охранных сигнализаций существуют?",
      a: "Проводные — надёжные и стабильные. Беспроводные (GSM) — не требуют прокладки кабелей. Комбинированные — сочетают оба подхода. По типу охраны: периметральные, объёмные, точечные.",
    },
  ],
  "kompleksnye-sistemy-bezopasnosti": [
    {
      q: "Что такое КСБ?",
      a: "КСБ — это интегрированная система, объединяющая различные технологии (видеонаблюдение, контроль доступа, сигнализации, пожарную безопасность) для защиты объектов, людей и данных через единую платформу управления.",
    },
    {
      q: "Для чего нужна КСБ?",
      a: "Защита от краж, взломов и пожаров. Контроль доступа в зоны. Мониторинг и анализ событий в режиме реального времени. Обеспечение информационной безопасности.",
    },
    {
      q: "Как выбрать КСБ для объекта?",
      a: "Определите цели (охрана, контроль доступа, пожарная безопасность). Учитывайте размер объекта, количество зон, бюджет. Выбирайте системы с возможностью масштабирования и интеграции с существующей инфраструктурой.",
    },
    {
      q: "Какие преимущества у КСБ перед отдельными системами?",
      a: "Единый интерфейс управления. Автоматизация процессов (блокировка дверей при тревоге). Возможность анализировать данные из разных источников. Экономия на обслуживании и монтаже.",
    },
  ],
};

const SERVICE_STAGES = [
  { num: "01", title: "Заявка", desc: "Оставьте заявку на сайте на обратный звонок, позвоните или отправьте запрос на e-mail" },
  { num: "02", title: "Консультация", desc: "С вами свяжется менеджер, ответит на все вопросы, озвучит предварительную стоимость" },
  { num: "03", title: "Обследование объекта", desc: "Нет готового ТЗ? Направим инженера для первичного обследования объекта" },
  { num: "04", title: "Расчёт стоимости", desc: "Рассчитаем финальную стоимость, предоставим коммерческое предложение и смету" },
  { num: "05", title: "Заключение договора", desc: "Согласование условий и подписание договора" },
  { num: "06", title: "Оказание услуги", desc: "Проектирование, монтаж и поставка оборудования, техническое обслуживание" },
];

interface Props {
  settings: SettingsMap;
  service: ServiceDetail;
}

export default function ServicePageClient({ settings, service }: Props) {
  const [modal, setModal] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("design");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const tabContent: Record<string, string | null> = {
    design: service.content_design,
    install: service.content_install,
    maintain: service.content_maintain,
  };

  const heroImage = HERO_IMAGES[service.slug];
  const deviceSection = DEVICE_SECTIONS[service.slug];
  const capabilities = CAPABILITIES[service.slug];
  const cycleLinks = CYCLE_LINKS[service.slug];
  const prices = SERVICE_PRICES[service.slug] || [];
  const faqs = FAQS[service.slug] || [];

  return (
    <>
      <Header settings={settings} onModal={setModal} />
      <main>
        {/* Hero */}
        <section className="section section--start section--start-flex-start no-overlap">
          {heroImage && <img className="start-image" src={heroImage} alt={service.title} />}
          <div className="wrapper">
            <ul className="breadcrumbs">
              <li className="breadcrumbs__item"><Link className="breadcrumbs__item-link" href="/">Главная</Link></li>
              <li className="breadcrumbs__item"><Link className="breadcrumbs__item-link" href="/services">Наши услуги</Link></li>
              <li className="breadcrumbs__item current"><span>{service.title}</span></li>
            </ul>
            <h1>{service.title}</h1>
            {service.description && (
              <div className="start-text mw-50-desktop">
                <p>{service.description}</p>
              </div>
            )}
            <div style={{ marginTop: "2rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <div className="button-anim">
                <span className="button-anim__circle"></span>
                <button className="button button--primary" onClick={() => setModal("order")}>
                  <span>Заказать услугу</span>
                </button>
              </div>
              <div className="button-anim">
                <span className="button-anim__circle"></span>
                <button className="button button--primary" onClick={() => setModal("consult")}>
                  <span>Бесплатная консультация</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* "Базовое устройство" section */}
        {deviceSection && (
          <section className="section overflow-hidden">
            <div className="wrapper">
              <div className="title-desc">
                <h2>{deviceSection.title}</h2>
                <div className="title-desc__text">{deviceSection.desc}</div>
              </div>
              <div className="grid-cols grid-cols--3 grid-cols--tab-2col" style={{ marginTop: "2.5rem" }}>
                {deviceSection.items.map((item) => (
                  <div key={item.name} className="grid-cols__col">
                    <div className="scale-slide">
                      <img src={item.image} alt={item.name} style={{ width: "100%", height: "160px", objectFit: "contain", display: "block" }} />
                    </div>
                    <div style={{ marginTop: "1rem", fontWeight: 700, fontSize: "1rem" }}>{item.name}</div>
                    <div style={{ marginTop: "0.5rem", color: "var(--colorTextMuted)", fontSize: "0.875rem", lineHeight: "1.5" }}>{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Capabilities section */}
        {capabilities && (
          <section className="section section--dark overflow-hidden">
            <div className="wrapper">
              <h2>{capabilities.title}</h2>
              <div className="grid-cols grid-cols--3 grid-cols--tab-2col" style={{ marginTop: "2rem" }}>
                {capabilities.items.map((item) => (
                  <div key={item} className="grid-cols__col">
                    <div className="tile tile--dark h-100">
                      <div className="tile__bottom">
                        <div className="tile__title2">{item}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Full cycle + Prices section */}
        {cycleLinks && (
          <section className="section overflow-hidden">
            <div className="wrapper">
              <h2>Выполняем полный<br />цикл услуг</h2>
              <div className="grid-cols grid-cols--3 grid-cols--tab-2col" style={{ marginTop: "2rem" }}>
                <div className="grid-cols__col">
                  <div className="tile h-100">
                    <div className="tile__name tile__name--sm-font">
                      <Link href={cycleLinks.design}>Проектирование {service.title.toLowerCase()}</Link>
                    </div>
                  </div>
                </div>
                <div className="grid-cols__col">
                  <div className="tile h-100">
                    <div className="tile__name tile__name--sm-font">
                      <Link href={cycleLinks.install}>Монтаж {service.title.toLowerCase()}</Link>
                    </div>
                  </div>
                </div>
                <div className="grid-cols__col">
                  <div className="tile h-100">
                    <div className="tile__name tile__name--sm-font">
                      <Link href={cycleLinks.maintain}>Техническое обслуживание {service.title.toLowerCase()}</Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Price tables */}
              {prices.length > 0 && (
                <div style={{ marginTop: "3rem" }}>
                  <h2>Стоимость {service.title.toLowerCase()}</h2>
                  <p style={{ marginTop: "1rem", color: "var(--colorTextMuted)", fontSize: "0.9rem" }}>
                    Цены, представленные на сайте, являются ориентировочными и могут быть изменены в зависимости от функционала системы, требований заказчика, типа объекта и других факторов. Для получения индивидуального расчета позвоните нам или оставьте заявку на сайте.
                  </p>
                  {prices.map((block) => (
                    <div key={block.title} style={{ marginTop: "2rem" }}>
                      <h3 style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>{block.title}</h3>
                      <div className="price-table" style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                          <thead>
                            <tr>
                              <th style={{ textAlign: "left", padding: "0.75rem 1rem", borderBottom: "1px solid var(--colorBorder)", fontWeight: 700 }}>Наименование работ</th>
                              <th style={{ textAlign: "right", padding: "0.75rem 1rem", borderBottom: "1px solid var(--colorBorder)", fontWeight: 700, whiteSpace: "nowrap" }}>Стоимость</th>
                            </tr>
                          </thead>
                          <tbody>
                            {block.rows.map(([name, price]) => (
                              <tr key={name} style={{ borderBottom: "1px solid var(--colorLight)" }}>
                                <td style={{ padding: "0.75rem 1rem" }}>{name}</td>
                                <td style={{ padding: "0.75rem 1rem", textAlign: "right", whiteSpace: "nowrap", color: "var(--colorMain)", fontWeight: 500 }}>{price}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                  <div style={{ marginTop: "1.5rem" }}>
                    <div className="button-anim">
                      <span className="button-anim__circle"></span>
                      <button className="button button--primary" onClick={() => setModal("order")}>
                        <span>Получить расчёт стоимости</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Service stages */}
        <section className="section section--dark no-overlap section--stages-line">
          <div className="wrapper">
            <h2>Этапы оказания услуги</h2>
          </div>
          <div className="stages-container">
            <div className="stages">
              <div className="stage-item stage-item--spacer"><div className="stage-item__top"></div></div>
              {SERVICE_STAGES.map((stage, i) => (
                <div key={stage.num} className="stage-item">
                  <div className="stage-item__top"></div>
                  <div className="stage-item__content">
                    <div className="stage-item__tile">
                      <div className="stage-item__title">{stage.title}</div>
                      <div className="stage-item__text">{stage.desc}</div>
                    </div>
                  </div>
                  {i === 0 && (
                    <div className="button-anim">
                      <span className="button-anim__circle"></span>
                      <button className="button button--primary" onClick={() => setModal("consult")}>
                        <span>Оставить заявку</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
              <div className="stage-item stage-item--spacer"><div className="stage-item__top"></div></div>
            </div>
          </div>
          <div className="wrapper">
            <div className="button-anim button-anim--stages">
              <span className="button-anim__circle"></span>
              <button className="button button--primary" onClick={() => setModal("call")}>
                <span>Оставить заявку</span>
              </button>
            </div>
          </div>
        </section>

        {/* Tabs: design / install / maintain */}
        <section className="section overflow-hidden">
          <div className="wrapper">
            <h2>Подробнее об услуге</h2>
            <div className="title-desc" style={{ marginTop: "0.5rem" }}>Проектирование, монтаж и обслуживание систем безопасности</div>
            <div className="tabs-nav" style={{ marginTop: "1.5rem" }}>
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
                style={{ marginTop: "2rem" }}
              >
                {tabContent[tab.key] ? (
                  <div className="text-styles text-styles--normal-headings">
                    <p>{tabContent[tab.key]}</p>
                  </div>
                ) : (
                  <p style={{ opacity: 0.5 }}>Информация обновляется</p>
                )}
                <div style={{ marginTop: "2rem" }}>
                  <div className="button-anim">
                    <span className="button-anim__circle"></span>
                    <button className="button button--primary" onClick={() => setModal("order")}>
                      <span>Заказать {tab.label.toLowerCase()}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        {faqs.length > 0 && (
          <section className="section no-overlap overflow-hidden">
            <div className="wrapper">
              <h2>Вопросы и ответы</h2>
              <div className="section-desc text-styles" style={{ marginTop: "0.5rem" }}>
                <p>Собрали для вас ответы на часто задаваемые<br />и просто важные вопросы.</p>
              </div>
              <div style={{ marginTop: "2rem" }}>
                {faqs.map((faq, i) => (
                  <div key={i} className={`spoiler${openFaq === i ? " is-open" : ""}`}>
                    <div
                      className="spoiler__trigger spoiler__trigger--sm-font"
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    >
                      {faq.q}
                    </div>
                    <div
                      className="spoiler__content"
                      style={{ maxHeight: openFaq === i ? "500px" : "0" }}
                    >
                      <div className="spoiler__content-inner text-styles">
                        {faq.a}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Contact form */}
        <ContactFormSection />
        <ContactsSection settings={settings} />
      </main>
      <Footer settings={settings} onModal={setModal} />
      <Modal type={modal} onClose={() => setModal(null)} />
    </>
  );
}
