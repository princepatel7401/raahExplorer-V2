import { useCallback, useEffect, useState } from "react";
import type { PromoPopup } from "../types/site";

const STORAGE_KEY = "raah-popups-v3";

const defaultPopups: PromoPopup[] = [
  {
    id: "promo-festival-sample",
    enabled: true,
    kind: "festival",
    highlight: "5% OFF",
    title: "5% off on booking",
    message: "Book any trip this festival season and enjoy an instant 5% discount on your package.",
    imageUrl: "/International Destinations Labels/maldives.webp",
    startDate: "",
    endDate: "",
  },
];

function clone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v)) as T;
}

function normalizePopup(raw: Record<string, unknown>): PromoPopup {
  return {
    id: String(raw.id ?? `promo-${Date.now()}`),
    enabled: Boolean(raw.enabled),
    kind: raw.kind === "daily" ? "daily" : "festival",
    highlight: String(raw.highlight ?? ""),
    title: String(raw.title ?? ""),
    message: String(raw.message ?? ""),
    imageUrl: String(raw.imageUrl ?? ""),
    startDate: String(raw.startDate ?? ""),
    endDate: String(raw.endDate ?? ""),
  };
}

function loadPopups(): PromoPopup[] {
  try {
    const raw =
      localStorage.getItem(STORAGE_KEY) ??
      localStorage.getItem("raah-popups-v2") ??
      localStorage.getItem("raah-popups-v1");
    if (!raw) return clone(defaultPopups);
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed) || !parsed.length) return clone(defaultPopups);
    const list = (parsed as Record<string, unknown>[]).map(normalizePopup);
    if (!list.some((p) => p.enabled)) list[0] = { ...list[0], enabled: true };
    return list.map((p) => {
      if (p.id === "promo-festival-sample" && !p.highlight) {
        return { ...clone(defaultPopups[0]), enabled: p.enabled !== false };
      }
      return p;
    });
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
    highlight: "5% OFF",
    title: "5% off on booking",
    message: "",
    imageUrl: "",
    startDate: "",
    endDate: "",
  };
}

export function todayIso(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function hasPopupContent(p: PromoPopup): boolean {
  return Boolean(p.title.trim() || p.message.trim() || p.imageUrl.trim() || p.highlight.trim());
}

/** Inclusive window for a popup; null = always (festival only). */
export function popupDateWindow(p: PromoPopup): { start: string; end: string } | null {
  if (p.kind === "daily") {
    if (!p.startDate) return null;
    return { start: p.startDate, end: p.endDate || p.startDate };
  }
  if (!p.startDate && !p.endDate) return null;
  return {
    start: p.startDate || "0000-01-01",
    end: p.endDate || "9999-12-31",
  };
}

export type PopupVisibility = "live" | "scheduled" | "ended" | "off" | "needs-date" | "empty";

export function getPopupVisibility(p: PromoPopup, today = todayIso()): PopupVisibility {
  if (!p.enabled) return "off";
  if (!hasPopupContent(p)) return "empty";

  if (p.kind === "daily" && !p.startDate) return "needs-date";

  if (p.startDate && p.endDate && p.startDate > p.endDate) return "ended";

  const window = popupDateWindow(p);
  if (!window) return "live";
  if (today < window.start) return "scheduled";
  if (today > window.end) return "ended";
  return "live";
}

export function isPopupActiveNow(p: PromoPopup, today = todayIso()): boolean {
  return getPopupVisibility(p, today) === "live";
}

/** All live popups for the site UI — dailies first, then festivals (list order). */
export function listActivePopups(popups: PromoPopup[]): PromoPopup[] {
  const today = todayIso();
  const live = popups.filter((p) => isPopupActiveNow(p, today));
  const dailies = live.filter((p) => p.kind === "daily");
  const festivals = live.filter((p) => p.kind === "festival");
  const other = live.filter((p) => p.kind !== "daily" && p.kind !== "festival");
  return [...dailies, ...festivals, ...other];
}

/** @deprecated Prefer listActivePopups — kept for single-item callers */
export function pickActivePopup(popups: PromoPopup[]): PromoPopup | null {
  return listActivePopups(popups)[0] ?? null;
}
