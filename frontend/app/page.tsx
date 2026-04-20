import { getSettings, getServices, getOffers, getPartners, getStats, settingsToMap } from "@/lib/api";
import HomeClient from "./HomeClient";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [rawSettings, services, offers, partners, stats] = await Promise.allSettled([
    getSettings(),
    getServices(),
    getOffers(),
    getPartners(),
    getStats(),
  ]);

  return (
    <HomeClient
      settings={rawSettings.status === "fulfilled" ? settingsToMap(rawSettings.value) : {}}
      services={services.status === "fulfilled" ? services.value : []}
      offers={offers.status === "fulfilled" ? offers.value : []}
      partners={partners.status === "fulfilled" ? partners.value : []}
      stats={stats.status === "fulfilled" ? stats.value : []}
    />
  );
}
