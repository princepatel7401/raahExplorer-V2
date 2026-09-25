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
import { AdminPage } from "./components/AdminPage";
import { DestinationPage } from "./components/DestinationPage";
import { Footer } from "./components/Footer";
import { TrustStripItemContent } from "./components/TrustStripIcons";
import { siteContent } from "./data/siteContent";
import { useLocalDestinations } from "./hooks/useLocalDestinations";
import { useScrollReveal } from "./hooks/useScrollReveal";
import { useEffect, useMemo, useState } from "react";

/** Succession: logo pop → hold → exit → site enter. */
const SPLASH_POP_MS = 900;
const SPLASH_HOLD_MS = 700;
const SPLASH_EXIT_MS = 650;

type AppPage = "home" | "careers" | "admin" | "destination";

function parseHash(hash: string): { page: AppPage; destinationId: string | null } {
  const h = hash.replace(/^#/, "");
  if (h.startsWith("careers")) return { page: "careers", destinationId: null };
  if (h.startsWith("admin")) return { page: "admin", destinationId: null };
  const dest = /^destination\/([^/?#]+)/.exec(h);
  if (dest) {
    return { page: "destination", destinationId: decodeURIComponent(dest[1]!) };
  }
  return { page: "home", destinationId: null };
}

function App() {
  const [splashPhase, setSplashPhase] = useState<"pop" | "hold" | "exit" | "done">("pop");
  const [theme, setTheme] = useState<"dark" | "light">("light");
  const [route, setRoute] = useState(() =>
    typeof window !== "undefined" ? parseHash(window.location.hash) : { page: "home" as AppPage, destinationId: null }
  );
  const [trustTip, setTrustTip] = useState<string | null>(null);

  const page = route.page;

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
    const sync = () => setRoute(parseHash(window.location.hash));
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  useEffect(() => {
    if (splashPhase !== "done" && page !== "admin") return;
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [page, route.destinationId, splashPhase]);

  useEffect(() => {
    if (page !== "admin") return;
    const root = document.documentElement;
    root.classList.add("is-admin-open");
    return () => root.classList.remove("is-admin-open");
  }, [page]);

  const showSplash = splashPhase !== "done" && page !== "admin";
  const siteRevealing = splashPhase === "exit" || splashPhase === "done" || page === "admin";
  const localDestinations = useLocalDestinations();
  useScrollReveal(splashPhase === "done" && page === "home", `${localDestinations.destinations.length}`);

  const activeDestination = useMemo(() => {
    if (page !== "destination" || !route.destinationId) return null;
    return localDestinations.destinations.find((d) => d.id === route.destinationId) ?? null;
  }, [page, route.destinationId, localDestinations.destinations]);

  const phoneContact = siteContent.footer.contacts.find((c) => c.icon === "phone");
  const waDigits = (phoneContact?.value ?? "").replace(/\D/g, "");
  const waPhone = waDigits ? (waDigits.startsWith("91") ? waDigits : `91${waDigits}`) : "";
  const destinationTitle = activeDestination?.title ?? "a custom trip";
  const destinationWaHref = waPhone
    ? `https://wa.me/${waPhone}?text=${encodeURIComponent(
        `Hi Raah Explorer, I’d like to customize a personal trip for ${destinationTitle}. Please help with dates, hotels, itinerary, and a quote.`
      )}`
    : "mailto:info@raahexplorer.com";

  const nav =
    page === "careers"
      ? [
          { label: "Home", href: "#top" },
          { label: "Destinations", href: "#trips" },
          { label: "Contact", href: "mailto:info@raahexplorer.com" },
        ]
      : page === "destination"
        ? [
            { label: "Home", href: "#top" },
            { label: "Destinations", href: "#trips" },
            { label: "Contact", href: destinationWaHref },
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
        className={`page-shell${siteRevealing ? " is-entered" : " is-waiting"}${page === "careers" ? " page-shell--careers" : ""}${page === "destination" ? " page-shell--destination" : ""}${page === "admin" ? " page-shell--admin" : ""}`}
        aria-hidden={showSplash && splashPhase !== "exit" ? true : undefined}
      >
        {page !== "admin" ? (
          <Header
            brand={siteContent.brand}
            nav={nav}
            ctaLabel={siteContent.cta.buttonLabel}
            ctaHref={page === "destination" ? destinationWaHref : "#customize"}
            variant={page === "destination" ? "destination" : "default"}
            theme={theme}
            onToggleTheme={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
          />
        ) : null}

        {page === "admin" ? (
          <AdminPage
            initialDestinations={localDestinations.destinations}
            onDestinationsChange={(destinations) => localDestinations.setDestinations(destinations)}
          />
        ) : page === "careers" ? (
          <CareersPage careers={siteContent.careers} />
        ) : page === "destination" ? (
          <DestinationPage
            destination={activeDestination}
            destinations={localDestinations.destinations}
          />
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
              trips={{ ...siteContent.trips, destinations: localDestinations.destinations }}
            />
            <JourneySection journeys={siteContent.journeys} />
            <CustomizerSection customizer={siteContent.customizer} />
            {/* <ItinerarySection itinerary={siteContent.itinerary} /> */}
            <GallerySection gallery={siteContent.gallery} collage={siteContent.hero.collage} />
            <TestimonialSection testimonials={siteContent.testimonials} />
            <FaqSection faq={siteContent.faq} />
            <CtaSection cta={siteContent.cta} />
          </main>
        )}

        {page !== "admin" && page !== "destination" ? (
          <Footer brand={siteContent.brand} footer={siteContent.footer} />
        ) : null}
      </div>
    </>
  );
}

export default App;
