import type { SettingsMap } from "@/types";

interface Props {
  settings: SettingsMap;
  onModal: (type: string) => void;
}

export default function Hero({ settings, onModal }: Props) {
  return (
    <section className="section section--start">
      <img className="start-image" src="/images/start_image.webp" alt="" />
      <div className="wrapper">
        <h1>{settings.hero_title || "Технические средства безопасности"}</h1>
        <div className="start-text">
          {settings.hero_text}
        </div>
        <div className="button-anim">
          <span className="button-anim__circle"></span>
          <button className="button button--primary" onClick={() => onModal("order")}>
            <span>Заказать услугу</span>
          </button>
        </div>
      </div>
    </section>
  );
}
