import { Header } from "./components/Header";
import { HeroSection } from "./components/HeroSection";
import { JourneySection } from "./components/JourneySection";
import { CustomizerSection } from "./components/CustomizerSection";
import { ItinerarySection } from "./components/ItinerarySection";
import { GallerySection } from "./components/GallerySection";
import { TestimonialSection } from "./components/TestimonialSection";
import { FaqSection } from "./components/FaqSection";
import { CtaSection } from "./components/CtaSection";
import { TripsSection } from "./components/TripsSection";
import { Footer } from "./components/Footer";
import { siteContent } from "./data/siteContent";
import { useTripsFromSheet } from "./hooks/useTripsFromSheet";
import { useHeroCollageFromSheet } from "./hooks/useHeroCollageFromSheet";
import { useCallback, useEffect, useRef, useState, type AnimationEvent } from "react";

/** Must match splash flight duration in `site.css` (`orbitPath` / `crossFallback`). */
const SPLASH_FLIGHT_MS = 5_000;

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const dismissed = useRef(false);

  const dismissSplash = useCallback(() => {
    if (dismissed.current) return;
    dismissed.current = true;
    setShowSplash(false);
  }, []);

  useEffect(() => {
    const t = window.setTimeout(dismissSplash, SPLASH_FLIGHT_MS);
    return () => window.clearTimeout(t);
  }, [dismissSplash]);

  const onFlightAnimationEnd = useCallback(
    (e: AnimationEvent<SVGSVGElement>) => {
      const name = e.animationName;
      if (name === "orbitPath" || name === "crossFallback") dismissSplash();
    },
    [dismissSplash]
  );

  const tripsSheet = useTripsFromSheet(siteContent.trips);
  const heroCollageSheet = useHeroCollageFromSheet(siteContent.hero);

  return (
    <>
      {showSplash ? (
        <div className="splash-screen" role="status" aria-label="Loading">
          <div className="splash-inner">
            <div className="splash-logoWrap" aria-hidden="true">
              <div className="splash-logoGrow" aria-hidden="true">
                <img className="splash-logo" src="/logo.png" alt="" />
              </div>
              <div className="splash-orbit" aria-hidden="true">
                <span className="splash-orbit-plane" aria-hidden="true">
                  <svg viewBox="0 0 24 24" aria-hidden="true" onAnimationEnd={onFlightAnimationEnd}>
                    <path
                      fill="currentColor"
                      d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9L2 14v2l8-2.5V19l-2 1.5V22l3-1 3 1v-1.5L13 19v-5.5l8 2.5Z"
                    />
                  </svg>
                </span>
              </div>
            </div>
            <div className="splash-title">
              <strong>{siteContent.brand.name}</strong>
              <span>{siteContent.brand.tagline}</span>
            </div>
          </div>
        </div>
      ) : null}

      <div className="page-shell">
      <Header brand={siteContent.brand} nav={siteContent.nav} ctaLabel={siteContent.cta.buttonLabel} />

      <main id="top">
        <HeroSection
          hero={{ ...siteContent.hero, collage: heroCollageSheet.collage }}
          collageNotice={heroCollageSheet.error}
        />

        <section className="trust-strip" aria-label="Trip types and support">
          {siteContent.trustStrip.map((item) => (
            <div className="trust-strip__item" key={item}>
              {item}
            </div>
          ))}
        </section>

        <TripsSection
          trips={{ ...siteContent.trips, trips: tripsSheet.trips }}
          tripsLoading={tripsSheet.loading}
          tripsError={tripsSheet.error}
        />
        <JourneySection journeys={siteContent.journeys} />
        <CustomizerSection customizer={siteContent.customizer} />
        <ItinerarySection itinerary={siteContent.itinerary} />
        <GallerySection gallery={siteContent.gallery} />
        <TestimonialSection testimonials={siteContent.testimonials} />
        <FaqSection faq={siteContent.faq} />
        <CtaSection cta={siteContent.cta} />
      </main>

      <Footer brand={siteContent.brand} footer={siteContent.footer} />
      </div>
    </>
  );
}

export default App;
