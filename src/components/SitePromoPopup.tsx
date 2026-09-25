import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import type { PromoPopup } from "../types/site";

interface SitePromoPopupProps {
  popup: PromoPopup;
}

type PromoPhase = "teaser" | "detail";

export function SitePromoPopup({ popup }: SitePromoPopupProps) {
  const titleId = useId();
  const [phase, setPhase] = useState<PromoPhase>("teaser");
  const [teaserIn, setTeaserIn] = useState(false);
  const [detailIn, setDetailIn] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setTeaserIn(true), 60);
    return () => window.clearTimeout(t);
  }, [popup.id]);

  useEffect(() => {
    if (phase !== "detail") {
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
  }, [phase]);

  const collapseDetail = () => {
    setDetailIn(false);
    window.setTimeout(() => setPhase("teaser"), 280);
  };

  const openDetail = () => setPhase("detail");

  const kindLabel = popup.kind === "festival" ? "Festival offer" : "Today’s update";
  const teaserLine = popup.highlight || popup.title;
  const shortLine = teaserLine.length > 36 ? `${teaserLine.slice(0, 34)}…` : teaserLine;

  return createPortal(
    <>
      <div
        className={`promo-teaser${teaserIn && phase === "teaser" ? " is-in" : ""}${phase === "detail" ? " is-hidden" : ""}`}
        role="complementary"
        aria-label={kindLabel}
      >
        <button type="button" className="promo-teaser__hit" onClick={openDetail} aria-expanded={phase === "detail"}>
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

      {phase === "detail" ? (
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

            {popup.imageUrl ? (
              <div className="promo-popup__media">
                <img src={popup.imageUrl} alt="" loading="eager" decoding="async" />
                <div className="promo-popup__media-shade" aria-hidden="true" />
                {popup.highlight ? (
                  <div className="promo-popup__stamp" aria-hidden="true">
                    <span className="promo-popup__stamp-ring" />
                    <span className="promo-popup__stamp-text">{popup.highlight}</span>
                  </div>
                ) : (
                  <span className="promo-popup__badge">{kindLabel}</span>
                )}
              </div>
            ) : popup.highlight ? (
              <div className="promo-popup__hero-deal">
                <div className="promo-popup__stamp promo-popup__stamp--solo" aria-hidden="true">
                  <span className="promo-popup__stamp-ring" />
                  <span className="promo-popup__stamp-text">{popup.highlight}</span>
                </div>
              </div>
            ) : (
              <div className="promo-popup__badge-row">
                <span className="promo-popup__badge">{kindLabel}</span>
              </div>
            )}

            <div className="promo-popup__body">
              <p className="promo-popup__kind">{kindLabel}</p>
              <h2 id={titleId} className="promo-popup__title">
                {popup.title}
              </h2>
              {popup.message ? <p className="promo-popup__copy">{popup.message}</p> : null}
            </div>
          </div>
        </div>
      ) : null}
    </>,
    document.body
  );
}
