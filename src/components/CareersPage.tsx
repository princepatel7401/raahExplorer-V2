import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBriefcase,
  faClock,
  faLocationDot,
  faUserClock,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import type { CareerRole, SiteContent } from "../types/site";

function applyMailto(email: string, role: CareerRole) {
  const subject = encodeURIComponent(`Application — ${role.title} | Raah Explorer`);
  const body = encodeURIComponent(
    `Hi Raah Explorer team,\n\nI am applying for the ${role.title} role (${role.type}, ${role.location}).\n\nName:\nPhone:\nLinkedIn / Portfolio:\n\nBrief note:\n\nThank you.`
  );
  return `mailto:${email}?subject=${subject}&body=${body}`;
}

function CareerCard({
  role,
  applyEmail,
  open,
  onToggle,
}: {
  role: CareerRole;
  applyEmail: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <article className={`career-card${open ? " is-open" : ""}`}>
      <button type="button" className="career-card__header" onClick={onToggle} aria-expanded={open}>
        <div className="career-card__titles">
          <span className="career-card__dept">{role.department}</span>
          <h3>{role.title}</h3>
          <p className="career-card__summary">{role.summary}</p>
        </div>
        <span className="career-card__chevron" aria-hidden="true">
          <FontAwesomeIcon icon={faChevronDown} />
        </span>
      </button>

      <div className="career-card__meta" aria-label="Role details">
        <span>
          <FontAwesomeIcon icon={faLocationDot} aria-hidden="true" />
          {role.location}
        </span>
        <span>
          <FontAwesomeIcon icon={faBriefcase} aria-hidden="true" />
          {role.type}
        </span>
        <span>
          <FontAwesomeIcon icon={faUserClock} aria-hidden="true" />
          {role.experience}
        </span>
        <span>
          <FontAwesomeIcon icon={faClock} aria-hidden="true" />
          {role.department}
        </span>
      </div>

      <div className="career-card__details" hidden={!open}>
        <div className="career-card__cols">
          <div>
            <h4>Responsibilities</h4>
            <ul>
              {role.responsibilities.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Requirements</h4>
            <ul>
              {role.requirements.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="career-card__perks">
          <h4>Perks</h4>
          <div className="career-card__perk-row">
            {role.perks.map((perk) => (
              <span key={perk}>{perk}</span>
            ))}
          </div>
        </div>
        <a className="btn btn-primary career-card__apply" href={applyMailto(applyEmail, role)}>
          Apply for this role
        </a>
      </div>
    </article>
  );
}

export function CareersPage({ careers }: { careers: SiteContent["careers"] }) {
  const [openId, setOpenId] = useState<string | null>(careers.roles[0]?.id ?? null);

  return (
    <main className="careers-page">
      <section className="careers-hero" id="careers" aria-label="Careers">
        <div className="careers-hero__copy">
          <p className="eyebrow">{careers.eyebrow}</p>
          <h1>{careers.title}</h1>
          <p className="careers-hero__lead">{careers.copy}</p>
          <p className="careers-hero__intro">{careers.intro}</p>
        </div>
        <aside className="careers-hero__aside" aria-label="Hiring snapshot">
          <div className="careers-stat">
            <strong>{careers.roles.length}</strong>
            <span>Open roles</span>
          </div>
          <div className="careers-stat">
            <strong>Ahmedabad</strong>
            <span>Base location</span>
          </div>
          <div className="careers-stat">
            <strong>Travel</strong>
            <span>Industry focus</span>
          </div>
        </aside>
      </section>

      <section className="careers-list section" aria-label="Open positions">
        <div className="section-head section-head--no-aside">
          <div>
            <h2>Open positions</h2>
          </div>
        </div>
        <div className="career-grid">
          {careers.roles.map((role) => (
            <CareerCard
              key={role.id}
              role={role}
              applyEmail={careers.applyEmail}
              open={openId === role.id}
              onToggle={() => setOpenId((id) => (id === role.id ? null : role.id))}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
