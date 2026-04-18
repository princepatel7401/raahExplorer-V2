import { Font } from "@react-pdf/renderer";

/** @fontsource/poppins on unpkg — Latin .woff files work with react-pdf */
const POPPINS_PKG = "5.0.14";
const BASE = `https://unpkg.com/@fontsource/poppins@${POPPINS_PKG}/files`;

let registered = false;

/** Call before rendering the brochure PDF (safe to call more than once). */
export function registerBrochureFonts(): void {
  if (registered) return;
  registered = true;
  try {
    Font.register({
      family: "Poppins",
      fonts: [
        { src: `${BASE}/poppins-latin-300-normal.woff`, fontWeight: 300 },
        { src: `${BASE}/poppins-latin-400-normal.woff`, fontWeight: 400 },
        { src: `${BASE}/poppins-latin-600-normal.woff`, fontWeight: 600 },
        { src: `${BASE}/poppins-latin-700-normal.woff`, fontWeight: 700 },
      ],
    });
  } catch {
    /* HMR / duplicate register */
  }
}
