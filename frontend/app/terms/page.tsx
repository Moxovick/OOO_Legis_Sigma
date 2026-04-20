export const dynamic = "force-dynamic";

import { getSettings, settingsToMap } from "@/lib/api";
import PageClient from "./PageClient";

export async function generateMetadata() {
  return {
    title: 'Политика конфиденциальности — ООО "Легис-Тех"',
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
