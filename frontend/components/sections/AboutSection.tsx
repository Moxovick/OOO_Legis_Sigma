"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { SettingsMap, Stat, Partner } from "@/types";

interface Props {
  settings: SettingsMap;
  stats: Stat[];
  partners: Partner[];
}

function CountUp({ target }: { target: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [started, setStarted] = useState(false);

  const numericPart = parseInt(target.replace(/\D/g, ""), 10) || 0;
  const suffix = target.replace(/[\d]/g, "");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const el = ref.current;
    if (!el) return;
    let start = 0;
    const duration = 1500;
    const step = 16;
    const totalSteps = duration / step;
    const increment = numericPart / totalSteps;
    const interval = setInterval(() => {
      start += increment;
      if (start >= numericPart) {
        el.textContent = String(numericPart);
        clearInterval(interval);
      } else {
        el.textContent = String(Math.floor(start));
      }
    }, step);
    return () => clearInterval(interval);
  }, [started, numericPart]);

  return (
    <div className="nums__item-value">
      <span ref={ref}>{numericPart}</span>{suffix}
    </div>
  );
}

export default function AboutSection({ settings, stats, partners }: Props) {
  return (
    <section className="section section--dark section--about">
      <img className="section-about-image" src="/images/team-sigma.png" width={1040} height={640} alt="" />
      <div className="wrapper">
        <div className="about-block">
          <div className="text-styles">
            <h2>{settings.about_title || "Технические средства безопасности"}</h2>
            <p>{settings.about_text}</p>
            <div className="button-anim">
              <span className="button-anim__circle"></span>
              <Link className="button button--primary" href="/about">
                <span>О компании</span>
              </Link>
            </div>
          </div>
        </div>

        {stats.length > 0 && (
          <div className="spacing-y">
            <div className="js-nums-frame-holder nums">
              <div className="nums__frame">
                <div className="nums__frame-inner"></div>
                <div className="nums__frame-glare"></div>
              </div>
              {stats.map((stat) => (
                <div key={stat.id} className="nums__item">
                  <CountUp target={stat.value} />
                  <div className="nums__item-name">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {partners.length > 0 && (
          <div className="spacing-y">
            <h2>Нам доверяют</h2>
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(partners.length, 6)}, 1fr)`, gap: "1.25rem 0" }}>
              {partners.map((partner) => (
                <div key={partner.id} className="partner-item">
                  {partner.logo_url ? (
                    <img src={partner.logo_url} alt={partner.name} />
                  ) : (
                    <span style={{ opacity: 0.6, fontSize: "1rem" }}>{partner.name}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
