import type { SiteContent } from "../types/site";
import { SectionHeader } from "./SectionHeader";

export function JourneySection({ journeys }: { journeys: SiteContent["journeys"] }) {
  return (
    <section id="journeys" className="section">
      <SectionHeader eyebrow={journeys.eyebrow} title={journeys.title} copy={journeys.copy} />

      <div className="journey-grid">
        {journeys.items.map((item) => (
          <article className="journey-card visual-card" key={item.title}>
            <img src={item.image} alt={item.title} />
            <div className="journey-body">
              <p className="card-tag">{item.tag}</p>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
