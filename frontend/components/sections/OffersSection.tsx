"use client";
import type { Offer } from "@/types";

const OFFER_IMAGE = "/upload/iblock/b97/50ufie6id1c5x3u3lh1d2gm602wme52j.png";

interface Props {
  offers: Offer[];
  onModal: (type: string) => void;
}

export default function OffersSection({ offers, onModal }: Props) {
  if (!offers.length) return null;

  return (
    <section className="section overflow-hidden">
      <div style={{ padding: "0 2rem" }}>
        <div className="offers-grid" style={{ display: "grid", gap: "1rem" }}>
          {offers.map((offer) => (
            <div
              key={offer.id}
              style={{
                position: "relative",
                borderRadius: "12px",
                overflow: "hidden",
                minHeight: "380px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                padding: "1.25rem",
                color: "#fff",
              }}
            >
              {/* Background image */}
              <img
                src={OFFER_IMAGE}
                alt=""
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  zIndex: 1,
                }}
              />
              {/* Dark gradient overlay */}
              <div style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.75) 100%)",
                zIndex: 2,
              }} />

              {/* Content */}
              <div style={{ position: "relative", zIndex: 3 }}>
                <div style={{
                  fontSize: "1.2rem",
                  fontWeight: 700,
                  lineHeight: 1.3,
                  marginBottom: offer.description ? "0.5rem" : "1rem",
                }}>
                  {offer.title}
                </div>
                {offer.description && (
                  <div style={{
                    fontSize: "1rem",
                    opacity: 0.85,
                    lineHeight: 1.5,
                    marginBottom: "1.25rem",
                  }}>
                    {offer.description}
                  </div>
                )}
                <button
                  onClick={() => onModal("contract")}
                  style={{
                    background: "#0034D8",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    padding: "0.75rem 1.25rem",
                    fontSize: "0.9rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    width: "100%",
                    fontFamily: "'NTSomic', -apple-system, BlinkMacSystemFont, sans-serif",
                    letterSpacing: "0.01em",
                    transition: "opacity 0.15s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.85"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
                >
                  Заключить договор
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
