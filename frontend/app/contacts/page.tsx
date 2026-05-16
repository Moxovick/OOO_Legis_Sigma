import { getSettings, settingsToMap } from "@/lib/api";
import PageClient from "./PageClient";

export const revalidate = 0;

export async function generateMetadata() {
  return {
    title: 'Контакты — ООО ЧОП "Сигма-Профи"',
    description: "Контакты компании Сигма-Профи: телефон, email, адрес офиса, время работы.",
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
