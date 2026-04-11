import { useMemo } from "react";
import type { SiteContent } from "../types/site";
import { useActiveNavHref } from "../hooks/useActiveNavHref";

interface HeaderProps {
  brand: SiteContent["brand"];
  nav: SiteContent["nav"];
  ctaLabel: string;
}

export function Header({ brand, nav, ctaLabel }: HeaderProps) {
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

      <a className="header-cta" href="#customize">
        {ctaLabel}
      </a>
    </header>
  );
}

