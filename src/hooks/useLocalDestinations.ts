import { useCallback, useEffect, useState } from "react";
import type { DestinationGroup, Trip, TripCategoryKey } from "../types/site";
import { fallbackDestinations } from "../data/tripsFallback";

const STORAGE_KEY = "raah-destinations-v1";
const LEGACY_KEY = "raah-trips-v1";

function clone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v)) as T;
}

function isDestinationGroup(x: unknown): x is DestinationGroup {
  return Boolean(x && typeof x === "object" && Array.isArray((x as DestinationGroup).trips));
}

function migrateLegacyTrips(raw: unknown): DestinationGroup[] | null {
  if (!Array.isArray(raw) || !raw.length) return null;
  if (isDestinationGroup(raw[0])) return raw as DestinationGroup[];

  // Old flat Trip[] with category on each trip
  const legacy = raw as Array<Trip & { category?: TripCategoryKey }>;
  return legacy.map((t, i) => {
    const { category, ...trip } = t;
    return {
      id: `dest-migrated-${trip.id || i}`,
      category: category ?? "international",
      title: trip.title || "Destination",
      location: trip.location || "",
      coverImage: trip.coverImage || "",
      summary: "",
      trips: [trip as Trip],
    };
  });
}

function loadDestinations(): DestinationGroup[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) ?? localStorage.getItem(LEGACY_KEY);
    if (!raw) return clone(fallbackDestinations);
    const parsed = JSON.parse(raw) as unknown;
    const migrated = migrateLegacyTrips(parsed);
    if (!migrated?.length) return clone(fallbackDestinations);
    return migrated;
  } catch {
    return clone(fallbackDestinations);
  }
}

export interface LocalDestinationsState {
  destinations: DestinationGroup[];
  setDestinations: (destinations: DestinationGroup[]) => void;
}

export function useLocalDestinations(): LocalDestinationsState {
  const [destinations, setDestinationsState] = useState<DestinationGroup[]>(() =>
    typeof window !== "undefined" ? loadDestinations() : clone(fallbackDestinations)
  );

  const setDestinations = useCallback((next: DestinationGroup[]) => {
    const copy = clone(next);
    setDestinationsState(copy);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(copy));
      localStorage.removeItem(LEGACY_KEY);
    } catch (e) {
      console.error("[LocalDestinations] save failed", e);
    }
  }, []);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY && e.key !== LEGACY_KEY) return;
      setDestinationsState(loadDestinations());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return { destinations, setDestinations };
}
