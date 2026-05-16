import { getSettings, getServices, settingsToMap } from "@/lib/api";
import ServicesPageClient from "./PageClient";

export const revalidate = 0;

export async function generateMetadata() {
  return {
    title: 'Услуги — ООО ЧОП "Сигма-Профи"',
    description: "Все услуги компании Сигма-Профи: СКУД, видеонаблюдение, пожарная безопасность, охранная сигнализация.",
  };
}

export default async function ServicesPage() {
  try {
    const [rawSettings, services] = await Promise.allSettled([getSettings(), getServices()]);
    const settings = rawSettings.status === "fulfilled" ? settingsToMap(rawSettings.value) : {};
    const servicesList = services.status === "fulfilled" ? services.value : [];
    return <ServicesPageClient settings={settings} services={servicesList} />;
  } catch {
    return <ServicesPageClient settings={{}} services={[]} />;
  }
}
