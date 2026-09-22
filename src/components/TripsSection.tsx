import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight, faGlobeAsia, faHouseChimney, faUsers } from "@fortawesome/free-solid-svg-icons";
import type { SiteContent, Trip, TripCategoryKey, TripDeparture, TripPackageBundle } from "../types/site";
import { siteContent } from "../data/siteContent";
import { CollageImage } from "./CollageImage";
import { formatTripDate } from "../lib/parseSheetDate";

interface TripsSectionProps {
  trips: SiteContent["trips"];
  tripsLoading?: boolean;
  tripsError?: string | null;
}

function departureDisplayPrice(pkg: TripPackageBundle, dep: TripDeparture): number {
  return dep.pricePerPersonInr ?? pkg.pricePerPersonInr;
}

type TripDetailsState = { trip: Trip } | null;

function formatInr(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

function CategoryIcon({ category }: { category: TripCategoryKey }) {
  switch (category) {
    case "international":
      return <FontAwesomeIcon icon={faGlobeAsia} />;
    case "domestic":
      return <FontAwesomeIcon icon={faHouseChimney} />;
    case "group":
      return <FontAwesomeIcon icon={faUsers} />;
    default:
      return null;
  }
}

/** CSS rotate: 0° = up, clockwise. (x right, y down) from dial center. */
function needleToward(x: number, y: number) {
  let deg = (Math.atan2(x, -y) * 180) / Math.PI;
  if (deg < 0) deg += 360;
  return deg;
}

/** Icon centers in a horizontal row below the dial — keep in sync with CSS gap/size. */
const ICON_SPACING_PX = 48;
const ICONS_BELOW_PX = 82;

function TripCompass({
  categories,
  active,
  onSelect,
}: {
  categories: SiteContent["trips"]["categories"];
  active: TripCategoryKey;
  onSelect: (key: TripCategoryKey) => void;
}) {
  const items = categories.slice(0, 3);
  const activeIndex = Math.max(
    0,
    items.findIndex((c) => c.key === active)
  );
  const n = Math.max(items.length, 1);
  const x = (activeIndex - (n - 1) / 2) * ICON_SPACING_PX;
  const needleDeg = needleToward(x, ICONS_BELOW_PX);
  const [selecting, setSelecting] = useState(false);
  const prevActive = useRef(active);

  useEffect(() => {
    if (prevActive.current === active) return;
    prevActive.current = active;
    setSelecting(true);
    const t = window.setTimeout(() => setSelecting(false), 700);
    return () => window.clearTimeout(t);
  }, [active]);

  return (
    <div
      className={`trip-arc${selecting ? " is-selecting" : ""}`}
      role="tablist"
      aria-label="Trending destinations by category"
      style={{ ["--needle-deg" as string]: `${needleDeg}deg` }}
    >
      <div className="trip-arc__stage">
        <div className="trip-arc__dial" aria-hidden="true">
          <img
            className="trip-arc__logo"
            src="/logo.png"
            alt=""
            draggable={false}
          />
          <span className="trip-arc__cardinal trip-arc__cardinal--n">N</span>
          <span className="trip-arc__cardinal trip-arc__cardinal--e">E</span>
          <span className="trip-arc__cardinal trip-arc__cardinal--s">S</span>
          <span className="trip-arc__cardinal trip-arc__cardinal--w">W</span>
          <div className="trip-arc__arrow">
            <span className="trip-arc__arrow-head" />
            <span className="trip-arc__arrow-shaft" />
          </div>
          <span className="trip-arc__hub" />
        </div>
      </div>

      <div className="trip-arc__points">
        {items.map((c) => {
          const selected = c.key === active;
          return (
            <button
              key={c.key}
              id={`trip-tab-${c.key}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls="trip-category-panel"
              aria-label={c.label}
              title={c.label}
              className={`trip-arc__point${selected ? " is-active" : ""}`}
              onClick={() => onSelect(c.key)}
            >
              <span className="trip-arc__point-icon" aria-hidden="true">
                <CategoryIcon category={c.key} />
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function TripDetailsModal({ trip, onClose }: { trip: Trip; onClose: () => void }) {
  const [pkgKey, setPkgKey] = useState(trip.defaultPackageKey);
  const [pdfBusy, setPdfBusy] = useState(false);

  useEffect(() => {
    setPkgKey(trip.defaultPackageKey);
  }, [trip.id, trip.defaultPackageKey]);

  useEffect(() => {
    const scrollY = window.scrollY;
    const html = document.documentElement;
    const { body } = document;

    const prev = {
      htmlOverflow: html.style.overflow,
      htmlOverscroll: html.style.overscrollBehavior,
      bodyOverflow: body.style.overflow,
      bodyPosition: body.style.position,
      bodyTop: body.style.top,
      bodyLeft: body.style.left,
      bodyRight: body.style.right,
      bodyWidth: body.style.width,
      bodyTouch: body.style.touchAction,
      bodyOverscroll: body.style.overscrollBehavior,
    };

    html.classList.add("is-modal-open");
    html.style.overflow = "hidden";
    html.style.overscrollBehavior = "none";
    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
    body.style.touchAction = "none";
    body.style.overscrollBehavior = "none";

    return () => {
      html.classList.remove("is-modal-open");
      html.style.overflow = prev.htmlOverflow;
      html.style.overscrollBehavior = prev.htmlOverscroll;
      body.style.overflow = prev.bodyOverflow;
      body.style.position = prev.bodyPosition;
      body.style.top = prev.bodyTop;
      body.style.left = prev.bodyLeft;
      body.style.right = prev.bodyRight;
      body.style.width = prev.bodyWidth;
      body.style.touchAction = prev.bodyTouch;
      body.style.overscrollBehavior = prev.bodyOverscroll;
      window.scrollTo(0, scrollY);
    };
  }, []);

  const pkg = useMemo(
    () => trip.packages.find((p) => p.key === pkgKey) ?? trip.packages[0]!,
    [trip.packages, pkgKey]
  );
  const includes = pkg.includes ?? trip.includes;
  const excludes = pkg.excludes ?? trip.excludes;

  const onDownloadPdf = async () => {
    setPdfBusy(true);
    try {
      const { downloadTripBrochurePdf } = await import("../pdf/TripBrochureDocument");
      const generatedAt = new Date().toLocaleString("en-IN", { dateStyle: "long", timeStyle: "short" });
      await downloadTripBrochurePdf({
        trip,
        pkg,
        brandName: siteContent.brand.name,
        generatedAt,
      });
    } catch (e) {
      console.error(e);
      window.alert("Could not generate the PDF. Check your connection and try again.");
    } finally {
      setPdfBusy(false);
    }
  };

  return createPortal(
    <div className="trip-modal-backdrop" role="presentation" onMouseDown={onClose}>
      <div
        className="trip-modal"
        role="dialog"
        aria-modal="true"
        aria-label={`${trip.title} details`}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="trip-modal-actions">
          <button
            className="trip-modal-pdf"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              void onDownloadPdf();
            }}
            disabled={pdfBusy}
          >
            {pdfBusy ? "Preparing PDF…" : "Download PDF brochure"}
          </button>
          <button className="trip-modal-close" type="button" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <header className="trip-modal-hero">
          <CollageImage src={trip.coverImage} alt={trip.title} loading="eager" />
          <div className="trip-modal-heroText">
            <span className="trip-chip">{trip.category.toUpperCase()}</span>
            <h2>{trip.title}</h2>
            <p className="trip-muted">{trip.location}</p>
            <div className="trip-modal-meta">
              <span>
                {trip.durationDays}D/{trip.durationNights}N
              </span>
              <span>
                {pkg.label} · {formatInr(pkg.pricePerPersonInr)} / person
              </span>
            </div>
            <div className="trip-package-bar" role="tablist" aria-label="Package type">
              {trip.packages.map((p) => (
                <button
                  key={p.key}
                  type="button"
                  role="tab"
                  aria-selected={pkgKey === p.key}
                  className={`trip-package-pill ${pkgKey === p.key ? "is-active" : ""}`}
                  onClick={() => setPkgKey(p.key)}
                >
                  <span className="trip-package-pill__label">{p.label}</span>
                  <span className="trip-package-pill__price">{formatInr(p.pricePerPersonInr)}</span>
                </button>
              ))}
            </div>
          </div>
        </header>

        <section className="trip-modal-grid">
          <div className="trip-modal-card">
            <h3>Upcoming Dates</h3>
            <div className="trip-departures">
              {trip.departures.map((d) => (
                <article key={d.id} className="departure-row">
                  <div>
                    <strong>
                      {formatTripDate(d.startDate)} – {formatTripDate(d.endDate)}
                    </strong>
                    <div className="trip-muted">
                      {d.groupTrip ? "Group trip" : "Private trip"}
                      {d.groupTrip && typeof d.seatsLeft === "number" ? ` • Seats left: ${d.seatsLeft}` : ""}
                    </div>
                  </div>
                  <div className="departure-price">{formatInr(departureDisplayPrice(pkg, d))}</div>
                </article>
              ))}
            </div>
          </div>

          <div className="trip-modal-card">
            <h3>Highlights</h3>
            <ul className="trip-bullets">
              {trip.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          </div>

          <div className="trip-modal-card">
            <h3>Hotels</h3>
            <div className="trip-hotels">
              {pkg.hotels.map((h) => (
                <div key={`${h.city}-${h.name}`} className="hotel-row">
                  <div>
                    <strong>{h.name}</strong>
                    <div className="trip-muted">
                      {h.city} • {h.nights} night{h.nights === 1 ? "" : "s"}
                      {h.rating ? ` • ${h.rating}` : ""}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="trip-modal-card">
            <h3>Includes</h3>
            <ul className="trip-bullets">
              {includes.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </div>

          <div className="trip-modal-card">
            <h3>Excludes</h3>
            <ul className="trip-bullets">
              {excludes.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </div>

          <div className="trip-modal-card trip-modal-wide">
            <h3>Day-wise Itinerary</h3>
            <div className="itinerary-rows">
              {pkg.itinerary.map((d) => (
                <article key={`${pkgKey}-day-${d.day}`} className="itinerary-row">
                  <div className="itinerary-day">Day {d.day}</div>
                  <div className="itinerary-body">
                    <div className="itinerary-top">
                      <strong>{d.title}</strong>
                      <span className="trip-muted">{d.summary}</span>
                    </div>
                    <ul className="trip-bullets">
                      {d.activities.map((a) => (
                        <li key={a}>{a}</li>
                      ))}
                      {d.mealsIncluded?.length ? (
                        <li key="meals">
                          Meals: {d.mealsIncluded.join(", ")}
                        </li>
                      ) : null}
                    </ul>
                  </div>
                  <div className="itinerary-photo">
                    <CollageImage src={d.image} alt={`${trip.title} day ${d.day}`} loading="lazy" />
                  </div>
                </article>
              ))}
            </div>
          </div>

          {trip.gallery.length > 0 ? (
            <div className="trip-modal-card trip-modal-wide">
              <h3>Photos</h3>
              <div
                className="trip-gallery trip-gallery--collage"
                data-gallery-count={trip.gallery.length <= 6 ? String(trip.gallery.length) : "many"}
              >
                {trip.gallery.map((src, gi) => (
                  <div className="trip-gallery__cell" key={`${src}-${gi}`}>
                    <CollageImage src={src} alt={`${trip.title} gallery ${gi + 1}`} loading="lazy" />
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </section>
      </div>
    </div>,
    document.body
  );
}

export function TripsSection({ trips, tripsLoading, tripsError }: TripsSectionProps) {
  const [active, setActive] = useState<TripCategoryKey>("international");
  const [details, setDetails] = useState<TripDetailsState>(null);
  const [deckIndex, setDeckIndex] = useState(0);
  const [filterEnter, setFilterEnter] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const filterInit = useRef(true);

  const filtered = useMemo(() => trips.trips.filter((t) => t.category === active), [active, trips.trips]);
  const activeLabel = useMemo(() => trips.categories.find((c) => c.key === active)?.label ?? "Trips", [active, trips.categories]);
  const deckCount = filtered.length;

  useEffect(() => {
    setDeckIndex(0);
    const el = scrollerRef.current;
    if (el) el.scrollTo({ left: 0, behavior: "auto" });

    if (filterInit.current) {
      filterInit.current = false;
      return;
    }
    setFilterEnter(true);
    const t = window.setTimeout(() => setFilterEnter(false), 720);
    return () => window.clearTimeout(t);
  }, [active, deckCount]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const sync = () => {
      const slides = el.querySelectorAll<HTMLElement>("[data-trip-slide]");
      if (!slides.length) return;
      const mid = el.scrollLeft + el.clientWidth / 2;
      let best = 0;
      let bestDist = Infinity;
      slides.forEach((slide, i) => {
        const center = slide.offsetLeft + slide.offsetWidth / 2;
        const dist = Math.abs(center - mid);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      });
      setDeckIndex(best);
    };

    sync();
    el.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    return () => {
      el.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, [filtered]);

  const focusSlide = (index: number) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const slides = scroller.querySelectorAll<HTMLElement>("[data-trip-slide]");
    const slide = slides[index];
    if (!slide) return;

    setDeckIndex(index);
    const maxScroll = Math.max(0, scroller.scrollWidth - scroller.clientWidth);
    const target = slide.offsetLeft - (scroller.clientWidth - slide.offsetWidth) / 2;
    scroller.scrollTo({
      left: Math.max(0, Math.min(target, maxScroll)),
      behavior: "smooth",
    });
  };

  const openTrip = (trip: Trip, index: number) => {
    if (index !== deckIndex) focusSlide(index);
    setDetails({ trip });
  };

  return (
    <section className="section section-trips" id="trips">
      <div className="section-head section-head--no-aside">
        <div>
          {/* <span className="eyebrow">{trips.eyebrow}</span> */}
          <h2 key={active} className="trip-title">
            {activeLabel}
          </h2>
          {tripsLoading ? <p className="trips-sheet-status">Loading latest destinations…</p> : null}
          {tripsError ? (
            <p className="trips-sheet-status trips-sheet-status--error" role="status">
              {tripsError} Showing saved destinations.
            </p>
          ) : null}
        </div>
        {/* <p className="section-copy">{trips.copy}</p> */}
      </div>

      <div className="trip-toolbar trip-toolbar--compass">
        <TripCompass categories={trips.categories} active={active} onSelect={setActive} />
      </div>

      <div
        className="trip-toolbar trip-toolbar--tabs"
        role="tablist"
        aria-label="Trending destinations by category"
      >
        {trips.categories.slice(0, 3).map((c) => {
          const selected = c.key === active;
          return (
            <button
              key={c.key}
              id={`trip-tab-desk-${c.key}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls="trip-category-panel"
              className={`trip-cat-tab${selected ? " is-active" : ""}`}
              onClick={() => setActive(c.key)}
            >
              <span className="trip-cat-tab__icon" aria-hidden="true">
                <CategoryIcon category={c.key} />
              </span>
              <span>{c.label}</span>
            </button>
          );
        })}
      </div>

      <div
        className={`trip-carousel${filterEnter ? " is-filter-enter" : ""}`}
        id="trip-category-panel"
        role="tabpanel"
        aria-labelledby={`trip-tab-${active}`}
        aria-label={`${activeLabel} list. Scroll left or right. Tap a card for details.`}
      >
        {deckCount > 1 ? (
          <button
            type="button"
            className="trip-carousel__arrow trip-carousel__arrow--prev"
            aria-label="Previous destination"
            disabled={deckIndex <= 0}
            onClick={() => focusSlide(deckIndex - 1)}
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
        ) : null}

        <div ref={scrollerRef} className="trip-carousel__scroller">
          {filtered.map((t, i) => {
            const isActive = i === deckIndex;
            const isPrev = i === deckIndex - 1;
            const isNext = i === deckIndex + 1;
            return (
              <div
                key={`${active}-${t.id}`}
                className={`trip-carousel__slide${isActive ? " is-active" : ""}${isPrev ? " is-prev" : ""}${isNext ? " is-next" : ""}`}
                data-trip-slide=""
                style={{ ["--slide-i" as string]: i }}
              >
                <button
                  type="button"
                  className={`trip-card${isActive ? " is-focused" : " is-side"}`}
                  data-trip-card="true"
                  aria-current={isActive ? "true" : undefined}
                  aria-label={`View details for ${t.title}`}
                  onClick={() => openTrip(t, i)}
                >
                  <div className="trip-thumb">
                    <CollageImage src={t.coverImage} alt="" loading="lazy" />
                  </div>
                  <div className="trip-card-body">
                    <strong>{t.title}</strong>
                    <span className="trip-muted">{t.location}</span>
                    <div className="trip-meta">
                      <span>
                        {t.durationDays}D/{t.durationNights}N
                      </span>
                      <span>{formatInr(t.startingPricePerPersonInr)} / person</span>
                    </div>
                  </div>
                </button>
              </div>
            );
          })}
        </div>

        {deckCount > 1 ? (
          <button
            type="button"
            className="trip-carousel__arrow trip-carousel__arrow--next"
            aria-label="Next destination"
            disabled={deckIndex >= deckCount - 1}
            onClick={() => focusSlide(deckIndex + 1)}
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        ) : null}

        {deckCount > 1 ? (
          <div className="trip-carousel__dots" aria-hidden="true">
            {filtered.map((t, i) => (
              <span key={t.id} className={`trip-carousel__dot${deckIndex === i ? " is-active" : ""}`} />
            ))}
          </div>
        ) : null}
      </div>

      {details ? (
        <TripDetailsModal trip={details.trip} onClose={() => setDetails(null)} />
      ) : null}
    </section>
  );
}

