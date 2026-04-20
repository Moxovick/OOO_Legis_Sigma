"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import type { SettingsMap, Service, Offer, Partner, Stat } from "@/types";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import ServicesSection from "@/components/sections/ServicesSection";
import OffersSection from "@/components/sections/OffersSection";
import AboutSection from "@/components/sections/AboutSection";
import ContactFormSection from "@/components/sections/ContactFormSection";
import ContactsSection from "@/components/sections/ContactsSection";

const Modal = dynamic(() => import("@/components/ui/Modal"), { ssr: false });

interface Props {
  settings: SettingsMap;
  services: Service[];
  offers: Offer[];
  partners: Partner[];
  stats: Stat[];
}

export default function HomeClient({ settings, services, offers, partners, stats }: Props) {
  const [modal, setModal] = useState<string | null>(null);

  return (
    <>
      <Header settings={settings} onModal={setModal} />
      <main>
        <Hero settings={settings} onModal={setModal} />
        <ServicesSection services={services} onModal={setModal} />
        <OffersSection offers={offers} onModal={setModal} />
        <AboutSection settings={settings} stats={stats} partners={partners} />

        {/* SEO text block */}
        {settings.seo_text && (
          <section className="section overflow-hidden">
            <div className="section-glare section-glare--2"></div>
            <div className="wrapper text-styles">
              <h2 className="text-normal">{settings.seo_text_title}</h2>
              <p>{settings.seo_text}</p>
            </div>
          </section>
        )}

        <ContactFormSection />
        <ContactsSection settings={settings} />
      </main>
      <Footer settings={settings} onModal={setModal} />
      <Modal type={modal} onClose={() => setModal(null)} />
    </>
  );
}
