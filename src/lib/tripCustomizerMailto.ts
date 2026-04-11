import type { CustomizerFieldOption } from "../types/site";

export const CUSTOMIZER_NOTIFY_EMAIL = "info@raahexplorer.com";

export function emptyCustomizerValues(fields: CustomizerFieldOption[]): Record<string, string> {
  const o: Record<string, string> = {};
  for (const f of fields) o[f.label] = "";
  return o;
}

function formatLine(label: string, value: string): string {
  const v = value.trim();
  if (label === "Travel Month" && /^\d{4}-\d{2}$/.test(v)) {
    const [y, mo] = v.split("-").map(Number);
    const human = new Date(y, mo - 1, 1).toLocaleString("en-IN", { month: "long", year: "numeric" });
    return `${label}: ${human}`;
  }
  if (label === "Budget Range" && v) {
    return `${label}: ₹${v} (INR)`;
  }
  return `${label}: ${v}`;
}

function formatBody(values: Record<string, string>): string {
  return Object.entries(values)
    .map(([k, v]) => formatLine(k, v))
    .join("\n");
}

/** Opens the visitor’s default mail app with a draft to info@raahexplorer.com (no third-party services). */
export function openCustomizerMailto(values: Record<string, string>): void {
  const subject = "Raah Explorer — Personalized plan request";
  const body = formatBody(values);
  const href = `mailto:${CUSTOMIZER_NOTIFY_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  const a = document.createElement("a");
  a.href = href;
  a.rel = "noopener noreferrer";
  document.body.appendChild(a);
  a.click();
  a.remove();
}
