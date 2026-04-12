import Papa from "papaparse";

export function normKey(k: string): string {
  return k.replace(/^\uFEFF/, "").trim().toLowerCase();
}

export function rowMap(row: Record<string, string>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(row)) {
    out[normKey(k)] = v ?? "";
  }
  return out;
}

/** First matching column (case-insensitive header names). */
export function getSheetCell(row: Record<string, string>, ...keys: string[]): string {
  for (const k of keys) {
    const v = row[normKey(k)];
    if (v !== undefined && v !== "") return v;
  }
  return "";
}

function gvizUrl(spreadsheetId: string, sheetName: string): string {
  return `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;
}

export async function fetchGoogleSheetCsv(
  spreadsheetId: string,
  sheetName: string
): Promise<Record<string, string>[]> {
  const url = gvizUrl(spreadsheetId, sheetName);
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Google Sheet "${sheetName}" failed (${res.status}). Check sharing is "Anyone with the link can view".`);
  }
  const text = await res.text();
  const trimmed = text.trim();
  if (trimmed.startsWith("<!DOCTYPE") || trimmed.startsWith("<html")) {
    throw new Error(
      `Google Sheet "${sheetName}" returned HTML instead of CSV. Check the tab name matches exactly and the spreadsheet is shared ("Anyone with the link" → Viewer).`
    );
  }
  if (trimmed.includes("google.visualization.Query") && /"status"\s*:\s*"error"/i.test(trimmed)) {
    throw new Error(
      `Google Sheet "${sheetName}" query failed (invalid tab name or range). Create a tab named HeroCollage or set VITE_GOOGLE_HERO_COLLAGE_SHEET_NAME.`
    );
  }
  const parsed = Papa.parse<Record<string, string>>(text, {
    header: true,
    skipEmptyLines: true
  });
  if (parsed.errors.length) {
    console.warn(`CSV parse warnings (${sheetName}):`, parsed.errors);
  }
  return (parsed.data as Record<string, string>[]).map(rowMap);
}
