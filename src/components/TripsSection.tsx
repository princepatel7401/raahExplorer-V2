import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobeAsia, faHouseChimney, faUsers } from "@fortawesome/free-solid-svg-icons";
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

function CategoryTab({
  active,
  label,
  category,
  onClick
}: {
  active: boolean;
  label: string;
  category: TripCategoryKey;
  onClick: () => void;
}) {
  const tabId = `trip-tab-${category}`;
  return (
    <button
      id={tabId}
      type="button"
      role="tab"
      aria-selected={active}
      aria-controls="trip-category-panel"
      className={`trip-tab ${active ? "is-active" : ""}`}
      onClick={onClick}
    >
      <span className="trip-tab-icon" aria-hidden="true">
        <CategoryIcon category={category} />
      </span>
      <span className="trip-tab-label">{label}</span>
    </button>
  );
}

function TripDetailsModal({ trip, onClose }: { trip: Trip; onClose: () => void }) {
  const [pkgKey, setPkgKey] = useState(trip.defaultPackageKey);
  const [pdfBusy, setPdfBusy] = useState(false);

  useEffect(() => {
    setPkgKey(trip.defaultPackageKey);
  }, [trip.id, trip.defaultPackageKey]);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    const prevTouch = document.body.style.touchAction;
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";
    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.touchAction = prevTouch;
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

  return (
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
    </div>
  );
}

export function TripsSection({ trips, tripsLoading, tripsError }: TripsSectionProps) {
  const [active, setActive] = useState<TripCategoryKey>("international");
  const [details, setDetails] = useState<TripDetailsState>(null);
  const [deckIndex, setDeckIndex] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isFlying, setIsFlying] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);
  const swipeRef = useRef<{
    pointerId: number | null;
    startX: number;
    startY: number;
    axis: "none" | "x" | "y";
    dragX: number;
  }>({ pointerId: null, startX: 0, startY: 0, axis: "none", dragX: 0 });

  const filtered = useMemo(() => trips.trips.filter((t) => t.category === active), [active, trips.trips]);
  const activeLabel = useMemo(() => trips.categories.find((c) => c.key === active)?.label ?? "Trips", [active, trips.categories]);
  const deckCount = filtered.length;

  useEffect(() => {
    setDeckIndex(0);
    setDragX(0);
    setIsDragging(false);
    setIsFlying(false);
    swipeRef.current = { pointerId: null, startX: 0, startY: 0, axis: "none", dragX: 0 };
  }, [active, deckCount]);

  const commitSwipe = (dir: -1 | 1) => {
    const next = deckIndex + dir;
    if (next < 0 || next >= deckCount || isFlying) {
      setDragX(0);
      setIsDragging(false);
      return;
    }
    setIsFlying(true);
    setIsDragging(false);
    const distance = typeof window !== "undefined" ? Math.min(window.innerWidth, 720) : 480;
    // Right swipe (dir +1 / next) flies right; left swipe (dir -1 / back) flies left
    setDragX(dir === 1 ? distance : -distance);
    window.setTimeout(() => {
      setDeckIndex(next);
      setDragX(0);
      setIsFlying(false);
    }, 280);
  };

  const onSwipePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 || isFlying || deckCount < 1) return;
    swipeRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      axis: "none",
      dragX: 0,
    };
  };

  const onSwipePointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const s = swipeRef.current;
    if (s.pointerId !== e.pointerId || isFlying) return;
    const dx = e.clientX - s.startX;
    const dy = e.clientY - s.startY;

    if (s.axis === "none") {
      if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return;
      // Only lock to horizontal when the gesture is clearly a left/right swipe
      if (Math.abs(dx) > Math.abs(dy) * 1.35) {
        s.axis = "x";
        setIsDragging(true);
        try {
          frameRef.current?.setPointerCapture(e.pointerId);
        } catch {
          /* ignore */
        }
      } else {
        s.axis = "y";
        return;
      }
    }
    if (s.axis !== "x") return;

    e.preventDefault();
    const atStart = deckIndex <= 0;
    const atEnd = deckIndex >= deckCount - 1;
    let nextX = dx;
    // Left = back (resist at start); right = next (resist at end)
    if (atStart && nextX < 0) nextX *= 0.25;
    if (atEnd && nextX > 0) nextX *= 0.25;
    s.dragX = nextX;
    setDragX(nextX);
  };

  const endSwipe = (e: ReactPointerEvent<HTMLDivElement>) => {
    const s = swipeRef.current;
    if (s.pointerId !== e.pointerId) return;
    try {
      if (frameRef.current?.hasPointerCapture(e.pointerId)) {
        frameRef.current.releasePointerCapture(e.pointerId);
      }
    } catch {
      /* already released */
    }
    const axis = s.axis;
    const dx = s.dragX;
    s.pointerId = null;
    s.axis = "none";
    s.dragX = 0;

    if (axis === "y" || isFlying) return;

    // Tap / click is handled by the front card button — just reset drag
    if (axis === "none" || Math.abs(dx) < 12) {
      setDragX(0);
      setIsDragging(false);
      return;
    }

    const threshold = 72;
    // Swipe right → next; swipe left → back
    if (dx >= threshold && deckIndex < deckCount - 1) {
      commitSwipe(1);
      return;
    }
    if (dx <= -threshold && deckIndex > 0) {
      commitSwipe(-1);
      return;
    }
    setDragX(0);
    setIsDragging(false);
  };

  const openFrontDetails = () => {
    if (isDragging || isFlying) return;
    const trip = filtered[deckIndex];
    if (trip) setDetails({ trip });
  };

  return (
    <section className="section section-trips" id="trips">
      <div className="section-head section-head--no-aside">
        <div>
          {/* <span className="eyebrow">{trips.eyebrow}</span> */}
          <h2>{trips.title}</h2>
          {tripsLoading ? <p className="trips-sheet-status">Loading latest destinations…</p> : null}
          {tripsError ? (
            <p className="trips-sheet-status trips-sheet-status--error" role="status">
              {tripsError} Showing saved destinations.
            </p>
          ) : null}
        </div>
        {/* <p className="section-copy">{trips.copy}</p> */}
      </div>

      <div className="trip-toolbar">
        <div className="trip-tabs" role="tablist" aria-label="Trending destinations by category">
          {trips.categories.map((c) => (
            <CategoryTab
              key={c.key}
              label={c.label}
              category={c.key}
              active={c.key === active}
              onClick={() => setActive(c.key)}
            />
          ))}
        </div>
      </div>

      <div
        className={`trip-deck${isDragging ? " is-swiping" : ""}${isFlying ? " is-flying" : ""}`}
        id="trip-category-panel"
        role="tabpanel"
        aria-labelledby={`trip-tab-${active}`}
        aria-label={`${activeLabel} list. Swipe right for next, left to go back. Tap a card for details.`}
      >
        <div
          ref={frameRef}
          className="trip-deck__frame"
          onPointerDown={onSwipePointerDown}
          onPointerMove={onSwipePointerMove}
          onPointerUp={endSwipe}
          onPointerCancel={endSwipe}
        >
          <div className="trip-deck__stage">
            {filtered.map((t, i) => {
              const rel = i - deckIndex;
              const odd = i % 2 === 1;
              const isFront = rel === 0;
              const exited = rel < 0;
              const depth = Math.max(0, rel);
              const fanX = !exited && !isFront ? (odd ? 16 : -16) * Math.min(depth, 4) : 0;
              const fanRot = !exited && !isFront ? (odd ? 6 : -6) * Math.min(depth, 3) : 0;
              const y = !exited && !isFront ? Math.min(depth, 5) * 10 : 0;
              const scale = exited ? 0.94 : isFront ? 1 : Math.max(0.86, 1 - depth * 0.045);

              let xPx = fanX;
              let xPct = 0;
              let rot = fanRot;
              let opacity = 1;
              if (exited) {
                // Dismissed by swiping right → park off to the right
                xPct = 120;
                rot = 14;
                opacity = 0;
              } else if (isFront) {
                xPx = dragX;
                rot = dragX / 28;
                opacity = Math.max(0.35, 1 - Math.abs(dragX) / 520);
              } else if (depth > 5) {
                opacity = 0;
              }

              const z = exited ? i : Math.floor(100 - depth);

              return (
                <article
                  key={t.id}
                  className={`trip-card trip-card--deck${odd ? " is-odd" : " is-even"}${isFront ? " is-front" : ""}${exited ? " is-exited" : ""}`}
                  data-trip-card="true"
                  aria-hidden={!isFront}
                  style={{
                    zIndex: z,
                    opacity,
                    transform: `translate3d(calc(${xPct}% + ${xPx}px), ${y}px, 0) rotate(${rot}deg) scale(${scale})`,
                    pointerEvents: isFront ? "auto" : "none",
                  }}
                >
                  <button
                    type="button"
                    className="trip-card__hit"
                    aria-label={`View details for ${t.title}`}
                    disabled={!isFront || isDragging || isFlying}
                    onClick={(e) => {
                      e.stopPropagation();
                      openFrontDetails();
                    }}
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
                </article>
              );
            })}
          </div>
        </div>

        {deckCount > 1 ? (
          <div className="trip-deck__hint" aria-hidden="true">
            Swipe right for next · left to go back
          </div>
        ) : null}

        {deckCount > 1 ? (
          <div className="trip-deck__dots" aria-hidden="true">
            {filtered.map((t, i) => (
              <span key={t.id} className={`trip-deck__dot${deckIndex === i ? " is-active" : ""}`} />
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

