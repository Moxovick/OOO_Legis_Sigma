import { getSettings, getService, settingsToMap } from "@/lib/api";
import { notFound } from "next/navigation";
import SubServicePageClient from "./PageClient";
import type { ServiceDetail } from "@/types";

const KNOWN_SLUG_PARENTS: Record<string, string> = {
  "proektirovanie-skud": "skud",
  "montazh-skud": "skud",
  "obsluzhivanie-skud": "skud",
  "biometricheskie": "skud",
  "proektirovanie-videonablyudeniya": "videonablyudenie",
  "montazh-videonablyudeniya": "videonablyudenie",
  "obsluzhivanie-videonablyudeniya": "videonablyudenie",
  "proektirovanie-pozharnyh-sistem": "pozharnaya-bezopasnost",
  "montazh-pozharnyh-sistem": "pozharnaya-bezopasnost",
  "obsluzhivanie-pozharnyh-sistem": "pozharnaya-bezopasnost",
  "proektirovanie-signalizacii": "okhrannaya-signalizatsiya",
  "montazh-signalizacii": "okhrannaya-signalizatsiya",
  "obsluzhivanie-signalizacii": "okhrannaya-signalizatsiya",
  "proektirovanie-ksb": "kompleksnye-sistemy-bezopasnosti",
  "montazh-ksb": "kompleksnye-sistemy-bezopasnosti",
  "obsluzhivanie-ksb": "kompleksnye-sistemy-bezopasnosti",
};

const PARENT_TITLES: Record<string, string> = {
  "skud": "СКУД",
  "videonablyudenie": "Видеонаблюдение",
  "pozharnaya-bezopasnost": "Пожарная безопасность",
  "okhrannaya-signalizatsiya": "Охранная сигнализация",
  "kompleksnye-sistemy-bezopasnosti": "Комплексные системы безопасности",
};

function makeFallbackService(slug: string): ServiceDetail {
  const title = PARENT_TITLES[slug] ?? slug;
  return {
    id: 0, slug, title, description: null, icon_url: null, image_url: null,
    sort_order: 0, is_active: true, meta_title: null, meta_description: null,
    content_design: null, content_install: null, content_maintain: null,
  };
}

export const revalidate = 0;

const SUB_TITLES: Record<string, string> = {
  "proektirovanie-skud": "Проектирование СКУД",
  "montazh-skud": "Монтаж СКУД",
  "obsluzhivanie-skud": "Техническое обслуживание СКУД",
  "biometricheskie": "Биометрические системы",
  "proektirovanie-videonablyudeniya": "Проектирование видеонаблюдения",
  "montazh-videonablyudeniya": "Монтаж видеонаблюдения",
  "obsluzhivanie-videonablyudeniya": "Обслуживание видеонаблюдения",
  "proektirovanie-pozharnyh-sistem": "Проектирование пожарных систем",
  "montazh-pozharnyh-sistem": "Монтаж пожарных систем",
  "obsluzhivanie-pozharnyh-sistem": "Обслуживание пожарных систем",
  "proektirovanie-signalizacii": "Проектирование охранной сигнализации",
  "montazh-signalizacii": "Монтаж охранной сигнализации",
  "obsluzhivanie-signalizacii": "Обслуживание охранной сигнализации",
  "proektirovanie-ksb": "Проектирование комплексных систем",
  "montazh-ksb": "Монтаж комплексных систем",
  "obsluzhivanie-ksb": "Обслуживание комплексных систем",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; subslug: string }>;
}) {
  const { slug, subslug } = await params;
  const title = SUB_TITLES[subslug];
  if (title) {
    return {
      title: `${title} — Сигма-Профи`,
      description: `${title} — профессиональные услуги от компании Сигма-Профи`,
    };
  }
  try {
    const service = await getService(slug);
    return {
      title: `${service.title} — Сигма-Профи`,
      description: service.description || "",
    };
  } catch {
    return { title: "Услуга" };
  }
}

export default async function SubServicePage({
  params,
}: {
  params: Promise<{ slug: string; subslug: string }>;
}) {
  const { slug, subslug } = await params;
  try {
    const [rawSettings, service] = await Promise.all([
      getSettings(),
      getService(slug),
    ]);
    const settings = settingsToMap(rawSettings);
    const pageTitle = SUB_TITLES[subslug] || service.title;
    return (
      <SubServicePageClient
        settings={settings}
        service={service}
        subslug={subslug}
        pageTitle={pageTitle}
      />
    );
  } catch {
    // Backend unavailable — render with fallback if subslug is known
    const parentSlug = KNOWN_SLUG_PARENTS[subslug];
    if (!parentSlug) notFound();
    const pageTitle = SUB_TITLES[subslug] ?? subslug;
    return (
      <SubServicePageClient
        settings={{}}
        service={makeFallbackService(parentSlug)}
        subslug={subslug}
        pageTitle={pageTitle}
      />
    );
  }
}
