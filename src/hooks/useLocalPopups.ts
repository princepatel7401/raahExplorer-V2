import { useCallback, useEffect, useState } from "react";
import type { PromoPopup } from "../types/site";

const STORAGE_KEY = "raah-popups-v2";

const defaultPopups: PromoPopup[] = [
  {
    id: "promo-festival-sample",
    enabled: true,
    kind: "festival",
    title: "Festival Escape Offer",
    message: "Celebrate the season with curated getaways — limited festive departures with special stays.",
    imageUrl: "/International Destinations Labels/maldives.webp",
    ctaLabel: "Explore offers",
    ctaHref: "#trips",
    startDate: "",
    endDate: "",
  },
];

function clone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v)) as T;
}

function loadPopups(): PromoPopup[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Migrate from v1 if present
      const legacy = localStorage.getItem("raah-popups-v1");
      if (legacy) {
        const parsed = JSON.parse(legacy) as unknown;
        if (Array.isArray(parsed) && parsed.length) {
          const list = parsed as PromoPopup[];
          // Ensure at least one enabled so the teaser is visible
          if (!list.some((p) => p.enabled)) {
            list[0] = { ...list[0], enabled: true };
          }
          localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
          return list;
        }
      }
      return clone(defaultPopups);
    }
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed) || !parsed.length) return clone(defaultPopups);
    return parsed as PromoPopup[];
  } catch {
    return clone(defaultPopups);
  }
}

export function useLocalPopups() {
  const [popups, setPopupsState] = useState<PromoPopup[]>(() =>
    typeof window !== "undefined" ? loadPopups() : clone(defaultPopups)
  );

  const setPopups = useCallback((next: PromoPopup[]) => {
    const copy = clone(next);
    setPopupsState(copy);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(copy));
    } catch (e) {
      console.error("[LocalPopups] save failed", e);
    }
  }, []);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY) return;
      setPopupsState(loadPopups());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return { popups, setPopups };
}

export function emptyPromoPopup(): PromoPopup {
  return {
    id: `promo-${Date.now()}`,
    enabled: true,
    kind: "festival",
    title: "New offer",
    message: "",
    imageUrl: "",
    ctaLabel: "Learn more",
    ctaHref: "#trips",
    startDate: "",
    endDate: "",
  };
}

function todayIso(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function isPopupActiveNow(p: PromoPopup, today = todayIso()): boolean {
  if (!p.enabled) return false;
  if (p.startDate && today < p.startDate) return false;
  if (p.endDate && today > p.endDate) return false;
  return Boolean(p.title.trim() || p.message.trim() || p.imageUrl.trim());
}

export function pickActivePopup(popups: PromoPopup[]): PromoPopup | null {
  const today = todayIso();
  return popups.find((p) => isPopupActiveNow(p, today)) ?? null;
}
