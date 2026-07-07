/** Normalize Google Sheet / CSV date strings to YYYY-MM-DD. */
export function normalizeSheetDate(raw: string): string {
  const s = raw.trim();
  if (!s) return "";

  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;

  const dmy = /^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/.exec(s);
  if (dmy) {
    const dd = dmy[1]!.padStart(2, "0");
    const mm = dmy[2]!.padStart(2, "0");
    const yyyy = dmy[3]!;
    return `${yyyy}-${mm}-${dd}`;
  }

  const parsed = new Date(s.includes("T") ? s : `${s}T00:00:00`);
  if (!Number.isNaN(parsed.getTime())) {
    const y = parsed.getFullYear();
    const m = String(parsed.getMonth() + 1).padStart(2, "0");
    const day = String(parsed.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }

  return s;
}

/** Display a sheet date in en-IN locale (e.g. 08 Oct 2026). */
export function formatTripDate(raw: string): string {
  const iso = normalizeSheetDate(raw);
  if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) {
    return raw.trim() || "Date TBA";
  }

  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) {
    return raw.trim() || "Date TBA";
  }

  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}
