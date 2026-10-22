import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import type { PromoPopup } from "../types/site";

interface SitePromoPopupProps {
  popups: PromoPopup[];
}

type PromoPhase = "teaser" | "detail";

const ROTATE_MS = 5000;
const SWAP_MS = 420;

export function SitePromoPopup({ popups }: SitePromoPopupProps) {
  const titleId = useId();
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<PromoPhase>("teaser");
  const [stackIn, setStackIn] = useState(false);
  const [slideIn, setSlideIn] = useState(true);
  const [detailIn, setDetailIn] = useState(false);

  const popupKey = popups.map((p) => p.id).join("|");
  const safeIndex = popups.length ? index % popups.length : 0;
  const current = popups[safeIndex] ?? null;
  const canRotate = popups.length > 1 && phase === "teaser";

  useEffect(() => {
    setIndex(0);
    setStackIn(false);
    setSlideIn(true);
    const t = window.setTimeout(() => setStackIn(true), 60);
    return () => window.clearTimeout(t);
  }, [popupKey]);

  useEffect(() => {
    if (index >= popups.length) setIndex(0);
  }, [index, popups.length]);

  useEffect(() => {
    if (!canRotate) return;
    let swapTimer = 0;
    const tick = window.setInterval(() => {
      setSlideIn(false);
      window.clearTimeout(swapTimer);
      swapTimer = window.setTimeout(() => {
        setIndex((i) => (i + 1) % popups.length);
        setSlideIn(true);
      }, SWAP_MS);
    }, ROTATE_MS);
    return () => {
      window.clearInterval(tick);
      window.clearTimeout(swapTimer);
    };
  }, [canRotate, popups.length, popupKey]);

  useEffect(() => {
    if (phase !== "detail" || !current) {
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
  }, [phase, current]);

  if (!popups.length || !current) return null;

  const kindLabel = current.kind === "festival" ? "Festival offer" : "Today’s update";
  const teaserLine = current.highlight || current.title;
  const shortLine = teaserLine.length > 36 ? `${teaserLine.slice(0, 34)}…` : teaserLine;

  const collapseDetail = () => {
    setDetailIn(false);
    window.setTimeout(() => setPhase("teaser"), 280);
  };

  const openDetail = () => setPhase("detail");

  const goTo = (next: number) => {
    if (next === safeIndex) return;
    setSlideIn(false);
    window.setTimeout(() => {
      setIndex(next);
      setSlideIn(true);
    }, SWAP_MS);
  };

  return createPortal(
    <>
      <div
        className={`promo-teaser-stack${stackIn && phase === "teaser" ? " is-in" : ""}${
          phase === "detail" ? " is-hidden" : ""
        }`}
        role="complementary"
        aria-label="Offers and updates"
        aria-live="polite"
      >
        <div className={`promo-teaser${slideIn ? " is-slide-in" : " is-slide-out"}`}>
          <button
            type="button"
            className="promo-teaser__hit"
            onClick={openDetail}
            aria-expanded={phase === "detail"}
          >
            {current.highlight ? (
              <span className="promo-teaser__deal" aria-hidden="true">
                {current.highlight}
              </span>
            ) : current.imageUrl ? (
              <span className="promo-teaser__thumb">
                <img src={current.imageUrl} alt="" loading="eager" decoding="async" />
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

        {popups.length > 1 ? (
          <div className="promo-teaser__dots" role="tablist" aria-label="Popup list">
            {popups.map((p, i) => (
              <button
                key={p.id}
                type="button"
                role="tab"
                className={`promo-teaser__dot-btn${i === safeIndex ? " is-active" : ""}`}
                aria-selected={i === safeIndex}
                aria-label={`Show ${p.highlight || p.title || `offer ${i + 1}`}`}
                onClick={() => goTo(i)}
              />
            ))}
          </div>
        ) : null}
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

            {current.imageUrl ? (
              <div className="promo-popup__media">
                <img src={current.imageUrl} alt="" loading="eager" decoding="async" />
                <div className="promo-popup__media-shade" aria-hidden="true" />
                {current.highlight ? (
                  <div className="promo-popup__stamp" aria-hidden="true">
                    <span className="promo-popup__stamp-ring" />
                    <span className="promo-popup__stamp-text">{current.highlight}</span>
                  </div>
                ) : (
                  <span className="promo-popup__badge">{kindLabel}</span>
                )}
              </div>
            ) : current.highlight ? (
              <div className="promo-popup__hero-deal">
                <div className="promo-popup__stamp promo-popup__stamp--solo" aria-hidden="true">
                  <span className="promo-popup__stamp-ring" />
                  <span className="promo-popup__stamp-text">{current.highlight}</span>
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
                {current.title}
              </h2>
              {current.message ? <p className="promo-popup__copy">{current.message}</p> : null}
            </div>
          </div>
        </div>
      ) : null}
    </>,
    document.body
  );
}
