import { useEffect, useRef, useState } from "react";
import type { SiteContent } from "../types/site";

const HERO_VIDEOS = ["/videos/hero-travel-1.mp4", "/videos/hero-travel-2.mp4"] as const;

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

  useEffect(() => {
    const active = activeVideo === 0 ? videoARef.current : videoBRef.current;
    const idle = activeVideo === 0 ? videoBRef.current : videoARef.current;
    if (!active) return;

    void active.play().catch(() => undefined);
    if (idle) {
      idle.pause();
      idle.currentTime = 0;
    }

    const onEnded = () => setActiveVideo((v) => (v + 1) % HERO_VIDEOS.length);
    active.addEventListener("ended", onEnded);
    return () => active.removeEventListener("ended", onEnded);
  }, [activeVideo]);

  return (
    <section className="hero hero--cinematic" ref={sectionRef} aria-label="Hero">
      <div className="hero-media" aria-hidden="true">
        <video
          ref={videoARef}
          className={`hero-video ${activeVideo === 0 ? "is-active" : ""}`}
          src={HERO_VIDEOS[0]}
          muted
          playsInline
          preload="auto"
        />
        <video
          ref={videoBRef}
          className={`hero-video ${activeVideo === 1 ? "is-active" : ""}`}
          src={HERO_VIDEOS[1]}
          muted
          playsInline
          preload="metadata"
        />
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
