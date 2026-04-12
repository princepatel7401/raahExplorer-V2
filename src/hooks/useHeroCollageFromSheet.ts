import { useEffect, useRef, useState } from "react";
import type { SiteContent } from "../types/site";
import { fetchHeroCollageFromGoogleSheet } from "../services/heroCollageFromGoogleSheet";

export interface HeroCollageSheetState {
  collage: SiteContent["hero"]["collage"];
  loading: boolean;
  error: string | null;
  source: "sheet" | "fallback";
}

export function useHeroCollageFromSheet(hero: SiteContent["hero"]): HeroCollageSheetState {
  const hasSheetId = Boolean(import.meta.env.VITE_GOOGLE_TRIPS_SPREADSHEET_ID?.trim());
  const fallbackCollageRef = useRef(hero.collage);
  const [collage, setCollage] = useState(() => fallbackCollageRef.current);
  const [loading, setLoading] = useState(hasSheetId);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<"sheet" | "fallback">("fallback");

  useEffect(() => {
    const id = import.meta.env.VITE_GOOGLE_TRIPS_SPREADSHEET_ID?.trim();
    if (!id) {
      setCollage(fallbackCollageRef.current);
      setSource("fallback");
      setError(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchHeroCollageFromGoogleSheet(id)
      .then((rows) => {
        if (cancelled) return;
        if (rows.length > 0) {
          setCollage(rows);
          setSource("sheet");
          setError(null);
        } else {
          setCollage(fallbackCollageRef.current);
          setSource("fallback");
          setError(
            "Default hero photos are shown — no collage rows loaded from Google Sheets. Add tab HeroCollage (see public/sheet-templates/HeroCollage.csv) or set VITE_GOOGLE_HERO_COLLAGE_SHEET_NAME. Check the browser console for details."
          );
        }
        setLoading(false);
      })
      .catch((e: unknown) => {
        console.error("[HeroCollageSheet]", e);
        if (cancelled) return;
        setCollage(fallbackCollageRef.current);
        setError(e instanceof Error ? e.message : "Could not load hero collage from Google Sheet.");
        setSource("fallback");
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { collage, loading, error, source };
}
