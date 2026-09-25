import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faGlobeAsia,
  faHouseChimney,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import type {
  DestinationGroup,
  SiteContent,
  Trip,
  TripCategoryKey,
  TripDeparture,
  TripPackageBundle,
} from "../types/site";
import { siteContent } from "../data/siteContent";
import { TripPhoto } from "./TripPhoto";
import { formatTripDate } from "../lib/parseSheetDate";

interface TripsSectionProps {
  trips: SiteContent["trips"];
}

function departureDisplayPrice(pkg: TripPackageBundle, dep: TripDeparture): number {
  return dep.pricePerPersonInr ?? pkg.pricePerPersonInr;
}

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

const CATEGORY_SHORT: Record<TripCategoryKey, string> = {
  international: "International",
  domestic: "Domestic",
  group: "Group",
};

export function TripDetailsModal({ trip, onClose }: { trip: Trip; onClose: () => void }) {
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
          <TripPhoto
            src={trip.coverImage}
            title={trip.title}
            subtitle={trip.location}
            alt={trip.title}
            loading="eager"
            tone="cover"
          />
          <div className="trip-modal-heroText">
            <span className="trip-chip">TRIP</span>
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
                    <TripPhoto
                      src={d.image || trip.coverImage}
                      title={d.title || trip.title}
                      subtitle={trip.location}
                      alt={`${trip.title} day ${d.day}`}
                      loading="lazy"
                      tone="day"
                      dayNumber={d.day}
                    />
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="trip-modal-card trip-modal-wide">
            <h3>Photos</h3>
            {(() => {
              const photos = trip.gallery.length ? trip.gallery : [trip.coverImage || ""];
              const count = photos.length <= 6 ? String(photos.length) : "many";
              return (
                <div className="trip-gallery trip-gallery--collage" data-gallery-count={count}>
                  {photos.map((src, gi) => (
                    <div className="trip-gallery__cell" key={`${src || "name"}-${gi}`}>
                      <TripPhoto
                        src={src}
                        title={trip.title}
                        subtitle={trip.location}
                        alt={`${trip.title} gallery ${gi + 1}`}
                        loading="lazy"
                        tone="gallery"
                      />
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        </section>
      </div>
    </div>,
    document.body
  );
}

export function TripsSection({ trips }: TripsSectionProps) {
  const [active, setActive] = useState<TripCategoryKey>("international");
  const [deckIndex, setDeckIndex] = useState(0);
  const [filterEnter, setFilterEnter] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const filterInit = useRef(true);

  const filtered = useMemo(
    () => (trips.destinations ?? []).filter((d) => d.category === active),
    [active, trips.destinations]
  );
  const activeLabel = useMemo(() => trips.categories.find((c) => c.key === active)?.label ?? "Destinations", [active, trips.categories]);
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

  const openDestination = (dest: DestinationGroup, index: number) => {
    if (index !== deckIndex) focusSlide(index);
    window.location.hash = `destination/${encodeURIComponent(dest.id)}`;
  };

  return (
    <section className="section section-trips" id="trips">
      <div className="section-head section-head--no-aside">
        <div>
          {/* <span className="eyebrow">{trips.eyebrow}</span> */}
          <h2 key={active} className="trip-title">
            {activeLabel}
          </h2>
        </div>
        {/* <p className="section-copy">{trips.copy}</p> */}
      </div>

      <div
        className="trip-toolbar trip-toolbar--filters"
        role="tablist"
        aria-label="Filter destinations by type"
      >
        {trips.categories.slice(0, 3).map((c) => {
          const selected = c.key === active;
          return (
            <button
              key={c.key}
              id={`trip-tab-${c.key}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls="trip-category-panel"
              className={`trip-filter trip-filter--${c.key}${selected ? " is-active" : ""}`}
              onClick={() => setActive(c.key)}
            >
              <span className="trip-filter__icon" aria-hidden="true">
                <CategoryIcon category={c.key} />
              </span>
              <span className="trip-filter__label">{CATEGORY_SHORT[c.key]}</span>
            </button>
          );
        })}
      </div>

      <div
        className={`trip-carousel${filterEnter ? " is-filter-enter" : ""}`}
        id="trip-category-panel"
        role="tabpanel"
        aria-labelledby={`trip-tab-${active}`}
        aria-label={`${activeLabel} list. Scroll left or right. Tap a card for trips.`}
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
          {filtered.map((d, i) => {
            const isActive = i === deckIndex;
            const isPrev = i === deckIndex - 1;
            const isNext = i === deckIndex + 1;
            return (
              <div
                key={`${active}-${d.id}`}
                className={`trip-carousel__slide${isActive ? " is-active" : ""}${isPrev ? " is-prev" : ""}${isNext ? " is-next" : ""}`}
                data-trip-slide=""
                style={{ ["--slide-i" as string]: i }}
              >
                <button
                  type="button"
                  className={`trip-card trip-card--image${isActive ? " is-focused" : " is-side"}`}
                  data-trip-card="true"
                  aria-current={isActive ? "true" : undefined}
                  aria-label={`View trips for ${d.title}`}
                  onClick={() => openDestination(d, i)}
                >
                  <div className="trip-thumb">
                    <TripPhoto
                      src={d.coverImage}
                      title={d.title}
                      subtitle={d.location}
                      alt={d.title}
                      loading="lazy"
                      tone="cover"
                    />
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
            {filtered.map((d, i) => (
              <span key={d.id} className={`trip-carousel__dot${deckIndex === i ? " is-active" : ""}`} />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

