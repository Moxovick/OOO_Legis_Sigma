import type { SettingsMap } from "@/types";

interface Props {
  settings: SettingsMap;
}

export default function ContactsSection({ settings }: Props) {
  return (
    <section className="section section--dark section--contacts">
      <div className="section-glare section-glare--1 section-glare--anim-to-r"></div>
      <div className="wrapper">
        <h2>Контакты</h2>
        <div className="grid-cols grid-cols--4">
          <div className="grid-cols__col">
            <a className="tile tile--dark tile--minh-1 tile--between tile--hover-2" href={settings.phone_href}>
              <div className="tile__top">
                <div className="tile__name tile__name--sm">
                  <svg width="24" height="24"><use href="/images/sprite-2.svg?v=2#phone"></use></svg>
                  Телефон
                </div>
              </div>
              <div className="tile__bottom"><div>{settings.phone}</div></div>
            </a>
          </div>
          <div className="grid-cols__col">
            <a className="tile tile--dark tile--minh-1 tile--between tile--hover-2" href={`mailto:${settings.email}`}>
              <div className="tile__top">
                <div className="tile__name tile__name--sm">
                  <svg width="24" height="24"><use href="/images/sprite-3.svg?v=3#mail"></use></svg>
                  Email
                </div>
              </div>
              <div className="tile__bottom"><span>{settings.email}</span></div>
            </a>
          </div>
          <div className="grid-cols__col">
            <div className="tile tile--dark tile--minh-1 tile--between tile--hover-2">
              <div className="tile__top">
                <div className="tile__name tile__name--sm">
                  <svg width="24" height="24"><use href="/images/sprite-4.svg?v=4#time"></use></svg>
                  Время работы
                </div>
              </div>
              <div className="tile__bottom">
                <div>{settings.work_hours_weekdays}.</div>
                <div>{settings.work_hours_friday}</div>
              </div>
            </div>
          </div>
          <div className="grid-cols__col">
            <div className="tile tile--dark tile--minh-1 tile--between tile--hover-2">
              <div className="tile__top">
                <div className="tile__name tile__name--sm">
                  <svg width="24" height="24"><use href="/images/sprite-5.svg?v=5#pin"></use></svg>
                  Адрес
                </div>
              </div>
              <div className="tile__bottom"><div>{settings.address}</div></div>
            </div>
          </div>
        </div>
      </div>
      <div className="map" id="map">
        <iframe
          src={`https://yandex.ru/map-widget/v1/?ll=${settings.map_lon || "37.635556"},${settings.map_lat || "55.757222"}&z=16&pt=${settings.map_lon || "37.635556"},${settings.map_lat || "55.757222"},pm2rdm`}
          width="100%"
          height="520"
          style={{ border: 0, display: "block" }}
          allowFullScreen
          loading="lazy"
          title="Карта"
        />
      </div>
    </section>
  );
}
