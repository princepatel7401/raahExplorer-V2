import type { SiteContent } from "../types/site";
import { SectionHeader } from "./SectionHeader";
import { CollageImage } from "./CollageImage";

type GalleryCollageItem = { src: string; alt: string };

export function GallerySection({
  gallery,
  collage,
  collageNotice,
}: {
  gallery: SiteContent["gallery"];
  collage: GalleryCollageItem[];
  collageNotice?: string | null;
}) {
  return (
    <section id="gallery" className="section section-gallery">
      <SectionHeader eyebrow={gallery.eyebrow} title={gallery.title} copy={gallery.copy} />

      <div className="gallery-collage-panel visual-card">
        <div className="gallery-collage" role="img" aria-label="Destination collage">
          {collage.map((item, i) => (
            <div className="gallery-collage__cell" key={`${item.src}-${i}`}>
              <CollageImage src={item.src} alt={item.alt} loading={i === 0 ? "eager" : "lazy"} />
            </div>
          ))}
        </div>
        {collageNotice ? (
          <p className="gallery-collage-notice" role="status">
            {collageNotice}
          </p>
        ) : null}
      </div>
    </section>
  );
}
