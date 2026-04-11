import { useEffect, useState } from "react";
import type { SiteContent, Trip } from "../types/site";
import { fetchTripsFromGoogleSheet } from "../services/tripsFromGoogleSheet";
import { fallbackTrips } from "../data/tripsFallback";

export interface TripsSheetState {
  trips: Trip[];
  loading: boolean;
  error: string | null;
  source: "sheet" | "fallback";
}

export function useTripsFromSheet(tripsBlock: SiteContent["trips"]): TripsSheetState {
  const hasSheetId = Boolean(import.meta.env.VITE_GOOGLE_TRIPS_SPREADSHEET_ID?.trim());
  const [trips, setTrips] = useState<Trip[]>(tripsBlock.trips);
  const [loading, setLoading] = useState(hasSheetId);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<"sheet" | "fallback">("fallback");

  useEffect(() => {
    const id = import.meta.env.VITE_GOOGLE_TRIPS_SPREADSHEET_ID?.trim();
    if (!id) {
      setTrips(fallbackTrips);
      setSource("fallback");
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchTripsFromGoogleSheet(id)
      .then((rows) => {
        if (cancelled) return;
        setTrips(rows);
        setSource("sheet");
        setLoading(false);
      })
      .catch((e: unknown) => {
        console.error("[TripsSheet]", e);
        if (cancelled) return;
        setTrips(fallbackTrips);
        setError(e instanceof Error ? e.message : "Could not load trips from Google Sheet.");
        setSource("fallback");
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { trips, loading, error, source };
}
