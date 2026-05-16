import { getSettings, getService, getServices, settingsToMap } from "@/lib/api";
import { notFound } from "next/navigation";
import ServicePageClient from "./PageClient";
import type { ServiceDetail } from "@/types";

export const revalidate = 0;

const KNOWN_SLUGS = [
  "skud",
  "videonablyudenie",
  "pozharnaya-bezopasnost",
  "okhrannaya-signalizatsiya",
  "kompleksnye-sistemy-bezopasnosti",
];

const FALLBACK_TITLES: Record<string, string> = {
  "skud": "СКУД — системы контроля и управления доступом",
  "videonablyudenie": "Видеонаблюдение",
  "pozharnaya-bezopasnost": "Пожарная безопасность",
  "okhrannaya-signalizatsiya": "Охранная сигнализация",
  "kompleksnye-sistemy-bezopasnosti": "Комплексные системы безопасности",
};

function makeFallbackService(slug: string): ServiceDetail {
  const title = FALLBACK_TITLES[slug] ?? slug;
  return {
    id: 0,
    slug,
    title,
    description: null,
    icon_url: null,
    image_url: null,
    sort_order: 0,
    is_active: true,
    meta_title: `${title} — Сигма-Профи`,
    meta_description: null,
    content_design: null,
    content_install: null,
    content_maintain: null,
  };
}

export async function generateStaticParams() {
  try {
    const services = await getServices();
    return services.map((s) => ({ slug: s.slug }));
  } catch {
    // Backend not available during build — return known slugs
    return KNOWN_SLUGS.map((slug) => ({ slug }));
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const service = await getService(slug);
    return {
      title: service.meta_title || `${service.title} — Сигма-Профи`,
      description: service.meta_description || service.description || "",
    };
  } catch {
    const title = FALLBACK_TITLES[slug];
    if (!title) return { title: "Услуга" };
    return { title: `${title} — Сигма-Профи` };
  }
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const [rawSettings, service] = await Promise.all([getSettings(), getService(slug)]);
    const settings = settingsToMap(rawSettings);
    return <ServicePageClient settings={settings} service={service} />;
  } catch {
    // Backend unavailable — render with fallback data if slug is known
    if (!KNOWN_SLUGS.includes(slug)) notFound();
    return <ServicePageClient settings={{}} service={makeFallbackService(slug)} />;
  }
}
