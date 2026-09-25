import type { DestinationGroup, Trip } from "../types/site";

function tripShell(partial: Omit<Trip, "packages" | "departures" | "defaultPackageKey"> & {
  packages?: Trip["packages"];
  departures?: Trip["departures"];
  defaultPackageKey?: string;
}): Trip {
  const price = partial.startingPricePerPersonInr;
  return {
    ...partial,
    defaultPackageKey: partial.defaultPackageKey ?? "basic",
    packages: partial.packages ?? [
      {
        key: "basic",
        label: "Standard",
        pricePerPersonInr: price,
        hotels: [],
        itinerary: [],
      },
    ],
    departures: partial.departures ?? [],
  };
}

/** Default destination groups — each can hold multiple trip packages */
export const fallbackDestinations: DestinationGroup[] = [
  {
    id: "dest-thailand",
    category: "international",
    title: "Thailand",
    location: "Bangkok • Phuket • Pattaya",
    coverImage: "/International Destinations Labels/thailand.webp",
    summary: "Temples, islands, and street food — pick a trip style under Thailand.",
    trips: [
      tripShell({
        id: "thai-bangkok-4n5d",
        title: "Bangkok City Break",
        location: "Bangkok, Thailand",
        durationDays: 5,
        durationNights: 4,
        startingPricePerPersonInr: 42999,
        coverImage: "/International Destinations Labels/thailand.webp",
        gallery: [
          "/International Destinations Labels/thailand.webp",
          "/International Destinations Labels/singapore.webp",
          "/International Destinations Labels/malaysia.webp",
        ],
        highlights: ["Grand Palace visit", "Chao Phraya cruise", "Street-food walk"],
        includes: ["Airport transfers", "Hotel stay (4 nights)", "Daily breakfast", "Local support"],
        excludes: ["Flights", "Visa fees", "Personal expenses"],
        packages: [
          {
            key: "basic",
            label: "Standard",
            pricePerPersonInr: 42999,
            hotels: [{ city: "Bangkok", name: "Siam Central Hotel", nights: 4, rating: "4★" }],
            itinerary: [
              {
                day: 1,
                title: "Arrival Bangkok",
                summary: "Airport pickup and check-in.",
                activities: ["Private pickup", "Check-in"],
                mealsIncluded: [],
                image: "/International Destinations Labels/thailand.webp",
              },
              {
                day: 2,
                title: "City icons",
                summary: "Temples and river views.",
                activities: ["Grand Palace", "Wat Arun"],
                mealsIncluded: ["Breakfast"],
                image: "/International Destinations Labels/singapore.webp",
              },
              {
                day: 3,
                title: "Departure",
                summary: "Checkout and airport drop.",
                activities: ["Checkout", "Airport transfer"],
                mealsIncluded: ["Breakfast"],
                image: "/International Destinations Labels/malaysia.webp",
              },
            ],
          },
        ],
        departures: [{ id: "dep-bkk-1", startDate: "2026-11-05", endDate: "2026-11-09", groupTrip: false }],
      }),
      tripShell({
        id: "thai-phuket-5n6d",
        title: "Phuket Beach Escape",
        location: "Phuket, Thailand",
        durationDays: 6,
        durationNights: 5,
        startingPricePerPersonInr: 54999,
        coverImage: "/International Destinations Labels/maldives.webp",
        gallery: [
          "/International Destinations Labels/maldives.webp",
          "/International Destinations Labels/thailand.webp",
          "/International Destinations Labels/mauritius.webp",
        ],
        highlights: ["Patong leisure", "Island hopping", "Sunset viewpoint"],
        includes: ["Airport transfers", "Hotel stay (5 nights)", "Daily breakfast", "Speedboat day tour"],
        excludes: ["Flights", "Visa fees", "Water sports"],
        packages: [
          {
            key: "basic",
            label: "Standard",
            pricePerPersonInr: 54999,
            hotels: [{ city: "Phuket", name: "Andaman Bay Resort", nights: 5, rating: "4★" }],
            itinerary: [
              {
                day: 1,
                title: "Arrival Phuket",
                summary: "Beach check-in and free evening.",
                activities: ["Pickup", "Check-in"],
                mealsIncluded: [],
                image: "/International Destinations Labels/maldives.webp",
              },
              {
                day: 2,
                title: "Island hop",
                summary: "Phi Phi / nearby islands day.",
                activities: ["Speedboat", "Snorkel stop"],
                mealsIncluded: ["Breakfast", "Lunch"],
                image: "/International Destinations Labels/thailand.webp",
              },
              {
                day: 3,
                title: "Departure",
                summary: "Checkout and airport drop.",
                activities: ["Checkout"],
                mealsIncluded: ["Breakfast"],
                image: "/International Destinations Labels/mauritius.webp",
              },
            ],
          },
        ],
        departures: [{ id: "dep-hkt-1", startDate: "2026-11-12", endDate: "2026-11-17", groupTrip: false }],
      }),
      tripShell({
        id: "thai-combo-7n8d",
        title: "Bangkok + Phuket Combo",
        location: "Bangkok • Phuket",
        durationDays: 8,
        durationNights: 7,
        startingPricePerPersonInr: 68999,
        coverImage: "/International Destinations Labels/singapore.webp",
        gallery: [
          "/International Destinations Labels/singapore.webp",
          "/International Destinations Labels/thailand.webp",
          "/International Destinations Labels/maldives.webp",
        ],
        highlights: ["City + beach mix", "Internal flight assist", "Dual-hotel stay"],
        includes: ["Transfers", "Hotels (7 nights)", "Daily breakfast", "Local support"],
        excludes: ["International flights", "Visa", "Internal flight fare"],
        packages: [
          {
            key: "basic",
            label: "Standard",
            pricePerPersonInr: 68999,
            hotels: [
              { city: "Bangkok", name: "Siam Central Hotel", nights: 3, rating: "4★" },
              { city: "Phuket", name: "Andaman Bay Resort", nights: 4, rating: "4★" },
            ],
            itinerary: [
              {
                day: 1,
                title: "Arrive Bangkok",
                summary: "City start.",
                activities: ["Pickup", "Check-in"],
                mealsIncluded: [],
                image: "/International Destinations Labels/thailand.webp",
              },
              {
                day: 4,
                title: "Fly to Phuket",
                summary: "Beach leg begins.",
                activities: ["Transfer assist", "Check-in"],
                mealsIncluded: ["Breakfast"],
                image: "/International Destinations Labels/maldives.webp",
              },
              {
                day: 8,
                title: "Departure",
                summary: "Checkout and airport drop.",
                activities: ["Checkout"],
                mealsIncluded: ["Breakfast"],
                image: "/International Destinations Labels/singapore.webp",
              },
            ],
          },
        ],
        departures: [{ id: "dep-combo-1", startDate: "2026-12-01", endDate: "2026-12-08", groupTrip: false }],
      }),
    ],
  },
  {
    id: "dest-bali",
    category: "international",
    title: "Bali",
    location: "Bali, Indonesia",
    coverImage: "/International Destinations Labels/Bali.webp",
    summary: "Ubud culture and Seminyak shores.",
    trips: [
      tripShell({
        id: "int-bali-4n5d",
        title: "Bali Bliss Getaway",
        location: "Bali, Indonesia",
        durationDays: 5,
        durationNights: 4,
        startingPricePerPersonInr: 74999,
        coverImage: "/International Destinations Labels/Bali.webp",
        gallery: [
          "/International Destinations Labels/Bali.webp",
          "/International Destinations Labels/thailand.webp",
          "/International Destinations Labels/singapore.webp",
        ],
        highlights: ["Private airport transfers", "Ubud + Nusa Penida day tour", "Beach club evening"],
        includes: ["Airport transfers", "Hotel stay (4 nights)", "Daily breakfast", "Sightseeing transfers", "Local support"],
        excludes: ["Flights", "Visa fees", "Personal expenses", "Travel insurance"],
        packages: [
          {
            key: "basic",
            label: "Standard",
            pricePerPersonInr: 74999,
            hotels: [
              { city: "Ubud", name: "Ubud Serenity Resort", nights: 2, rating: "4★" },
              { city: "Seminyak", name: "Ocean Edge Suites", nights: 2, rating: "4★" },
            ],
            itinerary: [
              {
                day: 1,
                title: "Arrival + villa check-in",
                summary: "Airport pickup, check-in, relaxed evening.",
                activities: ["Private pickup", "Check-in assistance"],
                mealsIncluded: [],
                image: "/International Destinations Labels/Bali.webp",
              },
              {
                day: 2,
                title: "Ubud culture trail",
                summary: "Temples, rice terraces, artisan lanes.",
                activities: ["Temple visit", "Tegallalang viewpoint"],
                mealsIncluded: ["Breakfast"],
                image: "/International Destinations Labels/Bali.webp",
              },
              {
                day: 3,
                title: "Departure",
                summary: "Checkout + airport drop.",
                activities: ["Checkout", "Airport transfer"],
                mealsIncluded: ["Breakfast"],
                image: "/International Destinations Labels/maldives.webp",
              },
            ],
          },
        ],
        departures: [{ id: "dep-bali-1", startDate: "2026-10-12", endDate: "2026-10-16", groupTrip: false }],
      }),
    ],
  },
  {
    id: "dest-kashmir",
    category: "domestic",
    title: "Kashmir",
    location: "Srinagar • Gulmarg • Pahalgam",
    coverImage: "/Domestic Destinations Labels/kashmir.webp",
    summary: "Valley circuits with lake and mountain days.",
    trips: [
      tripShell({
        id: "dom-kashmir-4n5d",
        title: "Kashmir Scenic Circuit",
        location: "Srinagar • Gulmarg • Pahalgam",
        durationDays: 5,
        durationNights: 4,
        startingPricePerPersonInr: 32999,
        coverImage: "/Domestic Destinations Labels/kashmir.webp",
        gallery: [
          "/Domestic Destinations Labels/kashmir.webp",
          "/Domestic Destinations Labels/himalaya.webp",
          "/Domestic Destinations Labels/spiti.webp",
        ],
        highlights: ["Shikara ride", "Gulmarg gondola optional", "Valley viewpoints"],
        includes: ["Hotel stay (4 nights)", "Daily breakfast", "All transfers", "Local support"],
        excludes: ["Flights/Train tickets", "Entry fees", "Personal expenses"],
        packages: [
          {
            key: "basic",
            label: "Standard",
            pricePerPersonInr: 32999,
            hotels: [
              { city: "Srinagar", name: "Dal View Residency", nights: 2, rating: "3★" },
              { city: "Pahalgam", name: "Pine Valley Retreat", nights: 2, rating: "3★" },
            ],
            itinerary: [
              {
                day: 1,
                title: "Arrival Srinagar",
                summary: "Pickup and Dal Lake evening.",
                activities: ["Check-in", "Shikara ride"],
                mealsIncluded: [],
                image: "/Domestic Destinations Labels/kashmir.webp",
              },
              {
                day: 2,
                title: "Gulmarg day visit",
                summary: "Snow views and leisure.",
                activities: ["Gulmarg", "Gondola optional"],
                mealsIncluded: ["Breakfast"],
                image: "/Domestic Destinations Labels/spiti.webp",
              },
              {
                day: 3,
                title: "Departure",
                summary: "Checkout + return.",
                activities: ["Drop"],
                mealsIncluded: ["Breakfast"],
                image: "/Domestic Destinations Labels/himalaya.webp",
              },
            ],
          },
        ],
        departures: [{ id: "dep-kas-1", startDate: "2026-09-20", endDate: "2026-09-24", groupTrip: false }],
      }),
    ],
  },
  {
    id: "dest-manali",
    category: "group",
    title: "Manali",
    location: "Manali, Himachal",
    coverImage: "/Domestic Destinations Labels/himachal.webp",
    summary: "Fixed group departures with coordinator support.",
    trips: [
      tripShell({
        id: "grp-manali-3n4d",
        title: "Manali Group Departure",
        location: "Manali, Himachal",
        durationDays: 4,
        durationNights: 3,
        startingPricePerPersonInr: 17999,
        coverImage: "/Domestic Destinations Labels/himachal.webp",
        gallery: [
          "/Domestic Destinations Labels/himachal.webp",
          "/Domestic Destinations Labels/himachal_new.webp",
          "/Domestic Destinations Labels/himalaya.webp",
        ],
        highlights: ["Fixed departure", "Group transfers", "Local coordinator"],
        includes: ["Hotel stay (3 nights)", "Breakfast + dinner", "Group transfers", "Coordinator support"],
        excludes: ["Personal expenses", "Adventure activities", "Entry tickets"],
        packages: [
          {
            key: "basic",
            label: "Group Standard",
            pricePerPersonInr: 17999,
            hotels: [{ city: "Manali", name: "Snowline Inn", nights: 3, rating: "3★" }],
            itinerary: [
              {
                day: 1,
                title: "Arrival + briefing",
                summary: "Check-in and group meet.",
                activities: ["Check-in", "Group briefing"],
                mealsIncluded: ["Dinner"],
                image: "/Domestic Destinations Labels/himachal.webp",
              },
              {
                day: 2,
                title: "Solang day",
                summary: "Adventure options + views.",
                activities: ["Solang", "Adventure optional"],
                mealsIncluded: ["Breakfast", "Dinner"],
                image: "/Domestic Destinations Labels/spiti.webp",
              },
              {
                day: 3,
                title: "Departure",
                summary: "Checkout + return.",
                activities: ["Checkout"],
                mealsIncluded: ["Breakfast"],
                image: "/Domestic Destinations Labels/himalaya.webp",
              },
            ],
          },
        ],
        departures: [
          {
            id: "dep-man-1",
            startDate: "2026-10-01",
            endDate: "2026-10-04",
            groupTrip: true,
            seatsLeft: 18,
          },
        ],
      }),
    ],
  },
];

/** @deprecated use fallbackDestinations */
export const fallbackTrips = fallbackDestinations.flatMap((d) => d.trips);

export function destinationStartingPrice(dest: DestinationGroup): number {
  if (!dest.trips.length) return 0;
  return Math.min(...dest.trips.map((t) => t.startingPricePerPersonInr));
}
