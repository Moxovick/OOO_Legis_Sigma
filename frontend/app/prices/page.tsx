import { getSettings, settingsToMap } from "@/lib/api";
import PageClient from "./PageClient";

export const revalidate = 86400;

export async function generateMetadata() {
  return {
    title: 'Цены на услуги — ООО ЧОП "Сигма-Профи"',
    description: "Стоимость услуг по монтажу и обслуживанию систем безопасности. Индивидуальный расчёт.",
  };
}

export default async function PricesPage() {
  try {
    const settings = settingsToMap(await getSettings());
    return <PageClient settings={settings} />;
  } catch {
    return <PageClient settings={{}} />;
  }
}
