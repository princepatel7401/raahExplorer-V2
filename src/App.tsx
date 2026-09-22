import { Header } from "./components/Header";
import { HeroSection } from "./components/HeroSection";
import { JourneySection } from "./components/JourneySection";
import { CustomizerSection } from "./components/CustomizerSection";
// import { ItinerarySection } from "./components/ItinerarySection";
import { GallerySection } from "./components/GallerySection";
import { TestimonialSection } from "./components/TestimonialSection";
import { FaqSection } from "./components/FaqSection";
import { CtaSection } from "./components/CtaSection";
import { TripsSection } from "./components/TripsSection";
import { CareersPage } from "./components/CareersPage";
import { Footer } from "./components/Footer";
import { TrustStripItemContent } from "./components/TrustStripIcons";
import { siteContent } from "./data/siteContent";
import { useTripsFromSheet } from "./hooks/useTripsFromSheet";
import { useHeroCollageFromSheet } from "./hooks/useHeroCollageFromSheet";
import { useScrollReveal } from "./hooks/useScrollReveal";
import { useEffect, useState } from "react";

/** Succession: logo pop → hold → exit → site enter. */
const SPLASH_POP_MS = 900;
const SPLASH_HOLD_MS = 700;
const SPLASH_EXIT_MS = 650;

function pageFromHash(hash: string): "home" | "careers" {
  return hash.replace(/^#/, "").startsWith("careers") ? "careers" : "home";
}

function App() {
  const [splashPhase, setSplashPhase] = useState<"pop" | "hold" | "exit" | "done">("pop");
  const [theme, setTheme] = useState<"dark" | "light">("light");
  const [page, setPage] = useState<"home" | "careers">(() =>
    typeof window !== "undefined" ? pageFromHash(window.location.hash) : "home"
  );
  const [trustTip, setTrustTip] = useState<string | null>(null);

  useEffect(() => {
    const timers = [
      window.setTimeout(() => setSplashPhase("hold"), SPLASH_POP_MS),
      window.setTimeout(() => setSplashPhase("exit"), SPLASH_POP_MS + SPLASH_HOLD_MS),
      window.setTimeout(
        () => setSplashPhase("done"),
        SPLASH_POP_MS + SPLASH_HOLD_MS + SPLASH_EXIT_MS
      ),
    ];
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    const sync = () => setPage(pageFromHash(window.location.hash));
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  useEffect(() => {
    if (splashPhase !== "done") return;
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [page, splashPhase]);

  const showSplash = splashPhase !== "done";
  const siteRevealing = splashPhase === "exit" || splashPhase === "done";
  const tripsSheet = useTripsFromSheet(siteContent.trips);
  const heroCollageSheet = useHeroCollageFromSheet(siteContent.hero);
  useScrollReveal(
    splashPhase === "done" && page === "home",
    `${tripsSheet.loading}-${heroCollageSheet.loading}-${tripsSheet.trips.length}`
  );

  const nav =
    page === "careers"
      ? [
          { label: "Home", href: "#top" },
          { label: "Careers", href: "#careers" },
          { label: "Contact", href: "mailto:info@raahexplorer.com" },
        ]
      : siteContent.nav;

  return (
    <>
      {showSplash ? (
        <div
          className={`splash-screen splash-screen--${splashPhase}`}
          role="status"
          aria-label="Loading"
        >
          <div className="splash-inner">
            <img
              className={`splash-logo splash-logo--${splashPhase}`}
              src="/logo.png"
              alt=""
              width={220}
              height={220}
              decoding="async"
              fetchPriority="high"
            />
            <p className={`splash-brand splash-brand--${splashPhase}`}>
              {siteContent.brand.name}
            </p>
          </div>
        </div>
      ) : null}

      <div
        className={`page-shell${siteRevealing ? " is-entered" : " is-waiting"}${page === "careers" ? " page-shell--careers" : ""}`}
        aria-hidden={showSplash && splashPhase !== "exit" ? true : undefined}
      >
        <Header
          brand={siteContent.brand}
          nav={nav}
          ctaLabel={siteContent.cta.buttonLabel}
          theme={theme}
          onToggleTheme={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
        />

        {page === "careers" ? (
          <CareersPage careers={siteContent.careers} />
        ) : (
          <main id="top">
            <HeroSection hero={siteContent.hero} />

            <section className="trust-strip" aria-label="Trip types and support">
              {siteContent.trustStrip.map((item, index) => (
                <button
                  type="button"
                  className={`trust-strip__item${trustTip === item ? " is-tip" : ""}`}
                  key={item}
                  aria-label={item}
                  onMouseEnter={() => setTrustTip(item)}
                  onMouseLeave={() => setTrustTip(null)}
                  onFocus={() => setTrustTip(item)}
                  onBlur={() => setTrustTip(null)}
                  onClick={() => setTrustTip((cur) => (cur === item ? null : item))}
                >
                  <TrustStripItemContent label={item} index={index} />
                </button>
              ))}
            </section>

            <TripsSection
              trips={{ ...siteContent.trips, trips: tripsSheet.trips }}
              tripsLoading={tripsSheet.loading}
              tripsError={tripsSheet.error}
            />
            <JourneySection journeys={siteContent.journeys} />
            <CustomizerSection customizer={siteContent.customizer} />
            {/* <ItinerarySection itinerary={siteContent.itinerary} /> */}
            <GallerySection
              gallery={siteContent.gallery}
              collage={heroCollageSheet.collage}
              collageNotice={heroCollageSheet.error}
            />
            <TestimonialSection testimonials={siteContent.testimonials} />
            <FaqSection faq={siteContent.faq} />
            <CtaSection cta={siteContent.cta} />
          </main>
        )}

        <Footer brand={siteContent.brand} footer={siteContent.footer} />
      </div>
    </>
  );
}

export default App;
