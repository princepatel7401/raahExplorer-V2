import { useEffect } from "react";

const REVEAL_SELECTOR = [
  ".section > .section-head",
  ".section-head h2",
  ".trust-strip__item",
  ".trip-toolbar",
  ".trip-arc__point",
  ".journey-card",
  ".gallery-collage-panel",
  ".gallery-collage__cell",
  ".quote-card",
  ".faq-card",
  ".cta-card",
  ".cta-card > *",
  ".customizer-form",
  ".proposal-card",
  ".field-grid > *",
  ".feature-list > li",
  ".footer-grid > *",
  ".footer-bottom > *",
  "[data-reveal]",
].join(",");

/**
 * Adds scroll-in animations to major page blocks and staggers siblings line-by-line.
 */
export function useScrollReveal(enabled: boolean, refreshKey?: string | number | boolean) {
  useEffect(() => {
    if (!enabled) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR).forEach((el) => {
        el.classList.add("is-revealed");
      });
      return;
    }

    const root = document.querySelector(".page-shell");
    if (!root) return;

    const markTargets = () => {
      const nodes = Array.from(root.querySelectorAll<HTMLElement>(REVEAL_SELECTOR));
      const parentIndex = new WeakMap<Element, number>();

      nodes.forEach((el) => {
        el.classList.add("reveal-on-scroll");
        const parent = el.parentElement;
        if (!parent) {
          el.style.setProperty("--reveal-i", "0");
          return;
        }
        const next = (parentIndex.get(parent) ?? 0) + 1;
        parentIndex.set(parent, next);
        el.style.setProperty("--reveal-i", String(next - 1));
        parent.classList.add("reveal-group");
      });

      return nodes;
    };

    const nodes = markTargets();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          el.classList.add("is-revealed");
          observer.unobserve(el);
        }
      },
      {
        root: null,
        rootMargin: "0px 0px -8% 0px",
        threshold: 0.12,
      }
    );

    nodes.forEach((el) => {
      if (el.classList.contains("is-revealed")) return;
      observer.observe(el);
    });

    // Catch late-rendered cards (e.g. trips from sheet)
    const mutation = new MutationObserver(() => {
      markTargets().forEach((el) => {
        if (el.classList.contains("is-revealed")) return;
        observer.observe(el);
      });
    });
    mutation.observe(root, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutation.disconnect();
    };
  }, [enabled, refreshKey]);
}
