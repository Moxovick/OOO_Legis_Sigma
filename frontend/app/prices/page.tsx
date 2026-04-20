import { getSettings, settingsToMap } from "@/lib/api";
import PageClient from "./PageClient";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return {
    title: 'Цены на услуги — ООО "Легис-Тех"',
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
