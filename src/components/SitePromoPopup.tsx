import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import type { PromoPopup } from "../types/site";

interface SitePromoPopupProps {
  popups: PromoPopup[];
}

type PromoPhase = "teaser" | "detail";

export function SitePromoPopup({ popups }: SitePromoPopupProps) {
  const titleId = useId();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [phase, setPhase] = useState<PromoPhase>("teaser");
  const [teaserIn, setTeaserIn] = useState(false);
  const [detailIn, setDetailIn] = useState(false);

  const active = popups.find((p) => p.id === activeId) ?? null;

  const popupKey = popups.map((p) => p.id).join("|");

  useEffect(() => {
    setTeaserIn(false);
    const t = window.setTimeout(() => setTeaserIn(true), 60);
    return () => window.clearTimeout(t);
  }, [popupKey]);

  useEffect(() => {
    if (!active || !popups.some((p) => p.id === active.id)) {
      setActiveId(null);
      setPhase("teaser");
    }
  }, [popups, active]);

  useEffect(() => {
    if (phase !== "detail" || !active) {
      setDetailIn(false);
      document.body.style.overflow = "";
      return;
    }
    const t = window.setTimeout(() => setDetailIn(true), 30);
    const scrollY = window.scrollY;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = prev;
      window.scrollTo(0, scrollY);
    };
  }, [phase, active]);

  if (!popups.length) return null;

  const collapseDetail = () => {
    setDetailIn(false);
    window.setTimeout(() => {
      setPhase("teaser");
      setActiveId(null);
    }, 280);
  };

  const openDetail = (popup: PromoPopup) => {
    setActiveId(popup.id);
    setPhase("detail");
  };

  return createPortal(
    <>
      <div
        className={`promo-teaser-stack${teaserIn && phase === "teaser" ? " is-in" : ""}${
          phase === "detail" ? " is-hidden" : ""
        }`}
        role="complementary"
        aria-label="Offers and updates"
      >
        {popups.map((popup) => {
          const kindLabel = popup.kind === "festival" ? "Festival offer" : "Today’s update";
          const teaserLine = popup.highlight || popup.title;
          const shortLine = teaserLine.length > 36 ? `${teaserLine.slice(0, 34)}…` : teaserLine;
          return (
            <div key={popup.id} className="promo-teaser">
              <button
                type="button"
                className="promo-teaser__hit"
                onClick={() => openDetail(popup)}
                aria-expanded={phase === "detail" && activeId === popup.id}
              >
                {popup.highlight ? (
                  <span className="promo-teaser__deal" aria-hidden="true">
                    {popup.highlight}
                  </span>
                ) : popup.imageUrl ? (
                  <span className="promo-teaser__thumb">
                    <img src={popup.imageUrl} alt="" loading="eager" decoding="async" />
                  </span>
                ) : (
                  <span className="promo-teaser__dot" aria-hidden="true" />
                )}
                <span className="promo-teaser__text">
                  <span className="promo-teaser__kicker">{kindLabel}</span>
                  <span className="promo-teaser__title">{shortLine}</span>
                </span>
                <span className="promo-teaser__chev" aria-hidden="true">
                  Details
                </span>
              </button>
            </div>
          );
        })}
      </div>

      {phase === "detail" && active ? (
        <div
          className={`promo-popup${detailIn ? " is-in" : ""}${!detailIn ? " is-out" : ""}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
        >
          <button
            type="button"
            className="promo-popup__backdrop"
            aria-label="Close offer details"
            onClick={collapseDetail}
          />
          <div className="promo-popup__sheet">
            <div className="promo-popup__glow" aria-hidden="true" />
            <div className="promo-popup__handle" aria-hidden="true" />
            <button type="button" className="promo-popup__close" onClick={collapseDetail} aria-label="Close">
              ×
            </button>

            {active.imageUrl ? (
              <div className="promo-popup__media">
                <img src={active.imageUrl} alt="" loading="eager" decoding="async" />
                <div className="promo-popup__media-shade" aria-hidden="true" />
                {active.highlight ? (
                  <div className="promo-popup__stamp" aria-hidden="true">
                    <span className="promo-popup__stamp-ring" />
                    <span className="promo-popup__stamp-text">{active.highlight}</span>
                  </div>
                ) : (
                  <span className="promo-popup__badge">
                    {active.kind === "festival" ? "Festival offer" : "Today’s update"}
                  </span>
                )}
              </div>
            ) : active.highlight ? (
              <div className="promo-popup__hero-deal">
                <div className="promo-popup__stamp promo-popup__stamp--solo" aria-hidden="true">
                  <span className="promo-popup__stamp-ring" />
                  <span className="promo-popup__stamp-text">{active.highlight}</span>
                </div>
              </div>
            ) : (
              <div className="promo-popup__badge-row">
                <span className="promo-popup__badge">
                  {active.kind === "festival" ? "Festival offer" : "Today’s update"}
                </span>
              </div>
            )}

            <div className="promo-popup__body">
              <p className="promo-popup__kind">
                {active.kind === "festival" ? "Festival offer" : "Today’s update"}
              </p>
              <h2 id={titleId} className="promo-popup__title">
                {active.title}
              </h2>
              {active.message ? <p className="promo-popup__copy">{active.message}</p> : null}
            </div>
          </div>
        </div>
      ) : null}
    </>,
    document.body
  );
}
