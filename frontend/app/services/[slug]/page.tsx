import { getSettings, getService, getServices, settingsToMap } from "@/lib/api";
import { notFound } from "next/navigation";
import ServicePageClient from "./PageClient";

export const revalidate = 86400;

export async function generateStaticParams() {
  try {
    const services = await getServices();
    return services.map((s) => ({ slug: s.slug }));
  } catch {
    // Backend not available during build — pages will be rendered on-demand
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const service = await getService(slug);
    return {
      title: service.meta_title || `${service.title} — Легис-Тех`,
      description: service.meta_description || service.description || "",
    };
  } catch {
    return { title: "Услуга" };
  }
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const [rawSettings, service] = await Promise.all([getSettings(), getService(slug)]);
    const settings = settingsToMap(rawSettings);
    return <ServicePageClient settings={settings} service={service} />;
  } catch {
    notFound();
  }
}
