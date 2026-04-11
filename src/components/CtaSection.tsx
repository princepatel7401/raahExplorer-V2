import type { SiteContent } from "../types/site";

export function CtaSection({ cta }: { cta: SiteContent["cta"] }) {
  return (
    <section className="section cta-section" aria-labelledby="cta-heading">
      <div className="cta-card visual-card">
        <div>
          <p className="eyebrow">{cta.eyebrow}</p>
          <h2 id="cta-heading">{cta.title}</h2>
          <p>{cta.text}</p>
        </div>
        <a className="btn btn-primary" href="#customize">
          {cta.buttonLabel}
        </a>
      </div>
    </section>
  );
}
