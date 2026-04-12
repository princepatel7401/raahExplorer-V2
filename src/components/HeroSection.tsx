import type { SiteContent } from "../types/site";
import { CollageImage } from "./CollageImage";

export function HeroSection({
  hero,
  collageNotice
}: {
  hero: SiteContent["hero"];
  /** Shown when spreadsheet collage failed to load (e.g. missing tab or URLs) */
  collageNotice?: string | null;
}) {
  return (
    <section className="hero">
      <div className="hero-copy">
        <div className="hero-copy-main">
          <p className="eyebrow">{hero.eyebrow}</p>
          <h1>{hero.title}</h1>
          <p className="hero-text">{hero.text}</p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="#customize">
              {hero.primaryCta}
            </a>
            <a className="btn btn-secondary" href="#itinerary">
              {hero.secondaryCta}
            </a>
          </div>
        </div>
        <div className="hero-metrics" aria-label="Key stats">
          {hero.metricCards.map((item) => (
            <article className="hero-metric" key={item.label}>
              <strong className="hero-metric__value">{item.value}</strong>
              <span className="hero-metric__label">{item.label}</span>
            </article>
          ))}
        </div>
      </div>

      <div className="hero-visual">
        <div className="visual-card hero-visual-panel">
          <p className="hero-collage-label">{hero.imageLabel}</p>
          <div className="hero-collage" role="img" aria-label="Tour destination collage">
            {hero.collage.map((item, i) => (
              <div className="hero-collage__cell" key={`${item.src}-${i}`}>
                <CollageImage src={item.src} alt={item.alt} loading={i === 0 ? "eager" : "lazy"} />
              </div>
            ))}
          </div>
          {collageNotice ? (
            <p className="hero-collage-notice" role="status">
              {collageNotice}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
