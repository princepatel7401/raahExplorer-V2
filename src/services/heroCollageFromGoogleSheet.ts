import { fetchGoogleSheetCsv, getSheetCell } from "./googleSheetCsv";
import { resolveCollageImageUrl } from "../lib/resolveImageUrl";

/** Hero CSS grid uses 6 cells; extra sheet rows are ignored */
const MAX_COLLAGE_IMAGES = 6;

const DEFAULT_TAB_NAMES = ["HeroCollage", "Hero Collage", "hero_collage", "Hero_collage", "HEROCOLLAGE"];

function parseSortOrder(s: string): number {
  const n = parseInt(String(s).replace(/,/g, "").trim(), 10);
  return Number.isFinite(n) ? n : 999;
}

/** If named columns are empty, use the first cell value that looks like a URL */
function guessUrlFromRow(row: Record<string, string>): string {
  for (const v of Object.values(row)) {
    const t = String(v ?? "").trim().replace(/^['\s]+/, "").trim();
    if (!t) continue;
    if (/^https?:\/\//i.test(t)) return t;
    if (/^\/\//.test(t)) return `https:${t}`;
    if (/drive\.google\.com/i.test(t) || /docs\.google\.com\/file/i.test(t)) return `https://${t.replace(/^\/+/, "")}`;
  }
  return "";
}

function tabNamesToTry(): string[] {
  const custom = import.meta.env.VITE_GOOGLE_HERO_COLLAGE_SHEET_NAME?.trim();
  if (custom) return [custom];
  return DEFAULT_TAB_NAMES;
}

export type HeroCollageItem = { src: string; alt: string };

function parseRows(rows: Record<string, string>[]): HeroCollageItem[] {
  const items: { order: number; src: string; alt: string }[] = [];

  for (const row of rows) {
    let rawUrl = getSheetCell(
      row,
      "image_url",
      "image url",
      "image",
      "photo",
      "picture",
      "url",
      "link",
      "drive_url",
      "src",
      "cover",
      "cover_image_url"
    );
    if (!rawUrl.trim()) {
      rawUrl = guessUrlFromRow(row);
    }
    if (!rawUrl.trim()) continue;

    const src = resolveCollageImageUrl(rawUrl);
    if (!src) continue;

    const alt =
      getSheetCell(row, "alt", "image_alt", "description", "caption", "label", "title").trim() || "Destination photo";

    const order = parseSortOrder(getSheetCell(row, "sort_order", "sort", "order", "#", "no", "num"));

    items.push({ order, src, alt });
  }

  items.sort((a, b) => a.order - b.order || 0);

  return items.slice(0, MAX_COLLAGE_IMAGES).map(({ src, alt }) => ({ src, alt }));
}

/**
 * Tab **HeroCollage** (or optional `VITE_GOOGLE_HERO_COLLAGE_SHEET_NAME`): columns `image_url` (or `url`, `link`, `image`, …),
 * optional `alt`, optional `sort_order`. Google Drive share links or any https image URL.
 */
export async function fetchHeroCollageFromGoogleSheet(spreadsheetId: string): Promise<HeroCollageItem[]> {
  const tabs = tabNamesToTry();
  const errors: string[] = [];

  for (const tab of tabs) {
    try {
      const rows = await fetchGoogleSheetCsv(spreadsheetId, tab);
      let items: HeroCollageItem[];
      try {
        items = parseRows(rows);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        errors.push(`Tab "${tab}" parse: ${msg}`);
        continue;
      }
      if (items.length > 0) {
        if (import.meta.env.DEV) {
          console.info(`[HeroCollage] Loaded ${items.length} image(s) from tab "${tab}".`);
        }
        return items;
      }
      errors.push(`Tab "${tab}": parsed ${rows.length} row(s) but no image URLs found.`);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      errors.push(`Tab "${tab}": ${msg}`);
    }
  }

  if (import.meta.env.DEV) {
    console.warn("[HeroCollage] Could not load collage from any tab. Tried:", tabs.join(", "));
    console.warn("[HeroCollage] Details:", errors);
  }

  return [];
}
