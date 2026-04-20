import { getSettings, settingsToMap } from "@/lib/api";
import PageClient from "./PageClient";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return {
    title: 'Контакты — ООО "Легис-Тех"',
    description: "Контакты компании Легис-Тех: телефон, email, адрес офиса, время работы.",
  };
}

export default async function ContactsPage() {
  try {
    const settings = settingsToMap(await getSettings());
    return <PageClient settings={settings} />;
  } catch {
    return <PageClient settings={{}} />;
  }
}
