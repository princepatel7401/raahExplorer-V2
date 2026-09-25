import { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import type { SiteContent } from "../types/site";
import { useActiveNavHref } from "../hooks/useActiveNavHref";

interface HeaderProps {
  brand: SiteContent["brand"];
  nav: SiteContent["nav"];
  ctaLabel: string;
  ctaHref?: string;
  variant?: "default" | "destination";
  theme: "dark" | "light";
  onToggleTheme: () => void;
}

export function Header({
  brand,
  nav,
  ctaLabel,
  ctaHref = "#customize",
  variant = "default",
  theme,
  onToggleTheme,
}: HeaderProps) {
  const navHrefs = useMemo(() => nav.map((item) => item.href), [nav]);
  const activeHref = useActiveNavHref(navHrefs);
  const [scrolled, setScrolled] = useState(false);
  const isDestination = variant === "destination";
  const ctaExternal = /^https?:\/\//.test(ctaHref) || ctaHref.startsWith("mailto:") || ctaHref.startsWith("tel:");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={[
        "site-header",
        isDestination ? "site-header--destination" : "",
        scrolled ? "is-scrolled" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <a className="brand brand--logo-only" href="#top" aria-label={brand.name}>
        <span className="brand-mark">
          <img className="brand-logo" src="/logo.png" alt="" />
        </span>
      </a>

      <nav className="top-nav" aria-label="Primary">
        {nav.map((item) => {
          const isActive = item.href === activeHref;
          const external = /^https?:\/\//.test(item.href) || item.href.startsWith("mailto:");
          return (
            <a
              href={item.href}
              key={`${item.label}-${item.href}`}
              className={isActive ? "is-active" : undefined}
              aria-current={isActive ? "page" : undefined}
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              {item.label}
            </a>
          );
        })}
      </nav>

      <div className="header-actions">
        <button
          className="theme-toggle"
          type="button"
          onClick={onToggleTheme}
          aria-label={theme === "light" ? "Switch to dark theme" : "Switch to light theme"}
        >
          <FontAwesomeIcon icon={theme === "dark" ? faMoon : faSun} aria-hidden="true" />
        </button>
        <a
          className="header-cta"
          href={ctaHref}
          {...(ctaExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {ctaLabel}
        </a>
      </div>
    </header>
  );
}
