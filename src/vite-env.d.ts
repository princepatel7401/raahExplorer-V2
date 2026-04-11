/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Google Spreadsheet ID (from URL) — loads Trending Destinations from sheet tabs */
  readonly VITE_GOOGLE_TRIPS_SPREADSHEET_ID?: string;
}

