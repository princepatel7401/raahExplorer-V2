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
  return Boolean(p.title.trim() || p.message.trim() || p.imageUrl.trim() || p.highlight.trim());
}

export function pickActivePopup(popups: PromoPopup[]): PromoPopup | null {
  const today = todayIso();
  return popups.find((p) => isPopupActiveNow(p, today)) ?? null;
}
