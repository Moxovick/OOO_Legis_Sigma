"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import type { SettingsMap } from "@/types";
import Header from "./Header";
import Footer from "./Footer";

const Modal = dynamic(() => import("@/components/ui/Modal"), { ssr: false });

interface Props {
  settings: SettingsMap;
  children: React.ReactNode;
}

export default function SiteLayout({ settings, children }: Props) {
  const [modal, setModal] = useState<string | null>(null);

  return (
    <>
      <Header settings={settings} onModal={setModal} />
      <main>{children}</main>
      <Footer settings={settings} onModal={setModal} />
      <Modal type={modal} onClose={() => setModal(null)} />
    </>
  );
}
