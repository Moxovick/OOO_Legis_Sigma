import { getSettings, getService, settingsToMap } from "@/lib/api";
import { notFound } from "next/navigation";
import SubServicePageClient from "./PageClient";

export const revalidate = 86400;

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
      title: `${title} — Легис-Тех`,
      description: `${title} — профессиональные услуги от компании Легис-Тех`,
    };
  }
  try {
    const service = await getService(slug);
    return {
      title: `${service.title} — Легис-Тех`,
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
    notFound();
  }
}
