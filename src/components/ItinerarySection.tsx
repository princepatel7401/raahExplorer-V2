import { useState } from "react";
import type { SiteContent } from "../types/site";
import { SectionHeader } from "./SectionHeader";

export function ItinerarySection({ itinerary }: { itinerary: SiteContent["itinerary"] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeDay = itinerary.days[activeIndex];

  return (
    <section id="itinerary" className="section">
      <SectionHeader eyebrow={itinerary.eyebrow} title={itinerary.title} copy={itinerary.copy} />

      <div className="timeline" aria-label="Itinerary days — scroll sideways to see all days">
        {itinerary.days.map((day, index) => (
          <button
            type="button"
            className={`timeline-card ${index === activeIndex ? "active" : ""}`}
            key={day.day}
            onClick={() => setActiveIndex(index)}
            aria-pressed={index === activeIndex}
            aria-label={`${day.day}: ${day.title}`}
          >
            <span className="day-badge">{day.day}</span>
            <h3>{day.title}</h3>
            <p>{day.summary}</p>
          </button>
        ))}
      </div>

      <div className="itinerary-display visual-card">
        <div className="itinerary-photo">
          <img src={activeDay.image} alt={activeDay.title} />
        </div>
        <div className="itinerary-detail">
          <p className="eyebrow">{activeDay.eyebrow}</p>
          <h3>{activeDay.title}</h3>
          <p>{activeDay.description}</p>
          <ul className="detail-points">
            {activeDay.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
