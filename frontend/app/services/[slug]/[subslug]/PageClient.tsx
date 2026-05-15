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

const HERO_IMAGES: Record<string, string> = {
  "skud": "/upload/resize_cache/iblock/8bc/1920_1080_1/xw4h93swf7ezejf04com4upxr7ylfdjv.jpg",
  "videonablyudenie": "/upload/resize_cache/iblock/062/1920_1080_1/8h7zz91wq8dagwazxbtg9wjqjwso22ns.jpg",
  "pozharnaya-bezopasnost": "/upload/resize_cache/iblock/8ac/1920_1080_1/ivrqa6s8nxmwmmur9b1cmejvexweef0c.jpg",
  "okhrannaya-signalizatsiya": "/upload/iblock/d0a/gsand083kvxywnf30z4q3bvyl9l6zpjk.jpg",
  "kompleksnye-sistemy-bezopasnosti": "/upload/resize_cache/iblock/b41/1920_1080_1/xe8p69hgjyi1ani5y5tkyd7qq09cwjue.jpg",
};

// Hardcoded hero text per subslug (fallback when DB content is empty)
const SUBPAGE_TEXTS: Record<string, string> = {
  // СКУД
  "proektirovanie-skud": "Группа компаний «СИГМА-ПРОФИ» представляет услуги по проектированию систем контроля и управления доступом (СКУД). Разрабатываем техническую документацию, подбираем оборудование с учётом требований заказчика и специфики объекта.",
  "montazh-skud": "Установка СКУД в офисах, на предприятиях, в медицинских и образовательных учреждениях — устоявшаяся норма. Мы выполняем монтаж систем контроля доступа любой сложности.",
  "obsluzhivanie-skud": "Компания «СИГМА-ПРОФИ» предлагает комплекс услуг по техническому обслуживанию и ремонту СКУД. Обеспечиваем бесперебойную работу систем контроля доступа.",
  "biometricheskie": "Биометрические системы контроля доступа позволяют идентифицировать пользователей по уникальным биологическим параметрам: отпечатку пальца, форме лица, рисунку вен. Мы устанавливаем современные биометрические решения под любые задачи.",
  // Пожарная безопасность
  "proektirovanie-pozharnyh-sistem": "Проектирование систем пожарной безопасности — разработка технической документации в соответствии с нормами и требованиями законодательства. Полный комплекс услуг: от обследования до сдачи проекта.",
  "montazh-pozharnyh-sistem": "Монтаж систем пожарной сигнализации и оповещения на объектах любой сложности. Работаем в соответствии с действующими нормами и стандартами, с лицензией МЧС.",
  "obsluzhivanie-pozharnyh-sistem": "Техническое обслуживание систем пожарной безопасности — регулярная проверка работоспособности оборудования, замена расходных материалов, устранение неисправностей.",
  "pozharnaya-signalizatsiya": "Установка пожарной сигнализации на объектах любого типа. Современное оборудование, лицензированные специалисты, гарантия на выполненные работы.",
  "protivopozharnaya-zashchita": "Противопожарная защита объектов — комплекс технических и организационных мер по предупреждению и ликвидации пожаров. Проектирование, монтаж и обслуживание под ключ.",
  "soue": "Система оповещения и управления эвакуацией (СОУЭ) обеспечивает своевременное информирование людей об опасности. Устанавливаем системы оповещения в соответствии с требованиями пожарной безопасности.",
  "proektirovanie-sistem-opoveshcheniya": "Проектирование систем оповещения о пожаре — разработка технических решений для своевременного информирования и эвакуации людей с объекта в соответствии с нормами.",
  "obsluzhivanie-sistem-opoveshcheniya": "Техническое обслуживание систем оповещения — регулярные проверки, профилактика и ремонт оборудования СОУЭ для поддержания их в рабочем состоянии.",
  "ustanovka-sistem-opoveshcheniya": "Установка систем оповещения о пожаре на объектах любой категории. Монтаж световых и звуковых оповещателей, речевых систем оповещения.",
  // Видеонаблюдение
  "proektirovanie-videonablyudeniya": "Проектирование систем видеонаблюдения — разработка технической документации с учётом особенностей объекта, количества зон контроля и требований заказчика.",
  "montazh-videonablyudeniya": "Монтаж систем видеонаблюдения и охранного телевизионного наблюдения (СОТ) на объектах любого типа. Профессиональная прокладка кабелей, установка камер и настройка оборудования.",
  "obsluzhivanie-videonablyudeniya": "Техническое обслуживание систем видеонаблюдения — регулярная проверка камер, регистраторов, коммутационного оборудования. Устранение неисправностей, обновление ПО.",
  "ustanovka-ulichnogo-videonablyudeniya": "Установка уличного видеонаблюдения для контроля прилегающих территорий, въездов, парковок и периметра объекта. Используем вандалозащищённые камеры с высоким разрешением.",
  "ustanovka-videonablyudeniya-na-parkovkakh": "Установка видеонаблюдения на парковках позволяет контролировать въезды и выезды, фиксировать номера автомобилей и предотвращать противоправные действия на территории парковки.",
  "ustanovka-videonablyudeniya-na-dachakh": "Установка системы видеонаблюдения на даче обеспечивает круглосуточный контроль территории. Монтаж уличных и внутренних камер, настройка удалённого доступа.",
  "ustanovka-videonablyudeniya-v-restoranakh": "Установка видеонаблюдения в ресторанах — контроль залов, кухни, кассы и входных групп. Повышает безопасность персонала, гостей и имущества заведения.",
  "ustanovka-videonablyudeniya-v-kafe": "Система видеонаблюдения в кафе обеспечивает контроль работы персонала, сохранность имущества и безопасность посетителей. Устанавливаем камеры видимого и скрытого наблюдения.",
  "ustanovka-videonablyudeniya-na-avtomoykakh": "Видеонаблюдение на автомойках позволяет контролировать качество обслуживания, предотвращать кражи и разбирательства с клиентами. Монтаж защищённых влагостойких камер.",
  "ustanovka-videonablyudeniya-v-shkolakh": "Видеонаблюдение в школах обеспечивает безопасность учащихся и персонала. Контроль входных групп, коридоров, столовых и прилегающей территории.",
  "ustanovka-videonablyudeniya-v-podezdakh": "Установка видеонаблюдения в подъездах жилых домов — эффективная мера для предотвращения вандализма и несанкционированного проникновения.",
  "ustanovka-videonablyudeniya-v-liftakh": "Видеонаблюдение в лифтах обеспечивает безопасность пассажиров и фиксирует факты вандализма. Используем специализированные малогабаритные камеры.",
  "ustanovka-videonablyudeniya-v-detskikh-sadakh": "Видеонаблюдение в детских садах — контроль игровых площадок, групповых комнат и входных зон. Обеспечивает безопасность детей и даёт возможность родителям наблюдать за обстановкой.",
  "ustanovka-videonablyudeniya-i-sot-v-aptekakh": "Система видеонаблюдения в аптеке защищает от краж, контролирует работу персонала и фиксирует факты спорных ситуаций с покупателями.",
  "ustanovka-videonablyudeniya-po-perimetru": "Видеонаблюдение по периметру обеспечивает защиту внешних границ объекта. Устанавливаем камеры с широким углом обзора и ИК-подсветкой для ночного наблюдения.",
  "ustanovka-videonablyudeniya-na-sklade": "Видеонаблюдение на складе позволяет контролировать движение товаров, работу персонала и предотвращать хищения. Монтаж купольных и поворотных камер.",
  "ustanovka-sistem-videonablyudeniya-v-torgovykh-tsentrakh": "Система видеонаблюдения в торговом центре охватывает торговые залы, кассы, эскалаторы, подсобные помещения и парковку. Обеспечивает безопасность посетителей и сотрудников.",
  "ustanovka-videonablyudeniya-v-ofise": "Видеонаблюдение в офисе — контроль рабочих мест, переговорных комнат, ресепшн и входных групп. Повышает дисциплину и обеспечивает сохранность имущества.",
  "ustanovka-videonablyudeniya-v-magazine": "Система видеонаблюдения в магазине предотвращает кражи, контролирует работу кассиров и сохраняет записи для разрешения спорных ситуаций.",
  "ustanovka-videonablyudeniya-v-kvartirakh": "Установка видеонаблюдения в квартире — контроль входной двери, прихожей, детской комнаты и периметра. Возможность удалённого просмотра с телефона.",
  "ustanovka-videonablyudeniya-v-biznes-tsentrakh": "Видеонаблюдение в бизнес-центрах охватывает холлы, лифтовые зоны, парковки и периметр. Интегрируется с СКУД и охранной сигнализацией.",
  "analogovye-sistemy-videonablyudeniya": "Аналоговые системы видеонаблюдения — надёжные и экономичные решения для объектов с уже проложенной коаксиальной инфраструктурой. Подходят для малого и среднего бизнеса.",
  "tsifrovye-sistemy-videonablyudeniya": "Цифровые (IP) системы видеонаблюдения обеспечивают высокое разрешение, гибкость настройки и удалённый доступ. Оптимальный выбор для современных объектов.",
  // Охранная сигнализация
  "proektirovanie-signalizacii": "Проектирование охранной сигнализации — разработка технической документации с учётом площади, особенностей помещений и требований заказчика. Обследование объекта, подбор оборудования.",
  "montazh-signalizacii": "Монтаж охранной сигнализации в офисах, складах, квартирах и на предприятиях. Профессиональная установка датчиков, контрольных панелей и оповещателей с гарантией.",
  "obsluzhivanie-signalizacii": "Техническое обслуживание охранной сигнализации — регулярные профилактические работы, проверка работоспособности датчиков и контрольных панелей.",
  "besprovodnaya-signalizatsiya": "Беспроводная охранная сигнализация — современное решение без прокладки кабелей. Быстрый монтаж, гибкая настройка, надёжная работа на базе радиоканала.",
  "gsm-signalizatsiya": "GSM-сигнализация позволяет получать уведомления о срабатывании датчиков на мобильный телефон. Удалённый контроль над объектом в любое время и из любой точки.",
  // Комплексные системы безопасности
  "montazh-ksb": "Монтаж комплексных систем безопасности — одновременная установка систем видеонаблюдения, контроля доступа, охранной и пожарной сигнализации под единым управлением.",
  "proektirovanie-ksb": "Проектирование комплексных систем безопасности — разработка технических решений, объединяющих все средства защиты объекта в единую интегрированную систему.",
  "obsluzhivanie-ksb": "Техническое обслуживание комплексных систем безопасности — полный сервис всех компонентов: видеонаблюдения, СКУД, сигнализации и систем пожарной безопасности.",
  "sistemy-okhrany-perimetra": "Системы охраны периметра обеспечивают защиту внешних границ объекта. Устанавливаем видеокамеры, извещатели и технические средства периметральной защиты.",
};

// Device/component sections per parent service slug
const DEVICE_SECTIONS: Record<string, { title: string; desc: string; items: string[] }> = {
  "skud": {
    title: "Базовое устройство СКУД",
    desc: "Из чего состоит система контроля и управления доступом? Типовой состав, элементы и комплектующие.",
    items: ["Идентификаторы", "Считыватели", "Контроллеры", "Преграждающие устройства", "Программное обеспечение", "Дополнительное оборудование"],
  },
  "videonablyudenie": {
    title: "Базовое устройство системы видеонаблюдения",
    desc: "Из чего состоит система видеонаблюдения? Типовой состав, элементы и комплектующие.",
    items: ["Видеокамеры", "Видеорегистратор / NVR", "Кабельная инфраструктура", "Блоки питания", "Коммутационное оборудование", "Мониторы и серверы"],
  },
  "pozharnaya-bezopasnost": {
    title: "Состав системы пожарной безопасности",
    desc: "Из чего состоит система пожарной защиты? Типовой состав, элементы и комплектующие.",
    items: ["Пожарные извещатели (дымовые, тепловые)", "Ручные извещатели", "Приёмно-контрольный прибор (ППК)", "Оповещатели (звуковые, световые)", "Блок бесперебойного питания", "Кабельная инфраструктура"],
  },
  "okhrannaya-signalizatsiya": {
    title: "Состав системы охранной сигнализации",
    desc: "Из чего состоит система охранной сигнализации? Типовой состав, элементы и комплектующие.",
    items: ["Охранные извещатели (движения, разбития)", "Магнитоконтактные датчики", "Контрольная панель", "Оповещатели (сирена, световые)", "Блок резервного питания", "GSM/IP-передатчик"],
  },
  "kompleksnye-sistemy-bezopasnosti": {
    title: "Состав комплексной системы безопасности",
    desc: "Из чего состоит КСБ? Типовой состав, объединённые подсистемы.",
    items: ["Система видеонаблюдения", "Система контроля доступа (СКУД)", "Охранная сигнализация", "Пожарная сигнализация и СОУЭ", "Центр мониторинга и управления", "Система охраны периметра"],
  },
};

// Capabilities per parent service slug
const CAPABILITIES: Record<string, { title: string; items: string[] }> = {
  "skud": {
    title: "Возможности СКУД",
    items: [
      "Различные способы идентификации",
      "Учёт рабочего времени / интеграция с 1С",
      "Автоматизированная регистрация посетителей",
      "Алкотестирование / контроль температуры",
      "Контроль доступа к отдельным зонам",
      "Автоматическая разблокировка при ЧС",
      "Рассылка SMS-уведомлений о проходе",
      "Повышение уровня безопасности объекта",
      "Интеграция с другими системами безопасности",
    ],
  },
  "videonablyudenie": {
    title: "Возможности системы видеонаблюдения",
    items: [
      "Видеозапись в высоком разрешении 24/7",
      "Удалённый просмотр с телефона и ПК",
      "Детекция движения и аналитика",
      "Ночная съёмка (ИК-подсветка)",
      "Распознавание лиц и номеров автомобилей",
      "Хранение архива до 30 дней и более",
      "Интеграция со СКУД и сигнализацией",
      "Оповещение при срабатывании детектора",
      "Работа в сложных погодных условиях",
    ],
  },
  "pozharnaya-bezopasnost": {
    title: "Возможности системы пожарной безопасности",
    items: [
      "Раннее обнаружение дыма и возгорания",
      "Автоматическое оповещение и эвакуация",
      "Передача сигнала в пожарную службу",
      "Управление системами дымоудаления",
      "Интеграция с системами пожаротушения",
      "Мониторинг в режиме реального времени",
      "Резервное питание при отключении сети",
      "Соответствие нормам и требованиям МЧС",
      "Возможность расширения системы",
    ],
  },
  "okhrannaya-signalizatsiya": {
    title: "Возможности охранной сигнализации",
    items: [
      "Обнаружение несанкционированного проникновения",
      "Звуковое и световое оповещение",
      "SMS/Push-уведомления на телефон",
      "Управление с клавиатуры или мобильного",
      "Разграничение зон охраны",
      "Постановка/снятие с охраны",
      "Интеграция с видеонаблюдением",
      "Резервное питание при отключении сети",
      "Защита от вскрытия оборудования",
    ],
  },
  "kompleksnye-sistemy-bezopasnosti": {
    title: "Преимущества комплексных систем безопасности",
    items: [
      "Единый центр управления всеми системами",
      "Автоматизация реакции на события",
      "Экономия на обслуживании",
      "Масштабируемость и гибкость",
      "Единый архив событий",
      "Снижение ложных тревог",
      "Удалённый мониторинг",
      "Интеграция со сторонними системами",
      "Соответствие всем нормативным требованиям",
    ],
  },
};

const SERVICE_STAGES = [
  { title: "Заявка", desc: "Оставьте заявку на сайте на обратный звонок, позвоните или отправьте запрос на e-mail" },
  { title: "Консультация", desc: "С вами свяжется менеджер, ответит на все вопросы, озвучит предварительную стоимость" },
  { title: "Обследование объекта", desc: "Нет готового ТЗ? Направим инженера для первичного обследования объекта" },
  { title: "Расчёт стоимости", desc: "Рассчитаем финальную стоимость, предоставим коммерческое предложение и смету" },
  { title: "Заключение договора", desc: "Согласование условий и подписание договора" },
  { title: "Оказание услуги", desc: "Проектирование, монтаж и поставка оборудования, техническое обслуживание" },
];

// Price blocks per service and type (install/design/maintain)
type PriceRow = [string, string];
type PriceBlock = { title: string; rows: PriceRow[] };

const PRICE_INSTALL: Record<string, PriceBlock> = {
  "skud": {
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
    ],
  },
  "videonablyudenie": {
    title: "Монтаж систем видеонаблюдения",
    rows: [
      ["Монтаж внутренней видеокамеры", "от 2500 ₽"],
      ["Монтаж уличной видеокамеры", "от 2800 ₽"],
      ["Монтаж PTZ видеокамеры", "от 3200 ₽"],
      ["Монтаж видеорегистратора", "от 1800 ₽"],
      ["Монтаж сетевого устройства", "от 1600 ₽"],
      ["Монтаж блока питания", "от 1500 ₽"],
      ["Монтаж кабеля за метр", "от 75 ₽/м"],
      ["Монтаж кронштейна", "от 850 ₽"],
      ["Сборка, установка серверного шкафа", "от 2200 ₽"],
    ],
  },
  "pozharnaya-bezopasnost": {
    title: "Монтаж системы пожарной безопасности",
    rows: [
      ["Монтаж дымового извещателя", "от 650 ₽"],
      ["Монтаж ручного извещателя", "от 650 ₽"],
      ["Монтаж оповещателя", "от 500 ₽"],
      ["Монтаж речевого оповещателя", "от 650 ₽"],
      ["Монтаж приемно-контрольного прибора", "от 2500 ₽"],
      ["Монтаж блока питания", "от 1500 ₽"],
      ["Монтаж кабеля", "от 75 ₽"],
    ],
  },
  "okhrannaya-signalizatsiya": {
    title: "Монтаж системы охранной сигнализации",
    rows: [
      ["Монтаж охранного извещателя в помещении", "от 1200 ₽"],
      ["Монтаж охранного извещателя на улице", "от 2200 ₽"],
      ["Монтаж магнитоконтактного извещателя", "от 950 ₽"],
      ["Монтаж тревожной кнопки", "от 750 ₽"],
      ["Монтаж приемно-контрольного прибора", "от 2500 ₽"],
      ["Монтаж кабеля", "от 75 ₽"],
    ],
  },
  "kompleksnye-sistemy-bezopasnosti": {
    title: "Монтаж комплексных систем безопасности",
    rows: [
      ["Монтаж электромагнитного замка", "от 2800 ₽"],
      ["Монтаж внутренней видеокамеры", "от 2500 ₽"],
      ["Монтаж уличной видеокамеры", "от 2800 ₽"],
      ["Монтаж дымового извещателя", "от 650 ₽"],
      ["Монтаж охранного извещателя", "от 1200 ₽"],
      ["Монтаж кабеля", "от 75 ₽"],
    ],
  },
};

const PRICE_DESIGN: Record<string, PriceBlock> = {
  "skud": {
    title: "Проектирование системы контроля и управления доступом",
    rows: [
      ["от 100 до 500 м² / до 5 точек доступа", "от 7800 ₽"],
      ["от 500 до 1000 м² / до 10 точек доступа", "от 12000 ₽"],
      ["от 1000 м² / более 10 точек доступа", "от 22000 ₽"],
    ],
  },
  "videonablyudenie": {
    title: "Проектирование систем видеонаблюдения",
    rows: [
      ["Площадь объекта до 100 м²", "от 18000 ₽"],
      ["Площадь объекта 100–200 м²", "от 21600 ₽"],
      ["Площадь объекта 200–400 м²", "от 96 ₽/м²"],
      ["Площадь объекта 400–700 м²", "от 84 ₽/м²"],
      ["Площадь объекта от 1000 м²", "от 72 ₽/м²"],
    ],
  },
  "pozharnaya-bezopasnost": {
    title: "Проектирование системы пожарной безопасности",
    rows: [
      ["Площадь объекта до 500 м²", "от 39000 ₽"],
      ["Площадь объекта 500–1000 м²", "от 52000 ₽"],
      ["Площадь объекта 1000–3000 м²", "от 55250 ₽"],
      ["Площадь объекта от 5000 м²", "от 109200 ₽"],
    ],
  },
  "okhrannaya-signalizatsiya": {
    title: "Проектирование системы охранной сигнализации",
    rows: [
      ["Площадь объекта до 500 м²", "от 26000 ₽"],
      ["Площадь объекта 500–1000 м²", "от 32500 ₽"],
      ["Площадь объекта 1000–3000 м²", "от 41080 ₽"],
      ["Площадь объекта от 5000 м²", "от 80730 ₽"],
    ],
  },
  "kompleksnye-sistemy-bezopasnosti": {
    title: "Проектирование комплексных систем безопасности",
    rows: [
      ["до 5 точек доступа / до 100 м²", "от 7800 ₽"],
      ["до 10 точек доступа / до 500 м²", "от 12000 ₽"],
      ["более 10 точек доступа / от 1000 м²", "от 22000 ₽"],
    ],
  },
};

const PRICE_MAINTAIN: Record<string, PriceBlock> = {
  "skud": {
    title: "Техническое обслуживание СКУД",
    rows: [
      ["Обслуживание оборудования СКУД", "от 3000 ₽"],
      ["Обслуживание шлагбаума", "от 3000 ₽"],
      ["Обслуживание турникета", "от 3500 ₽"],
      ["Обслуживание домофона", "от 500 ₽"],
    ],
  },
  "videonablyudenie": {
    title: "Техническое обслуживание систем видеонаблюдения",
    rows: [
      ["До 8 камер", "от 400 ₽/камера"],
      ["От 8 до 16 камер", "от 350 ₽/камера"],
      ["От 16 до 32 камер", "от 300 ₽/камера"],
      ["От 64 до 150 камер", "от 200 ₽/камера"],
    ],
  },
  "pozharnaya-bezopasnost": {
    title: "Техническое обслуживание системы пожарной безопасности",
    rows: [
      ["До 10 ед. оборудования", "от 3000 ₽"],
      ["От 10 до 20 ед. оборудования", "от 3500 ₽"],
      ["От 30 до 50 ед. оборудования", "от 4800 ₽"],
      ["От 100 до 200 ед. оборудования", "от 9500 ₽"],
    ],
  },
  "okhrannaya-signalizatsiya": {
    title: "Техническое обслуживание охранной сигнализации",
    rows: [
      ["До 10 ед. оборудования", "от 3000 ₽"],
      ["От 10 до 20 ед. оборудования", "от 3500 ₽"],
      ["От 30 до 50 ед. оборудования", "от 4800 ₽"],
      ["От 100 до 200 ед. оборудования", "от 9500 ₽"],
    ],
  },
  "kompleksnye-sistemy-bezopasnosti": {
    title: "Техническое обслуживание комплексных систем",
    rows: [
      ["До 10 ед. оборудования", "от 3000 ₽"],
      ["От 10 до 30 ед. оборудования", "от 4000 ₽"],
      ["От 100 ед. оборудования", "от 9500 ₽"],
    ],
  },
};

function detectTab(subslug: string): "design" | "install" | "maintain" | null {
  if (subslug.includes("proektirovanie")) return "design";
  if (subslug.includes("montazh") || subslug.includes("ustanovka")) return "install";
  if (subslug.includes("obsluzhivanie")) return "maintain";
  return null;
}

interface Props {
  settings: SettingsMap;
  service: ServiceDetail;
  subslug: string;
  pageTitle: string;
}

export default function SubServicePageClient({ settings, service, subslug, pageTitle }: Props) {
  const [modal, setModal] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const heroImage = HERO_IMAGES[service.slug];
  const detectedTab = detectTab(subslug);

  const tabContent: Record<string, string | null> = {
    design: service.content_design,
    install: service.content_install,
    maintain: service.content_maintain,
  };

  const tabLabels: Record<string, string> = {
    design: "проектирование",
    install: "монтаж",
    maintain: "обслуживание",
  };

  const content = (detectedTab ? tabContent[detectedTab] : null) || SUBPAGE_TEXTS[subslug] || service.description || null;
  const tabLabel = detectedTab ? tabLabels[detectedTab] : "";

  const deviceSection = DEVICE_SECTIONS[service.slug];
  const capabilities = CAPABILITIES[service.slug];

  // Pick the relevant price block; fallback to install when no tab detected
  let priceBlock: PriceBlock | null = null;
  if (detectedTab === "install") priceBlock = PRICE_INSTALL[service.slug] || null;
  else if (detectedTab === "design") priceBlock = PRICE_DESIGN[service.slug] || null;
  else if (detectedTab === "maintain") priceBlock = PRICE_MAINTAIN[service.slug] || null;
  else priceBlock = PRICE_INSTALL[service.slug] || null; // default fallback

  return (
    <>
      <Header settings={settings} onModal={setModal} />
      <main>
        {/* Hero */}
        <section className="section section--start section--start-flex-start no-overlap">
          {heroImage && <img className="start-image" src={heroImage} alt={pageTitle} />}
          <div className="wrapper">
            <ul className="breadcrumbs">
              <li className="breadcrumbs__item">
                <Link className="breadcrumbs__item-link" href="/">Главная</Link>
              </li>
              <li className="breadcrumbs__item">
                <Link className="breadcrumbs__item-link" href="/services">Наши услуги</Link>
              </li>
              <li className="breadcrumbs__item">
                <Link className="breadcrumbs__item-link" href={`/services/${service.slug}`}>{service.title}</Link>
              </li>
              <li className="breadcrumbs__item current"><span>{pageTitle}</span></li>
            </ul>
            <h1>{pageTitle}</h1>
            {content ? (
              <div className="start-text mw-50-desktop">
                <p>{content}</p>
              </div>
            ) : service.description ? (
              <div className="start-text mw-50-desktop">
                <p>{service.description}</p>
              </div>
            ) : null}
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

        {/* Price table */}
        {priceBlock && (
          <section className="section overflow-hidden">
            <div className="wrapper">
              <h2>Стоимость услуги</h2>
              <p style={{ marginTop: "1rem", color: "var(--colorTextMuted)", fontSize: "0.9rem" }}>
                Цены, представленные на сайте, являются ориентировочными и могут быть изменены в зависимости от функционала системы, требований заказчика, типа объекта и других факторов. Для получения индивидуального расчёта позвоните нам или оставьте заявку на сайте.
              </p>
              <div style={{ marginTop: "2rem" }}>
                <h3 style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>{priceBlock.title}</h3>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr>
                        <th style={{ textAlign: "left", padding: "0.75rem 1rem", borderBottom: "1px solid var(--colorBorder)", fontWeight: 700 }}>Наименование работ</th>
                        <th style={{ textAlign: "right", padding: "0.75rem 1rem", borderBottom: "1px solid var(--colorBorder)", fontWeight: 700, whiteSpace: "nowrap" }}>Стоимость</th>
                      </tr>
                    </thead>
                    <tbody>
                      {priceBlock.rows.map(([name, price]) => (
                        <tr key={name} style={{ borderBottom: "1px solid var(--colorLight)" }}>
                          <td style={{ padding: "0.75rem 1rem" }}>{name}</td>
                          <td style={{ padding: "0.75rem 1rem", textAlign: "right", whiteSpace: "nowrap", color: "var(--colorMain)", fontWeight: 500 }}>{price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div style={{ marginTop: "1.5rem" }}>
                <div className="button-anim">
                  <span className="button-anim__circle"></span>
                  <button className="button button--primary" onClick={() => setModal("order")}>
                    <span>Получить расчёт стоимости</span>
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Device components section */}
        {deviceSection && (
          <section className="section overflow-hidden no-overlap">
            <div className="wrapper">
              <h2>{deviceSection.title}</h2>
              <div className="section-desc text-styles" style={{ marginTop: "0.5rem" }}>
                <p>{deviceSection.desc}</p>
              </div>
              <div className="grid-cols grid-cols--3 grid-cols--tab-2col" style={{ marginTop: "2rem" }}>
                {deviceSection.items.map((item) => (
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

        {/* Capabilities section */}
        {capabilities && (
          <section className="section overflow-hidden no-overlap">
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

        {/* Service stages */}
        <section className="section section--dark no-overlap section--stages-line">
          <div className="wrapper">
            <h2>Этапы оказания услуги</h2>
          </div>
          <div className="stages-container">
            <div className="stages">
              <div className="stage-item stage-item--spacer"><div className="stage-item__top"></div></div>
              {SERVICE_STAGES.map((stage, i) => (
                <div key={stage.title} className="stage-item">
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

        {/* FAQ */}
        <section className="section no-overlap overflow-hidden">
          <div className="wrapper">
            <h2>Вопросы и ответы</h2>
            <div className="section-desc text-styles" style={{ marginTop: "0.5rem" }}>
              <p>Собрали для вас ответы на часто задаваемые вопросы.</p>
            </div>
            <div style={{ marginTop: "2rem" }}>
              {[
                { q: `Что входит в услугу «${pageTitle}»?`, a: `Услуга включает все необходимые работы: от консультации и обследования объекта до монтажа и пуско-наладки. Специалисты «СИГМА-ПРОФИ» подберут оптимальное решение под ваши задачи.` },
                { q: "Как рассчитывается стоимость?", a: "Стоимость зависит от площади объекта, количества точек, сложности работ и выбранного оборудования. Для точного расчёта оставьте заявку — мы свяжемся и подготовим коммерческое предложение." },
                { q: "Как долго выполняется услуга?", a: "Сроки зависят от масштаба проекта. После обследования объекта мы назовём точные сроки выполнения работ." },
                { q: "Предоставляете ли вы гарантию?", a: "Да, на все выполненные работы предоставляется гарантия. Также мы готовы взять систему на техническое обслуживание после установки." },
              ].map((faq, i) => (
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

        {/* Back to service / other services */}
        <section className="section section--dark overflow-hidden">
          <div className="wrapper">
            <h2>Другие услуги по направлению</h2>
            <div className="grid-cols grid-cols--3 grid-cols--tab-2col" style={{ marginTop: "1.5rem" }}>
              <div className="grid-cols__col">
                <div className="tile tile--dark h-100">
                  <div className="tile__name tile__name--sm-font">
                    <Link href={`/services/${service.slug}`}>{service.title} — полный обзор</Link>
                  </div>
                </div>
              </div>
              <div className="grid-cols__col">
                <div className="tile tile--dark h-100">
                  <div className="tile__name tile__name--sm-font">
                    <Link href="/services">Все услуги компании</Link>
                  </div>
                </div>
              </div>
              <div className="grid-cols__col">
                <div className="tile tile--dark h-100 cta-small">
                  <div className="cta-small__top">
                    <div className="cta-small__title">Индивидуальный расчёт</div>
                    <div className="cta-small__desc">Оставьте заявку и получите коммерческое предложение</div>
                  </div>
                  <div className="button-anim button-anim--hover-light">
                    <span className="button-anim__circle"></span>
                    <button className="button button--primary" onClick={() => setModal("consult")}>
                      <span>Бесплатная консультация</span>
                    </button>
                  </div>
                </div>
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
