/**
 * Google Drive images in `<img src>`: `uc?export=view` often returns HTML or 403.
 * The thumbnail API + fallbacks work more reliably for files shared as "Anyone with the link".
 */

export function extractGoogleDriveFileId(url: string): string | null {
  const u = url.trim();

  const m1 = /\/file\/d\/([a-zA-Z0-9_-]+)/.exec(u);
  if (m1) return m1[1]!;

  const m2 = /[?&]id=([a-zA-Z0-9_-]+)/.exec(u);
  if (m2) return m2[1]!;

  const m3 = /\/d\/([a-zA-Z0-9_-]+)/.exec(u);
  if (m3) return m3[1]!;

  return null;
}

/** Ordered URLs to try for a Drive file (first is preferred for `<img>`). */
export function googleDriveImageSrcCandidates(fileId: string): string[] {
  const id = fileId.trim();
  if (!id) return [];
  return [
    `https://drive.google.com/thumbnail?id=${id}&sz=w2000`,
    `https://drive.google.com/thumbnail?id=${id}&sz=w1600`,
    `https://drive.google.com/uc?export=view&id=${id}`,
    `https://drive.google.com/uc?id=${id}&export=view`,
  ];
}

/**
 * Turn Google Drive share links (and similar) into a URL for `<img src>`.
 * Files must be shared: "Anyone with the link" can view.
 */
export function resolveCollageImageUrl(raw: string): string {
  let s = raw.trim().replace(/^['\s]+/, "").trim();
  if (!s) return "";

  if (s.startsWith("//")) {
    s = `https:${s}`;
  } else if (/^www\.drive\.google\.com/i.test(s) || /^drive\.google\.com/i.test(s)) {
    s = `https://${s}`;
  }

  // Already a direct image / CDN URL (not Drive host)
  if (/^https?:\/\//i.test(s) && !/drive\.google\.com/i.test(s) && !/docs\.google\.com\/file/i.test(s)) {
    return s;
  }

  const id = extractGoogleDriveFileId(s);
  if (id) {
    const candidates = googleDriveImageSrcCandidates(id);
    return candidates[0] ?? s;
  }

  return s;
}

/** All distinct URLs to try for hero collage (Drive: multiple embed strategies; other: single). */
export function buildCollageImageSrcChain(resolvedSrc: string): string[] {
  const s = resolvedSrc.trim();
  if (!s) return [];

  const id = extractGoogleDriveFileId(s);
  if (id) {
    const list = googleDriveImageSrcCandidates(id);
    const seen = new Set<string>();
    const out: string[] = [];
    for (const u of list) {
      if (!seen.has(u)) {
        seen.add(u);
        out.push(u);
      }
    }
    return out;
  }

  return [s];
}
