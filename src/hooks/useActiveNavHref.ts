import { useEffect, useState } from "react";

/**
 * Highlights the nav href that matches the section currently in view.
 * Sections are resolved in document order inside `main` (not nav order).
 */
export function useActiveNavHref(hrefs: string[]): string {
  const [activeHref, setActiveHref] = useState("");

  useEffect(() => {
    const navIds = new Set(hrefs.map((h) => h.replace(/^#/, "")));

    const run = () => {
      const root = document.querySelector("main");
      if (!root) return;

      const idsInOrder = Array.from(root.querySelectorAll("section[id]"))
        .map((el) => el.getAttribute("id"))
        .filter((id): id is string => Boolean(id && navIds.has(id)));

      const offset = 100;
      const y = window.scrollY;
      let next = "";

      for (const id of idsInOrder) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top + window.scrollY;
        if (top - offset <= y) {
          next = `#${id}`;
        }
      }

      const doc = document.documentElement;
      const nearBottom =
        window.innerHeight + window.scrollY >= doc.scrollHeight - Math.max(16, window.innerHeight * 0.03);
      if (nearBottom && idsInOrder.length) {
        next = `#${idsInOrder[idsInOrder.length - 1]}`;
      }

      setActiveHref((prev) => (prev === next ? prev : next));
    };

    run();
    window.addEventListener("scroll", run, { passive: true });
    window.addEventListener("resize", run);
    window.addEventListener("hashchange", run);
    return () => {
      window.removeEventListener("scroll", run);
      window.removeEventListener("resize", run);
      window.removeEventListener("hashchange", run);
    };
  }, [hrefs.join("|")]);

  return activeHref;
}
