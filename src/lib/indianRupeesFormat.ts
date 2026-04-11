/** Digits only (for parsing). */
export function digitsOnly(input: string): string {
  return input.replace(/\D/g, "");
}

/**
 * Indian numbering: groups of 2 after the first 3 from the right (e.g. 1,00,000).
 */
export function formatIndianRupees(digitsRaw: string): string {
  const d = digitsOnly(digitsRaw);
  if (!d) return "";
  const n = d.replace(/^0+/, "") || "0";

  if (n.length <= 3) return n;

  const last3 = n.slice(-3);
  let front = n.slice(0, -3);
  const parts: string[] = [last3];
  while (front.length > 0) {
    if (front.length <= 2) {
      parts.unshift(front);
      break;
    }
    parts.unshift(front.slice(-2));
    front = front.slice(0, -2);
  }
  return parts.join(",");
}

const RANGE_SEP = /[-–—]/;

/**
 * One amount, or "min – max" with each side formatted (Indian grouping).
 */
export function formatIndianBudgetInput(raw: string): string {
  const match = raw.match(RANGE_SEP);
  if (!match || match.index === undefined) {
    return formatIndianRupees(raw);
  }
  const idx = match.index;
  const sep = raw[idx] === "-" ? "–" : raw[idx]!;
  const leftRaw = raw.slice(0, idx);
  const rightRaw = raw.slice(idx + 1);
  const left = formatIndianRupees(leftRaw);
  const right = formatIndianRupees(rightRaw);
  if (!left.trim() && right) {
    return `${sep} ${right}`;
  }
  if (!right) {
    return left ? `${left} ${sep} ` : "";
  }
  return `${left} ${sep} ${right}`;
}
