import { getSettings, settingsToMap } from "@/lib/api";
import PageClient from "./PageClient";

export const revalidate = 86400;

export const metadata = {
  title: "Доставка документов и частные инкассации — Легис-Тех",
  description: "Профессиональная доставка документов и частные инкассации в Москве. Работаем максимально оперативно и безопасно. Охрана под каждый заказ.",
};

const BASE = process.env.BACKEND_URL || "http://localhost:8000";

async function getPageContent(slug: string): Promise<Record<string, unknown>> {
  try {
    const res = await fetch(`${BASE}/api/pages/${slug}`, { cache: "no-store" });
    if (!res.ok) return {};
    const json = await res.json();
    if (!json.data || json.data === "{}") return {};
    return JSON.parse(json.data);
  } catch {
    return {};
  }
}

export default async function Page() {
  const [settings, pageData] = await Promise.allSettled([
    getSettings(),
    getPageContent("dostavka-dokumentov"),
  ]);

  const settingsMap = settings.status === "fulfilled" ? settingsToMap(settings.value) : {};
  const content = pageData.status === "fulfilled" ? pageData.value : {};

  return <PageClient settings={settingsMap} pageData={content} />;
}
