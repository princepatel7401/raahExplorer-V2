import { useEffect, useMemo, useState } from "react";
import type { SiteContent, Trip, TripCategoryKey, TripDeparture, TripPackageBundle } from "../types/site";

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

function formatDate(iso: string) {
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function CategoryIcon({ category }: { category: TripCategoryKey }) {
  switch (category) {
    case "international":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M12 2a10 10 0 1 0 .001 20.001A10 10 0 0 0 12 2Zm7.9 9h-3.12a16.3 16.3 0 0 0-1.1-5 8.03 8.03 0 0 1 4.22 5ZM12 4c1.04 0 2.62 2.33 3.23 7H8.77C9.38 6.33 10.96 4 12 4ZM4.1 13h3.12a16.3 16.3 0 0 0 1.1 5A8.03 8.03 0 0 1 4.1 13Zm3.12-2H4.1a8.03 8.03 0 0 1 4.22-5 16.3 16.3 0 0 0-1.1 5ZM12 20c-1.04 0-2.62-2.33-3.23-7h6.46C14.62 17.67 13.04 20 12 20Zm3.68-2a16.3 16.3 0 0 0 1.1-5h3.12a8.03 8.03 0 0 1-4.22 5Z"
          />
        </svg>
      );
    case "domestic":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M12 2 3 9v13h6v-7h6v7h6V9l-9-7Zm7 18h-2v-7H7v7H5V10l7-5.44L19 10v10Z"
          />
        </svg>
      );
    case "group":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M16 11a4 4 0 1 0-3.2-6.4A4 4 0 0 0 16 11Zm-8 0a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm8 2c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4ZM8 13c-.38 0-.8.02-1.24.06C4.08 13.3 2 14.4 2 17v3h5v-3c0-1.56.7-2.66 1.78-3.44A12.5 12.5 0 0 0 8 13Z"
          />
        </svg>
      );
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

function TripDetailsModal({ state, onClose }: { state: TripDetailsState; onClose: () => void }) {
  if (!state) return null;
  const trip = state.trip;
  const [pkgKey, setPkgKey] = useState(trip.defaultPackageKey);

  useEffect(() => {
    setPkgKey(trip.defaultPackageKey);
  }, [trip.id, trip.defaultPackageKey]);

  const pkg = useMemo(
    () => trip.packages.find((p) => p.key === pkgKey) ?? trip.packages[0]!,
    [trip.packages, pkgKey]
  );
  const includes = pkg.includes ?? trip.includes;
  const excludes = pkg.excludes ?? trip.excludes;

  return (
    <div className="trip-modal-backdrop" role="presentation" onMouseDown={onClose}>
      <div
        className="trip-modal"
        role="dialog"
        aria-modal="true"
        aria-label={`${trip.title} details`}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button className="trip-modal-close" type="button" onClick={onClose} aria-label="Close">
          ×
        </button>

        <header className="trip-modal-hero">
          <img src={trip.coverImage} alt={trip.title} />
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
                      {formatDate(d.startDate)} – {formatDate(d.endDate)}
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
                    <img src={d.image} alt={`${trip.title} day ${d.day}`} />
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="trip-modal-card trip-modal-wide">
            <h3>Photos</h3>
            <div className="trip-gallery">
              {trip.gallery.map((src) => (
                <img key={src} src={src} alt={`${trip.title} gallery`} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export function TripsSection({ trips, tripsLoading, tripsError }: TripsSectionProps) {
  const [active, setActive] = useState<TripCategoryKey>("international");
  const [details, setDetails] = useState<TripDetailsState>(null);

  const filtered = useMemo(() => trips.trips.filter((t) => t.category === active), [active, trips.trips]);
  const activeLabel = useMemo(() => trips.categories.find((c) => c.key === active)?.label ?? "Trips", [active, trips.categories]);

  return (
    <section className="section section-trips" id="trips">
      <div className="section-head">
        <div>
          <span className="eyebrow">{trips.eyebrow}</span>
          <h2>{trips.title}</h2>
          {tripsLoading ? <p className="trips-sheet-status">Loading latest destinations…</p> : null}
          {tripsError ? (
            <p className="trips-sheet-status trips-sheet-status--error" role="status">
              {tripsError} Showing saved destinations.
            </p>
          ) : null}
        </div>
        <p className="section-copy">{trips.copy}</p>
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
        className="trip-rail-wrap"
        id="trip-category-panel"
        role="tabpanel"
        aria-labelledby={`trip-tab-${active}`}
      >
        <div className="trip-rail" aria-label={`${activeLabel} list`}>
          {filtered.map((t) => (
            <button
              key={t.id}
              type="button"
              className="trip-card"
              data-trip-card="true"
              onClick={() => setDetails({ trip: t })}
            >
              <div className="trip-thumb">
                <img src={t.coverImage} alt={t.title} />
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
          ))}
        </div>
      </div>

      <TripDetailsModal state={details} onClose={() => setDetails(null)} />
    </section>
  );
}

