import type {
  Trip,
  TripCategoryKey,
  TripDeparture,
  TripHotel,
  TripItineraryDay,
  TripPackageBundle
} from "../types/site";
import { fetchGoogleSheetCsv, getSheetCell } from "./googleSheetCsv";

const SHEETS = ["TripsMaster", "TripPackages", "TripHotels", "TripItinerary", "TripDepartures", "TripGallery"] as const;

type SheetName = (typeof SHEETS)[number];

function get(row: Record<string, string>, ...keys: string[]): string {
  return getSheetCell(row, ...keys);
}

function splitPipe(s: string): string[] {
  return s
    .split("|")
    .map((x) => x.trim())
    .filter(Boolean);
}

function parseBool(s: string): boolean {
  const x = s.trim().toLowerCase();
  return x === "true" || x === "yes" || x === "1";
}

function parseIntSafe(s: string, fallback = 0): number {
  const n = parseInt(String(s).replace(/,/g, ""), 10);
  return Number.isFinite(n) ? n : fallback;
}

function fetchCsv(spreadsheetId: string, sheet: SheetName): Promise<Record<string, string>[]> {
  return fetchGoogleSheetCsv(spreadsheetId, sheet);
}

/** Maps TripsMaster.category → site tabs: international | domestic | group */
function categorySafe(s: string): TripCategoryKey {
  const v = s.trim().toLowerCase();
  if (v === "international" || v === "domestic" || v === "group") return v;
  return "international";
}

export async function fetchTripsFromGoogleSheet(spreadsheetId: string): Promise<Trip[]> {
  const [master, packages, hotels, itinerary, departures, gallery] = await Promise.all([
    fetchCsv(spreadsheetId, "TripsMaster"),
    fetchCsv(spreadsheetId, "TripPackages"),
    fetchCsv(spreadsheetId, "TripHotels"),
    fetchCsv(spreadsheetId, "TripItinerary"),
    fetchCsv(spreadsheetId, "TripDepartures"),
    fetchCsv(spreadsheetId, "TripGallery")
  ]);

  const pkgByTrip = new Map<string, typeof packages>();
  for (const r of packages) {
    const tid = get(r, "trip_id", "tripid");
    if (!tid) continue;
    if (!pkgByTrip.has(tid)) pkgByTrip.set(tid, []);
    pkgByTrip.get(tid)!.push(r);
  }

  const hotelsBy = new Map<string, TripHotel[]>();
  for (const r of hotels) {
    const tid = get(r, "trip_id", "tripid");
    const pk = get(r, "package_key", "packagekey");
    if (!tid || !pk) continue;
    const key = `${tid}::${pk}`;
    const h: TripHotel = {
      city: get(r, "city"),
      name: get(r, "hotel_name", "hotel name", "name"),
      nights: parseIntSafe(get(r, "nights", "night"), 1),
      rating: get(r, "rating") || undefined
    };
    if (!hotelsBy.has(key)) hotelsBy.set(key, []);
    hotelsBy.get(key)!.push(h);
  }

  const daysBy = new Map<string, TripItineraryDay[]>();
  for (const r of itinerary) {
    const tid = get(r, "trip_id", "tripid");
    const pk = get(r, "package_key", "packagekey");
    if (!tid || !pk) continue;
    const key = `${tid}::${pk}`;
    const imageUrls = splitPipe(get(r, "image_urls", "images", "images_urls", "imageurls"));
    const day: TripItineraryDay = {
      day: parseIntSafe(get(r, "day_number", "day", "daynumber"), 1),
      title: get(r, "title"),
      summary: get(r, "summary", "description"),
      activities: splitPipe(get(r, "activities", "activity")),
      mealsIncluded: splitPipe(get(r, "meals_included", "meals", "mealsincluded")),
      // Allow multiple images in a pipe-separated column; first is used in UI/PDF today.
      image: imageUrls[0] || get(r, "image_url", "image", "imageurl")
    };
    if (!daysBy.has(key)) daysBy.set(key, []);
    daysBy.get(key)!.push(day);
  }
  for (const [, days] of daysBy) {
    days.sort((a, b) => a.day - b.day);
  }

  const depsByTrip = new Map<string, TripDeparture[]>();
  for (const r of departures) {
    const tid = get(r, "trip_id", "tripid");
    if (!tid) continue;
    if (!depsByTrip.has(tid)) depsByTrip.set(tid, []);
    const list = depsByTrip.get(tid)!;
    const po = get(r, "price_override_inr", "price_override", "priceoverride");
    const depId = get(r, "departure_id", "departure id", "id");
    const dep: TripDeparture = {
      id: depId || `${tid}-dep-${list.length}`,
      startDate: get(r, "start_date", "startdate", "start"),
      endDate: get(r, "end_date", "enddate", "end"),
      groupTrip: parseBool(get(r, "group_trip", "grouptrip", "group")),
      seatsLeft: get(r, "seats_left", "seats", "seatsleft") ? parseIntSafe(get(r, "seats_left", "seats", "seatsleft")) : undefined,
      pricePerPersonInr: po ? parseIntSafe(po) : undefined
    };
    list.push(dep);
  }

  const galleryByTrip = new Map<string, string[]>();
  for (const r of gallery) {
    const tid = get(r, "trip_id", "tripid", "id");
    const url = get(r, "image_url", "image", "imageurl", "url");
    if (!tid || !url) continue;
    if (!galleryByTrip.has(tid)) galleryByTrip.set(tid, []);
    galleryByTrip.get(tid)!.push(url);
  }

  const trips: Trip[] = [];

  for (const m of master) {
    const id = get(m, "trip_id", "tripid", "id");
    if (!id) continue;

    const pkgRows = pkgByTrip.get(id) ?? [];
    if (!pkgRows.length) {
      console.warn(`[TripsSheet] Trip "${id}" has no rows in TripPackages — skipped.`);
      continue;
    }

    const bundles: TripPackageBundle[] = [];
    for (const pr of pkgRows) {
      const pk = get(pr, "package_key", "packagekey");
      if (!pk) continue;
      const key = `${id}::${pk}`;
      const incOverride = get(pr, "includes_override", "includesoverride");
      const excOverride = get(pr, "excludes_override", "excludesoverride");
      bundles.push({
        key: pk,
        label: get(pr, "package_label", "packagelabel", "label") || pk,
        pricePerPersonInr: parseIntSafe(get(pr, "price_per_person_inr", "price", "priceinr"), 0),
        hotels: hotelsBy.get(key) ?? [],
        itinerary: daysBy.get(key) ?? [],
        includes: incOverride ? splitPipe(incOverride) : undefined,
        excludes: excOverride ? splitPipe(excOverride) : undefined
      });
    }

    if (!bundles.length) continue;

    const defaultKey = get(m, "default_package_key", "defaultpackage", "default_package") || bundles[0]!.key;
    const prices = bundles.map((b) => b.pricePerPersonInr).filter((n) => n > 0);
    const starting = prices.length ? Math.min(...prices) : 0;

    const trip: Trip = {
      id,
      category: categorySafe(get(m, "category", "cat")),
      title: get(m, "title", "name"),
      location: get(m, "location", "loc"),
      durationDays: parseIntSafe(get(m, "duration_days", "days"), 1),
      durationNights: parseIntSafe(get(m, "duration_nights", "nights"), 0),
      startingPricePerPersonInr: starting,
      coverImage: get(m, "cover_image_url", "cover", "coverimage"),
      gallery: galleryByTrip.get(id) ?? splitPipe(get(m, "gallery_urls", "gallery", "galleryurls")),
      highlights: splitPipe(get(m, "highlights")),
      includes: splitPipe(get(m, "includes")),
      excludes: splitPipe(get(m, "excludes")),
      packages: bundles,
      defaultPackageKey: bundles.some((b) => b.key === defaultKey) ? defaultKey : bundles[0]!.key,
      departures: depsByTrip.get(id) ?? []
    };

    trips.push(trip);
  }

  if (!trips.length) {
    throw new Error("No valid trips parsed from sheet (check tab names and trip_id).");
  }

  return trips;
}
