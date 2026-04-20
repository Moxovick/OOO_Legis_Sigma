import { getSettings, getStats, getPartners, getServices, settingsToMap } from "@/lib/api";
import PageClient from "./PageClient";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return {
    title: 'О компании — ООО "Легис-Тех"',
    description: "О компании Легис-Тех: опыт, команда, реализованные проекты в области технических средств охраны.",
  };
}

export default async function AboutPage() {
  const [rawSettings, stats, partners, services] = await Promise.allSettled([
    getSettings(),
    getStats(),
    getPartners(),
    getServices(),
  ]);

  return (
    <PageClient
      settings={rawSettings.status === "fulfilled" ? settingsToMap(rawSettings.value) : {}}
      stats={stats.status === "fulfilled" ? stats.value : []}
      partners={partners.status === "fulfilled" ? partners.value : []}
      services={services.status === "fulfilled" ? services.value : []}
    />
  );
}
