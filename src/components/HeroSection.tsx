import { useEffect, useRef, useState } from "react";
import type { SiteContent } from "../types/site";

const HERO_DESKTOP = ["/videos/hero-travel-1-desk.mp4", "/videos/hero-travel-2-desk.mp4"] as const;
const HERO_MOBILE = ["/videos/hero-travel-1-mobile.mp4", "/videos/hero-travel-2-mobile.mp4"] as const;
const HERO_POSTER = "/videos/hero-poster.jpg";

function useIsMobileHero() {
  const [mobile, setMobile] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia("(max-width: 900px)").matches : true
  );

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 900px)");
    const sync = () => setMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return mobile;
}

function JiggleText({
  text,
  className,
  as: Tag = "span",
}: {
  text: string;
  className?: string;
  as?: "span" | "h1" | "p" | "strong";
}) {
  return (
    <Tag className={`hero-jiggle ${className ?? ""}`.trim()}>
      {Array.from(text).map((ch, i) =>
        ch === " " ? (
          <span key={`s-${i}`} className="hero-jiggle__space">
            {"\u00A0"}
          </span>
        ) : (
          <span key={`c-${i}`} className="hero-jiggle__char" style={{ ["--i" as string]: i }}>
            {ch}
          </span>
        )
      )}
    </Tag>
  );
}

export function HeroSection({ hero }: { hero: SiteContent["hero"] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoARef = useRef<HTMLVideoElement>(null);
  const videoBRef = useRef<HTMLVideoElement>(null);
  const [activeVideo, setActiveVideo] = useState(0);
  const [ready, setReady] = useState(false);
  const isMobile = useIsMobileHero();
  const sources = isMobile ? HERO_MOBILE : HERO_DESKTOP;

  useEffect(() => {
    setReady(false);
    setActiveVideo(0);
  }, [isMobile]);

  useEffect(() => {
    const active = activeVideo === 0 ? videoARef.current : videoBRef.current;
    const idle = activeVideo === 0 ? videoBRef.current : videoARef.current;
    if (!active) return;

    const markReady = () => setReady(true);
    if (active.readyState >= 2) markReady();
    else active.addEventListener("loadeddata", markReady, { once: true });

    void active.play().catch(() => undefined);
    if (idle) {
      idle.pause();
      idle.currentTime = 0;
    }

    // Mobile: loop first clip only (faster, less data). Desktop: crossfade both.
    if (isMobile) {
      active.loop = true;
      return () => {
        active.loop = false;
        active.removeEventListener("loadeddata", markReady);
      };
    }

    const onEnded = () => setActiveVideo((v) => (v + 1) % sources.length);
    active.addEventListener("ended", onEnded);
    return () => {
      active.removeEventListener("ended", onEnded);
      active.removeEventListener("loadeddata", markReady);
    };
  }, [activeVideo, sources, isMobile]);

  return (
    <section className="hero hero--cinematic" ref={sectionRef} aria-label="Hero">
      <div className={`hero-media${ready ? " is-ready" : ""}`} aria-hidden="true">
        <img className="hero-poster" src={HERO_POSTER} alt="" decoding="async" fetchPriority="high" />
        <video
          ref={videoARef}
          className={`hero-video ${activeVideo === 0 ? "is-active" : ""}`}
          src={sources[0]}
          muted
          playsInline
          preload="auto"
          poster={HERO_POSTER}
        />
        {!isMobile ? (
          <video
            ref={videoBRef}
            className={`hero-video ${activeVideo === 1 ? "is-active" : ""}`}
            src={sources[1]}
            muted
            playsInline
            preload="metadata"
            poster={HERO_POSTER}
          />
        ) : null}
        <div className="hero-media-shade" />
        <div className="hero-media-grid" />
        <div className="hero-media-glow" />
      </div>

      <div className="hero-content">
        <div className="hero-copy">
          <div className="hero-copy-main">
            <JiggleText as="p" className="hero-kicker" text="Raah Explorer Future of travel" />
            <JiggleText as="h1" text={hero.title} />
            <div className="hero-actions">
              <a className="btn btn-primary" href="#customize">
                {hero.primaryCta}
              </a>
              <a className="btn btn-secondary hero-btn-ghost" href="#trips">
                Explore Destinations
              </a>
            </div>
          </div>

          <div className="hero-metrics" aria-label="Key stats">
            {hero.metricCards.map((item) => (
              <article className="hero-metric" key={item.label}>
                <strong className="hero-metric__value">
                  <JiggleText text={item.value} />
                </strong>
                <span className="hero-metric__label">
                  <JiggleText text={item.label} />
                </span>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
