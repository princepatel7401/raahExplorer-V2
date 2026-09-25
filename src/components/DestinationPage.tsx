import { useEffect, useMemo, useRef, useState } from "react";
import type { DestinationGroup, Trip } from "../types/site";
import { destinationStartingPrice } from "../data/tripsFallback";
import { siteContent } from "../data/siteContent";
import { TripPhoto } from "./TripPhoto";
import { TripDetailsModal } from "./TripsSection";

function formatInr(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

function whatsappHref(phoneLabel: string, message: string) {
  const digits = phoneLabel.replace(/\D/g, "");
  const phone = digits.startsWith("91") ? digits : `91${digits}`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

function interestMessage(destinationTitle: string) {
  return `Hi Raah Explorer, I’m interested in trips for ${destinationTitle}. Please share the available options and pricing.`;
}

function customizeMessage(destinationTitle: string) {
  return `Hi Raah Explorer, I’d like to customize a personal trip for ${destinationTitle}. Please help with dates, hotels, itinerary, and a quote.`;
}

interface DestinationPageProps {
  destination: DestinationGroup | null;
  destinations: DestinationGroup[];
}

export function DestinationPage({ destination, destinations }: DestinationPageProps) {
  const [details, setDetails] = useState<Trip | null>(null);
  const [heroReady, setHeroReady] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const listingRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setDetails(null);
    setHeroReady(false);
    const t = window.setTimeout(() => setHeroReady(true), 40);
    return () => window.clearTimeout(t);
  }, [destination?.id]);

  useEffect(() => {
    const hero = heroRef.current;
    const media = mediaRef.current;
    if (!hero || !media) return;

    const onMove = (e: PointerEvent) => {
      const r = hero.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      media.style.transform = `scale(1.08) translate(${x * -18}px, ${y * -12}px)`;
    };
    const onLeave = () => {
      media.style.transform = "scale(1.04) translate(0, 0)";
    };

    hero.addEventListener("pointermove", onMove);
    hero.addEventListener("pointerleave", onLeave);
    return () => {
      hero.removeEventListener("pointermove", onMove);
      hero.removeEventListener("pointerleave", onLeave);
    };
  }, [destination?.id]);

  const related = useMemo(() => {
    if (!destination) return [];
    return destinations
      .filter((d) => d.id !== destination.id && d.category === destination.category)
      .slice(0, 4);
  }, [destination, destinations]);

  const scrollToTrips = () => {
    listingRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (!destination) {
    return (
      <main className="dest-page" id="destination">
        <div className="dest-page__missing">
          <h1>Destination not found</h1>
          <p>This destination is unavailable or was removed.</p>
          <a className="btn btn-primary" href="#trips">
            Browse destinations
          </a>
        </div>
      </main>
    );
  }

  const fromPrice = destinationStartingPrice(destination);
  const phone = siteContent.footer.contacts.find((c) => c.icon === "phone");
  const email = siteContent.footer.contacts.find((c) => c.icon === "email");

  return (
    <main className={`dest-page${heroReady ? " is-ready" : ""}`} id="destination">
      <section
        className="dest-page__hero"
        ref={heroRef}
        aria-label={destination.title}
      >
        <div className="dest-page__hero-media" ref={mediaRef} aria-hidden="true">
          <TripPhoto
            src={destination.coverImage}
            title={destination.title}
            subtitle={destination.location}
            alt=""
            tone="cover"
          />
        </div>
        <div className="dest-page__hero-scrim" aria-hidden="true" />
        <div className="dest-page__hero-glow" aria-hidden="true" />

        <div className="dest-page__hero-content">
          <a className="dest-page__back" href="#trips">
            <span aria-hidden="true">←</span> All destinations
          </a>

          <div className="dest-page__hero-kicker">
            <span className="dest-page__chip">{destination.category}</span>
          </div>

          <h1 className="dest-page__title">{destination.title}</h1>
          <p className="dest-page__location">{destination.location}</p>
          {destination.summary ? <p className="dest-page__summary">{destination.summary}</p> : null}

          <div className="dest-page__stats">
            <button type="button" className="dest-page__stat" onClick={scrollToTrips}>
              <strong>{destination.trips.length}</strong>
              <span>trip{destination.trips.length === 1 ? "" : "s"}</span>
            </button>
            <div className="dest-page__stat dest-page__stat--static">
              <strong>{formatInr(fromPrice)}</strong>
              <span>starting from</span>
            </div>
          </div>

          <div className="dest-page__hero-actions">
            <button type="button" className="btn btn-primary" onClick={scrollToTrips}>
              Browse trips
            </button>
            {phone ? (
              <a
                className="btn btn-secondary dest-page__ghost-btn"
                href={whatsappHref(phone.value, customizeMessage(destination.title))}
                target="_blank"
                rel="noopener noreferrer"
              >
                Plan a custom trip
              </a>
            ) : (
              <a className="btn btn-secondary dest-page__ghost-btn" href="mailto:info@raahexplorer.com">
                Plan a custom trip
              </a>
            )}
          </div>

          {destination.trips.length > 0 ? (
            <div className="dest-page__quick" aria-label="Quick trip picks">
              {destination.trips.slice(0, 2).map((t, i) => (
                <button
                  key={t.id}
                  type="button"
                  className="dest-page__quick-chip"
                  style={{ ["--i" as string]: i }}
                  onClick={() => setDetails(t)}
                >
                  <span className="dest-page__quick-thumb">
                    <TripPhoto
                      src={t.coverImage}
                      title={t.title}
                      subtitle={t.location}
                      alt=""
                      loading="lazy"
                      tone="cover"
                    />
                  </span>
                  <span className="dest-page__quick-text">
                    <strong>{t.title}</strong>
                    <small>
                      {t.durationDays}D/{t.durationNights}N
                    </small>
                  </span>
                </button>
              ))}
              {destination.trips.length > 2 ? (
                <button
                  type="button"
                  className="dest-page__quick-chip dest-page__quick-chip--more"
                  style={{ ["--i" as string]: 2 }}
                  onClick={scrollToTrips}
                  aria-label={`View ${destination.trips.length - 2} more trips`}
                >
                  <span className="dest-page__quick-more">
                    <strong>+{destination.trips.length - 2}</strong>
                    <small>more trips</small>
                  </span>
                </button>
              ) : null}
            </div>
          ) : null}
        </div>

        <button
          type="button"
          className="dest-page__scroll"
          onClick={scrollToTrips}
          aria-label="Scroll to trips"
        >
          <span />
        </button>
      </section>

      <section
        className="dest-page__listing"
        ref={listingRef}
        aria-labelledby="dest-trips-heading"
      >
        <div className="dest-page__listing-head">
          <h2 id="dest-trips-heading">Trips in {destination.title}</h2>
          <p>Every package for this destination — tap a card for itinerary and gallery.</p>
        </div>

        {destination.trips.length === 0 ? (
          <p className="dest-page__empty">No trips listed for this destination yet.</p>
        ) : (
          <ul className="dest-page__grid">
            {destination.trips.map((t, i) => (
              <li key={t.id} style={{ ["--card-i" as string]: i }}>
                <button
                  type="button"
                  className="dest-page__card dest-page__card--image"
                  onClick={() => setDetails(t)}
                  aria-label={`View ${t.title}`}
                >
                  <div className="dest-page__card-media">
                    <TripPhoto
                      src={t.coverImage}
                      title={t.title}
                      subtitle={t.location}
                      alt={t.title}
                      loading="lazy"
                      tone="cover"
                    />
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {related.length ? (
        <section className="dest-page__related" aria-labelledby="dest-related-heading">
          <div className="dest-page__listing-head">
            <h2 id="dest-related-heading">More {destination.category} destinations</h2>
            <p>Keep exploring the same travel style.</p>
          </div>
          <ul className="dest-page__related-grid">
            {related.map((d) => (
              <li key={d.id}>
                <a className="dest-page__related-card" href={`#destination/${d.id}`}>
                  <div className="dest-page__related-media">
                    <TripPhoto
                      src={d.coverImage}
                      title={d.title}
                      subtitle={d.location}
                      alt={d.title}
                      loading="lazy"
                      tone="cover"
                    />
                  </div>
                  <div>
                    <strong>{d.title}</strong>
                    <span>
                      {d.trips.length} trip{d.trips.length === 1 ? "" : "s"} · From{" "}
                      {formatInr(destinationStartingPrice(d))}
                    </span>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="dest-page__help" aria-label="Need help planning">
        <div className="dest-page__help-copy">
          <h2>Need help with {destination.title}?</h2>
          <p>
            Talk to our team for dates, hotels, and the right trip package — or customize one for
            your group.
          </p>
        </div>
        <div className="dest-page__help-actions">
          {phone ? (
            <a className="dest-page__help-btn dest-page__help-btn--call" href={phone.href || `tel:${phone.value}`}>
              Call {phone.label}
            </a>
          ) : null}
          {phone ? (
            <a
              className="dest-page__help-btn dest-page__help-btn--wa"
              href={whatsappHref(phone.value, interestMessage(destination.title))}
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp
            </a>
          ) : null}
          {email ? (
            <a className="dest-page__help-btn dest-page__help-btn--mail" href={email.href || `mailto:${email.value}`}>
              Email us
            </a>
          ) : null}
          {phone ? (
            <a
              className="dest-page__help-btn dest-page__help-btn--primary"
              href={whatsappHref(phone.value, customizeMessage(destination.title))}
              target="_blank"
              rel="noopener noreferrer"
            >
              Customize trip
            </a>
          ) : (
            <a className="dest-page__help-btn dest-page__help-btn--primary" href="mailto:info@raahexplorer.com">
              Customize trip
            </a>
          )}
          <a className="dest-page__help-btn" href="#trips">
            All destinations
          </a>
        </div>
        {phone || email ? (
          <p className="dest-page__help-note">
            Available for trip questions, bookings, and custom itineraries.
          </p>
        ) : null}
      </section>

      {details ? <TripDetailsModal trip={details} onClose={() => setDetails(null)} /> : null}
    </main>
  );
}
