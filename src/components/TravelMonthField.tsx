import { useEffect, useState } from "react";
import { useMediaQuery } from "../hooks/useMediaQuery";

/** Match customizer mobile tweaks (stacked form, trip rail, etc.) */
const MOBILE_MONTH_QUERY = "(max-width: 900px)";

const MONTH_OPTIONS: { value: string; label: string }[] = [
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" }
];

function parseYm(s: string): { y: string; m: string } {
  const x = /^(\d{4})-(\d{2})$/.exec(s.trim());
  if (!x) return { y: "", m: "" };
  return { y: x[1]!, m: x[2]! };
}

function yearRange(min: string, max: string): number[] {
  const y0 = parseInt(min.slice(0, 4), 10);
  const y1 = parseInt(max.slice(0, 4), 10);
  if (!Number.isFinite(y0) || !Number.isFinite(y1)) return [];
  const out: number[] = [];
  for (let y = y0; y <= y1; y++) out.push(y);
  return out;
}

type Props = {
  id: string;
  value: string;
  onChange: (next: string) => void;
  invalid: boolean;
  min: string;
  max: string;
  ariaDescribedBy?: string;
};

export function TravelMonthField({ id, value, onChange, invalid, min, max, ariaDescribedBy }: Props) {
  const isMobile = useMediaQuery(MOBILE_MONTH_QUERY);
  const years = yearRange(min, max);
  const [{ y, m }, setYm] = useState(() => parseYm(value));

  useEffect(() => {
    setYm(parseYm(value));
  }, [value]);

  if (!isMobile) {
    return (
      <span className="customizer-month-wrap">
        <input
          id={id}
          type="month"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={invalid}
          aria-describedby={ariaDescribedBy}
          className={["customizer-month", !value.trim() ? "customizer-month--empty" : ""].filter(Boolean).join(" ")}
        />
      </span>
    );
  }

  const yearSelectId = `${id}-year`;
  const emptyMonth = !m;
  const emptyYear = !y;

  function commit(nextY: string, nextM: string) {
    setYm({ y: nextY, m: nextM });
    if (nextY && nextM) {
      onChange(`${nextY}-${nextM}`);
    } else {
      onChange("");
    }
  }

  return (
    <div className="customizer-month-mobile" role="group" aria-label="Travel month">
      <select
        id={id}
        className={`customizer-select ${emptyMonth ? "customizer-select--empty" : ""}`}
        value={m}
        onChange={(e) => commit(y, e.target.value)}
        aria-invalid={invalid}
        aria-describedby={ariaDescribedBy}
        aria-label="Month"
      >
        <option value="">Month</option>
        {MONTH_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <select
        id={yearSelectId}
        className={`customizer-select ${emptyYear ? "customizer-select--empty" : ""}`}
        value={y}
        onChange={(e) => commit(e.target.value, m)}
        aria-invalid={invalid}
        aria-describedby={ariaDescribedBy}
        aria-label="Year"
      >
        <option value="">Year</option>
        {years.map((yr) => (
          <option key={yr} value={String(yr)}>
            {yr}
          </option>
        ))}
      </select>
    </div>
  );
}
