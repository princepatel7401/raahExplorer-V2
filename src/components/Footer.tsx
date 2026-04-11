import type { SiteContent } from "../types/site";

interface FooterProps {
  brand: SiteContent["brand"];
  footer: SiteContent["footer"];
}

function Icon({ name }: { name: SiteContent["footer"]["contacts"][number]["icon"] | SiteContent["footer"]["socials"][number]["icon"] }) {
  switch (name) {
    case "phone":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.01-.24c1.11.37 2.31.57 3.58.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.07 21 3 13.93 3 5a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.27.2 2.47.57 3.58a1 1 0 0 1-.24 1.01l-2.2 2.2Z"
          />
        </svg>
      );
    case "email":
    case "mail":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 4.2-8 5.33L4 8.2V6l8 5.33L20 6v2.2Z"
          />
        </svg>
      );
    case "location":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5Z"
          />
        </svg>
      );
    case "facebook":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M13.5 22v-8h2.7l.4-3H13.5V9.1c0-.9.3-1.6 1.7-1.6h1.6V4.8c-.3 0-1.4-.1-2.7-.1-2.7 0-4.5 1.6-4.5 4.6V11H7v3h2.5v8h4Z"
          />
        </svg>
      );
    case "instagram":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm10 2H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3Zm-5 4a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm5.7-2.3a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0Z"
          />
        </svg>
      );
    case "twitter":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M19.9 7.4c0 .2 0 .4-.01.6C19.7 14.2 15.2 19 8.4 19c-2 0-3.8-.6-5.4-1.6h.9c1.6 0 3-.5 4.2-1.4-1.4 0-2.6-1-3-2.3.2 0 .4.1.7.1.3 0 .6 0 .9-.1-1.5-.3-2.6-1.6-2.6-3.2v-.04c.4.2 1 .4 1.5.4-1-.7-1.3-2.1-.6-3.2 1.6 1.9 4 3.1 6.7 3.3-.5-2 1-3.8 3-3.8.9 0 1.8.4 2.4 1.1.7-.1 1.4-.4 2-.8-.2.7-.7 1.4-1.4 1.8.6-.1 1.2-.2 1.8-.5-.4.6-.9 1.2-1.5 1.6Z"
          />
        </svg>
      );
    case "youtube":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M21.6 7.3a3 3 0 0 0-2.1-2.1C17.7 4.7 12 4.7 12 4.7s-5.7 0-7.5.5A3 3 0 0 0 2.4 7.3 31.3 31.3 0 0 0 2 12c0 1.6.1 3.1.4 4.7a3 3 0 0 0 2.1 2.1c1.8.5 7.5.5 7.5.5s5.7 0 7.5-.5a3 3 0 0 0 2.1-2.1c.3-1.6.4-3.1.4-4.7s-.1-3.1-.4-4.7ZM10 15.4V8.6L16 12l-6 3.4Z"
          />
        </svg>
      );
    case "linkedin":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M6.9 6.8a2 2 0 1 1 0-4 2 2 0 0 1 0 4ZM5 21V9h3.9v12H5Zm6.3 0V9h3.7v1.6h.05c.5-1 1.7-2.1 3.6-2.1 3.9 0 4.6 2.6 4.6 6V21h-3.9v-5.3c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9V21h-3.9Z"
          />
        </svg>
      );
    default:
      return null;
  }
}

export function Footer({ brand, footer }: FooterProps) {
  return (
    <footer className="site-footer" aria-label="Footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <a className="brand" href="#top">
            <span className="brand-mark" aria-hidden="true">
              <img className="brand-logo" src="/logo.png" alt="" />
            </span>
            <span>
              <strong>{brand.name}</strong>
              <small>ADVENTURE AWAITS</small>
            </span>
          </a>
        </div>

        <div className="footer-col">
          <h3>Quick Links</h3>
          <ul>
            {footer.quickLinks.map((l) => (
              <li key={l.label}>
                <a href={l.href}>{l.label}</a>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-col">
          <h3>Our Trips</h3>
          <ul className="footer-trips">
            {footer.tripLinks.map((l) => (
              <li key={l.label}>
                <span className="trip-dot" aria-hidden="true" />
                <a href={l.href}>{l.label}</a>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-col">
          <h3>Contact Us</h3>
          <ul className="footer-contact">
            {footer.contacts.map((c) => (
              <li key={`${c.icon}-${c.value}`}>
                <span className="footer-icon" aria-hidden="true">
                  <Icon name={c.icon} />
                </span>
                {c.href ? (
                  <a href={c.href}>{c.label}</a>
                ) : (
                  <span>{c.label}</span>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-col">
          <h3>Follow Us</h3>
          <div className="footer-socials">
            {footer.socials.map((s) => {
              const external = s.href.startsWith("http");
              return (
                <a
                  key={s.href}
                  className="social-btn"
                  href={s.href}
                  aria-label={s.label}
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  <Icon name={s.icon} />
                </a>
              );
            })}
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span className="footer-copy">{footer.copyright}</span>
        <nav className="footer-legal" aria-label="Legal">
          {footer.legalLinks.map((l) => (
            <a key={l.label} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}

