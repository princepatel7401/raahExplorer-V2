/**
 * Returns true if the URL loads as an image in the browser (same behavior as <img>, including referrerPolicy).
 * Used before embedding images in PDF so missing/broken URLs are skipped instead of failing generation.
 */
export function probeImageUrl(url: string, timeoutMs = 12000): Promise<boolean> {
  const u = url.trim();
  if (!u) return Promise.resolve(false);

  return new Promise((resolve) => {
    const img = new Image();
    img.referrerPolicy = "no-referrer";
    const done = (ok: boolean) => {
      window.clearTimeout(timer);
      img.onload = null;
      img.onerror = null;
      resolve(ok);
    };
    const timer = window.setTimeout(() => done(false), timeoutMs);
    img.onload = () => done(true);
    img.onerror = () => done(false);
    img.src = u;
  });
}
