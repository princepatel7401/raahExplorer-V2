import { useState } from "react";
import type { SiteContent } from "../types/site";
import { SectionHeader } from "./SectionHeader";

export function FaqSection({ faq }: { faq: SiteContent["faq"] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="section">
      <SectionHeader eyebrow={faq.eyebrow} title={faq.title} />

      <div className="faq-list">
        {faq.items.map((item, i) => {
          const isOpen = openIndex === i;
          return (
            <article className="faq-card visual-card" key={item.question}>
              <button
                type="button"
                className="faq-trigger"
                aria-expanded={isOpen}
                onClick={() => setOpenIndex(isOpen ? null : i)}
              >
                {item.question}
                <span className="faq-icon" aria-hidden>
                  {isOpen ? "−" : "+"}
                </span>
              </button>
              {isOpen ? <p className="faq-answer">{item.answer}</p> : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}
