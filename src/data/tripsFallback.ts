import type { Trip } from "../types/site";

/** Static Trending Destinations — replaced when `VITE_GOOGLE_TRIPS_SPREADSHEET_ID` loads live data */
export const fallbackTrips: Trip[] = [
  {
    id: "int-bali-4n5d",
    category: "international",
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
      "/International Destinations Labels/maldives.webp"
    ],
    highlights: ["Private airport transfers", "Ubud + Nusa Penida day tour", "Beach club evening", "Handpicked villas/hotels"],
    includes: ["Airport transfers", "Hotel stay (4 nights)", "Daily breakfast", "All sightseeing transfers", "Local support"],
    excludes: ["Flights", "Visa fees", "Personal expenses", "Meals other than mentioned", "Travel insurance"],
    defaultPackageKey: "basic",
    packages: [
      {
        key: "basic",
        label: "Basic",
        pricePerPersonInr: 74999,
        hotels: [
          { city: "Ubud", name: "Ubud Serenity Resort", nights: 2, rating: "4★" },
          { city: "Seminyak", name: "Ocean Edge Suites", nights: 2, rating: "4★" }
        ],
        itinerary: [
          {
            day: 1,
            title: "Arrival + villa check-in",
            summary: "Airport pickup, check-in, relaxed evening.",
            activities: ["Private pickup", "Check-in assistance", "Sunset cafe option"],
            mealsIncluded: [],
            image: "/International Destinations Labels/Bali.webp"
          },
          {
            day: 2,
            title: "Ubud culture trail",
            summary: "Temples, rice terraces, artisan lanes.",
            activities: ["Temple visit", "Tegallalang viewpoint", "Artisan market stop"],
            mealsIncluded: ["Breakfast"],
            image: "/International Destinations Labels/Bali.webp"
          },
          {
            day: 3,
            title: "Nusa Penida adventure",
            summary: "Speedboat excursion + scenic beaches.",
            activities: ["Boat transfers", "Beach viewpoints", "Snorkel option"],
            mealsIncluded: ["Breakfast"],
            image: "/International Destinations Labels/thailand.webp"
          },
          {
            day: 4,
            title: "Beach day + shopping",
            summary: "Free time + curated stops.",
            activities: ["Beach leisure", "Cafes", "Shopping street"],
            mealsIncluded: ["Breakfast"],
            image: "/International Destinations Labels/singapore.webp"
          },
          {
            day: 5,
            title: "Departure",
            summary: "Checkout + airport drop.",
            activities: ["Checkout", "Airport transfer"],
            mealsIncluded: ["Breakfast"],
            image: "/International Destinations Labels/maldives.webp"
          }
        ]
      },
      {
        key: "premium",
        label: "Premium",
        pricePerPersonInr: 92999,
        hotels: [
          { city: "Ubud", name: "Ubud Luxury Pool Villa Collection", nights: 2, rating: "5★" },
          { city: "Seminyak", name: "Ocean Edge Signature Suites", nights: 2, rating: "5★" }
        ],
        itinerary: [
          {
            day: 1,
            title: "VIP arrival + butler check-in",
            summary: "Private lounge assist, premium villa, sunset dining option.",
            activities: ["VIP pickup", "Butler check-in", "Chef tasting option"],
            mealsIncluded: ["Welcome drink"],
            image: "/International Destinations Labels/Bali.webp"
          },
          {
            day: 2,
            title: "Ubud culture + spa",
            summary: "Temples, terraces, artisan lanes — spa credit.",
            activities: ["Temple visit", "Tegallalang", "Spa session"],
            mealsIncluded: ["Breakfast", "High tea"],
            image: "/International Destinations Labels/Bali.webp"
          },
          {
            day: 3,
            title: "Nusa Penida premium cruise",
            summary: "Speedboat with premium deck + snorkel gear.",
            activities: ["Premium boat", "Scenic beaches", "Guided snorkel"],
            mealsIncluded: ["Breakfast", "Lunch on cruise"],
            image: "/International Destinations Labels/thailand.webp"
          },
          {
            day: 4,
            title: "Beach club + styling",
            summary: "Reserved beach club + shopping concierge.",
            activities: ["Beach club", "Concierge shopping", "Cafes"],
            mealsIncluded: ["Breakfast"],
            image: "/International Destinations Labels/singapore.webp"
          },
          {
            day: 5,
            title: "Departure",
            summary: "Checkout + airport transfer.",
            activities: ["Checkout", "Airport transfer"],
            mealsIncluded: ["Breakfast"],
            image: "/International Destinations Labels/maldives.webp"
          }
        ],
        includes: [
          "Airport transfers (premium vehicle)",
          "Hotel stay (4 nights) — 5★",
          "Daily breakfast + select meals",
          "All sightseeing transfers",
          "Local concierge"
        ]
      }
    ],
    departures: [
      { id: "dep-bali-2026-10-11", startDate: "2026-10-11", endDate: "2026-10-15", groupTrip: false },
      { id: "dep-bali-2026-12-18", startDate: "2026-12-18", endDate: "2026-12-22", groupTrip: true, seatsLeft: 14, pricePerPersonInr: 69999 }
    ]
  },
  {
    id: "int-malaysia-3n4d",
    category: "international",
    title: "Malaysia City + Highlands",
    location: "Kuala Lumpur, Malaysia",
    durationDays: 4,
    durationNights: 3,
    startingPricePerPersonInr: 58999,
    coverImage: "/International Destinations Labels/malaysia.webp",
    gallery: ["/International Destinations Labels/malaysia.webp", "/International Destinations Labels/Dubai.webp", "/International Destinations Labels/georgia.webp"],
    highlights: ["KL city tour", "Genting day visit", "Twin towers photo stop", "Comfort hotel locations"],
    includes: ["Hotel stay (3 nights)", "Daily breakfast", "Airport transfers", "City tour transfers"],
    excludes: ["Flights", "Visa fees", "Personal expenses", "Optional activities"],
    defaultPackageKey: "basic",
    packages: [
      {
        key: "basic",
        label: "Basic",
        pricePerPersonInr: 58999,
        hotels: [{ city: "Kuala Lumpur", name: "Central Skyline Hotel", nights: 3, rating: "4★" }],
        itinerary: [
          { day: 1, title: "Arrival + evening walk", summary: "Check-in and explore nearby markets.", activities: ["Airport pickup", "Local market"], mealsIncluded: [], image: "/International Destinations Labels/malaysia.webp" },
          { day: 2, title: "KL city tour", summary: "Iconic attractions + shopping.", activities: ["Twin towers", "City landmarks", "Shopping"], mealsIncluded: ["Breakfast"], image: "/International Destinations Labels/Dubai.webp" },
          { day: 3, title: "Genting Highlands", summary: "Cable car + leisure.", activities: ["Genting visit", "Cable car"], mealsIncluded: ["Breakfast"], image: "/International Destinations Labels/singapore.webp" },
          { day: 4, title: "Departure", summary: "Checkout and fly back.", activities: ["Airport transfer"], mealsIncluded: ["Breakfast"], image: "/International Destinations Labels/georgia.webp" }
        ]
      },
      {
        key: "premium",
        label: "Premium",
        pricePerPersonInr: 68999,
        hotels: [{ city: "Kuala Lumpur", name: "KL Skyline Grand (Club Floor)", nights: 3, rating: "5★" }],
        itinerary: [
          { day: 1, title: "Arrival + skyline evening", summary: "Premium check-in, lounge access.", activities: ["Airport pickup", "Club check-in", "Markets"], mealsIncluded: ["Evening canapés"], image: "/International Destinations Labels/malaysia.webp" },
          { day: 2, title: "KL city tour", summary: "Private vehicle + guide.", activities: ["Twin towers", "Landmarks", "Shopping"], mealsIncluded: ["Breakfast"], image: "/International Destinations Labels/Dubai.webp" },
          { day: 3, title: "Genting Highlands", summary: "Fast-track cable + leisure.", activities: ["Genting", "Cable car", "Priority lanes"], mealsIncluded: ["Breakfast"], image: "/International Destinations Labels/singapore.webp" },
          { day: 4, title: "Departure", summary: "Checkout and transfer.", activities: ["Airport transfer"], mealsIncluded: ["Breakfast"], image: "/International Destinations Labels/georgia.webp" }
        ]
      }
    ],
    departures: [{ id: "dep-mys-2026-09-05", startDate: "2026-09-05", endDate: "2026-09-08", groupTrip: false }]
  },
  {
    id: "dom-kashmir-4n5d",
    category: "domestic",
    title: "Kashmir Scenic Circuit",
    location: "Srinagar • Gulmarg • Pahalgam",
    durationDays: 5,
    durationNights: 4,
    startingPricePerPersonInr: 32999,
    coverImage: "/Domestic Destinations Labels/kashmir.webp",
    gallery: [
      "/Domestic Destinations Labels/kashmir.webp",
      "/Domestic Destinations Labels/uttarakhand.webp",
      "/Domestic Destinations Labels/himalaya.webp",
      "/Domestic Destinations Labels/spiti.webp"
    ],
    highlights: ["Shikara ride", "Gulmarg gondola (optional)", "Valley viewpoints", "Comfort transfers"],
    includes: ["Hotel stay (4 nights)", "Daily breakfast", "All transfers", "Local support"],
    excludes: ["Flights/Train tickets", "Entry fees", "Personal expenses", "Optional activities"],
    defaultPackageKey: "basic",
    packages: [
      {
        key: "basic",
        label: "Basic",
        pricePerPersonInr: 32999,
        hotels: [
          { city: "Srinagar", name: "Dal View Residency", nights: 2, rating: "3★" },
          { city: "Pahalgam", name: "Pine Valley Retreat", nights: 2, rating: "3★" }
        ],
        itinerary: [
          { day: 1, title: "Arrival Srinagar", summary: "Pickup and Dal Lake evening.", activities: ["Check-in", "Shikara ride"], mealsIncluded: [], image: "/Domestic Destinations Labels/kashmir.webp" },
          { day: 2, title: "Local sightseeing", summary: "Gardens + old city lanes.", activities: ["Mughal gardens", "Local markets"], mealsIncluded: ["Breakfast"], image: "/Domestic Destinations Labels/himalaya.webp" },
          { day: 3, title: "Gulmarg day visit", summary: "Snow views and leisure.", activities: ["Gulmarg", "Gondola optional"], mealsIncluded: ["Breakfast"], image: "/Domestic Destinations Labels/spiti.webp" },
          { day: 4, title: "Pahalgam transfer", summary: "Valley drive + riverside evening.", activities: ["Transfer", "Riverside walk"], mealsIncluded: ["Breakfast"], image: "/Domestic Destinations Labels/uttarakhand.webp" },
          { day: 5, title: "Departure", summary: "Checkout + return.", activities: ["Drop"], mealsIncluded: ["Breakfast"], image: "/Domestic Destinations Labels/maharastra.webp" }
        ]
      },
      {
        key: "premium",
        label: "Premium",
        pricePerPersonInr: 41999,
        hotels: [
          { city: "Srinagar", name: "Dal Heritage Luxury Houseboat", nights: 2, rating: "4★" },
          { city: "Pahalgam", name: "Pine Valley Premium Resort", nights: 2, rating: "4★" }
        ],
        itinerary: [
          { day: 1, title: "Arrival Srinagar", summary: "Premium houseboat + Dal evening.", activities: ["Check-in", "Extended Shikara"], mealsIncluded: ["Kahwa"], image: "/Domestic Destinations Labels/kashmir.webp" },
          { day: 2, title: "Local sightseeing", summary: "Private vehicle + gardens.", activities: ["Mughal gardens", "Markets"], mealsIncluded: ["Breakfast"], image: "/Domestic Destinations Labels/himalaya.webp" },
          { day: 3, title: "Gulmarg day visit", summary: "Priority gondola slots.", activities: ["Gulmarg", "Gondola optional"], mealsIncluded: ["Breakfast"], image: "/Domestic Destinations Labels/spiti.webp" },
          { day: 4, title: "Pahalgam transfer", summary: "Scenic drive + riverside.", activities: ["Transfer", "Nature walk"], mealsIncluded: ["Breakfast"], image: "/Domestic Destinations Labels/uttarakhand.webp" },
          { day: 5, title: "Departure", summary: "Checkout + return.", activities: ["Drop"], mealsIncluded: ["Breakfast"], image: "/Domestic Destinations Labels/maharastra.webp" }
        ]
      }
    ],
    departures: [
      { id: "dep-kas-2026-08-12", startDate: "2026-08-12", endDate: "2026-08-16", groupTrip: false },
      { id: "dep-kas-2026-10-02", startDate: "2026-10-02", endDate: "2026-10-06", groupTrip: true, seatsLeft: 9, pricePerPersonInr: 29999 }
    ]
  },
  {
    id: "grp-manali-3n4d",
    category: "group",
    title: "Manali Group Departure",
    location: "Manali, Himachal",
    durationDays: 4,
    durationNights: 3,
    startingPricePerPersonInr: 17999,
    coverImage: "/Domestic Destinations Labels/himachal.webp",
    gallery: ["/Domestic Destinations Labels/himachal.webp", "/Domestic Destinations Labels/himachal_new.webp", "/Domestic Destinations Labels/himalaya.webp"],
    highlights: ["Fixed departure", "Group transfers", "Local coordinator", "Budget-friendly stays"],
    includes: ["Hotel stay (3 nights)", "Breakfast + dinner", "Group transfers", "Coordinator support"],
    excludes: ["Personal expenses", "Adventure activities", "Entry tickets"],
    defaultPackageKey: "basic",
    packages: [
      {
        key: "basic",
        label: "Basic",
        pricePerPersonInr: 17999,
        hotels: [{ city: "Manali", name: "Snowline Inn", nights: 3, rating: "3★" }],
        itinerary: [
          { day: 1, title: "Arrival + briefing", summary: "Check-in and group meet.", activities: ["Check-in", "Group briefing"], mealsIncluded: ["Dinner"], image: "/Domestic Destinations Labels/himachal.webp" },
          { day: 2, title: "Local sightseeing", summary: "Town spots + cafes.", activities: ["Local spots", "Cafe hop"], mealsIncluded: ["Breakfast", "Dinner"], image: "/Domestic Destinations Labels/himalaya.webp" },
          { day: 3, title: "Solang day", summary: "Adventure options + views.", activities: ["Solang", "Adventure optional"], mealsIncluded: ["Breakfast", "Dinner"], image: "/Domestic Destinations Labels/spiti.webp" },
          { day: 4, title: "Departure", summary: "Checkout + return.", activities: ["Checkout"], mealsIncluded: ["Breakfast"], image: "/Domestic Destinations Labels/uttarakhand.webp" }
        ]
      },
      {
        key: "premium",
        label: "Premium",
        pricePerPersonInr: 21999,
        hotels: [{ city: "Manali", name: "Snowline Inn — Deluxe Wing", nights: 3, rating: "4★" }],
        itinerary: [
          { day: 1, title: "Arrival + briefing", summary: "Deluxe rooms + coordinator.", activities: ["Check-in", "Group briefing"], mealsIncluded: ["Dinner"], image: "/Domestic Destinations Labels/himachal.webp" },
          { day: 2, title: "Local sightseeing", summary: "Private group van + cafes.", activities: ["Local spots", "Cafe hop"], mealsIncluded: ["Breakfast", "Dinner"], image: "/Domestic Destinations Labels/himalaya.webp" },
          { day: 3, title: "Solang day", summary: "Priority activity slots.", activities: ["Solang", "Adventure optional"], mealsIncluded: ["Breakfast", "Dinner"], image: "/Domestic Destinations Labels/spiti.webp" },
          { day: 4, title: "Departure", summary: "Checkout + return.", activities: ["Checkout"], mealsIncluded: ["Breakfast"], image: "/Domestic Destinations Labels/uttarakhand.webp" }
        ]
      }
    ],
    departures: [
      { id: "dep-man-2026-07-10", startDate: "2026-07-10", endDate: "2026-07-13", groupTrip: true, seatsLeft: 22 },
      { id: "dep-man-2026-08-21", startDate: "2026-08-21", endDate: "2026-08-24", groupTrip: true, seatsLeft: 18, pricePerPersonInr: 18999 }
    ]
  }
];
