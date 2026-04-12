/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Google Spreadsheet ID (from URL) — loads Trending Destinations + optional HeroCollage tab */
  readonly VITE_GOOGLE_TRIPS_SPREADSHEET_ID?: string;
  /** Optional: exact tab name for hero collage if not "HeroCollage" */
  readonly VITE_GOOGLE_HERO_COLLAGE_SHEET_NAME?: string;
}

