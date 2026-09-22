import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faGlobeAsia,
  faHouseChimney,
  faPassport,
  faRoute,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";

const TRUST_ICONS: IconDefinition[] = [
  faRoute, // Custom personal trips
  faHouseChimney, // Domestic family holidays
  faGlobeAsia, // International vacations
  faUsers, // Domestic group departures
  faPassport, // Visa & travel support
];

export function TrustStripItemContent({ label, index }: { label: string; index: number }) {
  const icon = TRUST_ICONS[index] ?? faRoute;
  return (
    <>
      <span className="trust-strip__icon" aria-hidden="true">
        <FontAwesomeIcon icon={icon} />
      </span>
      <span className="trust-strip__label" role="tooltip">
        {label}
      </span>
    </>
  );
}
