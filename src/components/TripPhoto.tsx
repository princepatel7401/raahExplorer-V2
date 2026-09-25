import { useCallback, useMemo, useState } from "react";
import { buildCollageImageSrcChain } from "../lib/resolveImageUrl";

type Props = {
  src?: string | null;
  title: string;
  subtitle?: string;
  alt?: string;
  loading?: "eager" | "lazy";
  className?: string;
  /** Visual tone for the designed fallback card */
  tone?: "cover" | "gallery" | "day";
  dayNumber?: number;
};

function hashTone(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) h = (h * 31 + input.charCodeAt(i)) >>> 0;
  return h % 5;
}

/**
 * Trip photo with designed title-card fallback when URL is missing or fails to load.
 */
export function TripPhoto({
  src,
  title,
  subtitle,
  alt,
  loading = "lazy",
  className,
  tone = "cover",
  dayNumber,
}: Props) {
  const trimmed = (src ?? "").trim();
  const chain = useMemo(
    () => (trimmed ? buildCollageImageSrcChain(trimmed) : []),
    [trimmed]
  );
  const [index, setIndex] = useState(0);
  const [failed, setFailed] = useState(!trimmed);

  const activeSrc = chain[index] ?? chain[0];
  const showFallback = failed || !activeSrc;
  const palette = hashTone(`${title}|${subtitle ?? ""}|${dayNumber ?? ""}`);

  const onError = useCallback(() => {
    setIndex((i) => {
      if (i + 1 < chain.length) return i + 1;
      setFailed(true);
      return i;
    });
  }, [chain.length]);

  if (showFallback) {
    return (
      <div
        className={`trip-photo trip-photo--fallback trip-photo--${tone} trip-photo--p${palette}${className ? ` ${className}` : ""}`}
        role="img"
        aria-label={alt || title}
      >
        <div className="trip-photo__glow" aria-hidden="true" />
        <div className="trip-photo__grain" aria-hidden="true" />
        <div className="trip-photo__copy">
          {tone === "day" && dayNumber != null ? (
            <span className="trip-photo__day">Day {dayNumber}</span>
          ) : null}
          <strong className="trip-photo__title">{title}</strong>
          {subtitle ? <span className="trip-photo__sub">{subtitle}</span> : null}
        </div>
      </div>
    );
  }

  return (
    <img
      className={`trip-photo${className ? ` ${className}` : ""}`}
      src={activeSrc}
      alt={alt || title}
      loading={loading}
      referrerPolicy="no-referrer"
      onError={onError}
    />
  );
}
