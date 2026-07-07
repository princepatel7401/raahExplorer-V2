import { useMemo } from "react";
import type { SiteContent } from "../types/site";
import { useActiveNavHref } from "../hooks/useActiveNavHref";

interface HeaderProps {
  brand: SiteContent["brand"];
  nav: SiteContent["nav"];
  ctaLabel: string;
  theme: "dark" | "light";
  onToggleTheme: () => void;
}

function ThemeIcon({ mode }: { mode: "dark" | "light" }) {
  if (mode === "light") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M21 14.5A8.5 8.5 0 0 1 10.5 4 7 7 0 1 0 21 14.5Z"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

export function Header({ brand, nav, ctaLabel, theme, onToggleTheme }: HeaderProps) {
  const navHrefs = useMemo(() => nav.map((item) => item.href), [nav]);
  const activeHref = useActiveNavHref(navHrefs);

  return (
    <header className="site-header">
      <a className="brand" href="#top">
        <span className="brand-mark" aria-hidden="true">
          <img className="brand-logo" src="/logo.png" alt="" />
        </span>
        <span>
          <strong>{brand.name}</strong>
          <small>{brand.tagline}</small>
        </span>
      </a>

      <nav className="top-nav" aria-label="Primary">
        {nav.map((item) => {
          const isActive = item.href === activeHref;
          return (
            <a
              href={item.href}
              key={item.href}
              className={isActive ? "is-active" : undefined}
              aria-current={isActive ? "page" : undefined}
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
          <ThemeIcon mode={theme === "light" ? "dark" : "light"} />
        </button>
        <a className="header-cta" href="#customize">
          {ctaLabel}
        </a>
      </div>
    </header>
  );
}

