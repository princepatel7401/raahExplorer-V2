import type { SiteContent } from "../types/site";
import { SectionHeader } from "./SectionHeader";

export function TestimonialSection({ testimonials }: { testimonials: SiteContent["testimonials"] }) {
  return (
    <section className="section">
      <SectionHeader eyebrow={testimonials.eyebrow} title={testimonials.title} />

      <div className="quote-grid">
        {testimonials.items.map((item) => (
          <blockquote className="quote-card visual-card" key={item.name}>
            <p>{item.quote}</p>
            <strong>
              {item.name}
              <span className="trip-muted"> · {item.trip}</span>
            </strong>
          </blockquote>
        ))}
      </div>
    </section>
  );
}
