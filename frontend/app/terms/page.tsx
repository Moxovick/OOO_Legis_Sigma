export const revalidate = 86400;

import { getSettings, settingsToMap } from "@/lib/api";
import PageClient from "./PageClient";

export async function generateMetadata() {
  return {
    title: 'Политика конфиденциальности — ООО "Сигма-Профи"',
  };
}

export default async function TermsPage() {
  try {
    const settings = settingsToMap(await getSettings());
    return <PageClient settings={settings} />;
  } catch {
    return <PageClient settings={{}} />;
  }
}
