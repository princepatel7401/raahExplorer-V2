import type { SiteContent } from "../types/site";
import { SectionHeader } from "./SectionHeader";

export function GallerySection({ gallery }: { gallery: SiteContent["gallery"] }) {
  return (
    <section id="gallery" className="section section-gallery">
      <SectionHeader eyebrow={gallery.eyebrow} title={gallery.title} copy={gallery.copy} />

      <div className="gallery-grid">
        {gallery.items.map((item) => (
          <figure className={`gallery-card ${item.tall ? "tall" : ""}`} key={item.title}>
            <img src={item.image} alt={item.title} />
            <figcaption>
              <strong>{item.title}</strong>
              <span>{item.subtitle}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
