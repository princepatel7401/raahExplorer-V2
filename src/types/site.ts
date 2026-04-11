export interface NavItem {
  label: string;
  href: string;
}

export interface Metric {
  value: string;
  label: string;
}

export interface Journey {
  tag: string;
  title: string;
  description: string;
  image: string;
}

export interface CustomizerFieldOption {
  label: string;
  type: "text" | "textarea" | "select" | "email" | "month" | "inr";
  placeholder?: string;
  options?: string[];
}

export interface ItineraryDay {
  day: string;
  title: string;
  summary: string;
  eyebrow: string;
  description: string;
  points: string[];
  image: string;
}

export interface GalleryItem {
  title: string;
  subtitle: string;
  image: string;
  tall?: boolean;
}

export interface Quote {
  quote: string;
  name: string;
  trip: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterSocialLink {
  label: string;
  href: string;
  icon: "mail" | "facebook" | "instagram" | "twitter" | "youtube" | "linkedin";
}

export interface FooterContactItem {
  label: string;
  value: string;
  href?: string;
  icon: "phone" | "email" | "location";
}

export type TripCategoryKey = "international" | "domestic" | "group";

export interface TripCategory {
  key: TripCategoryKey;
  label: string;
  description: string;
  coverImage: string;
}

export interface TripDeparture {
  id: string;
  startDate: string;
  endDate: string;
  groupTrip: boolean;
  seatsLeft?: number;
  /** If set, overrides the selected package price for this departure */
  pricePerPersonInr?: number;
}

export interface TripHotel {
  city: string;
  name: string;
  nights: number;
  rating?: string;
}

export interface TripItineraryDay {
  day: number;
  title: string;
  summary: string;
  activities: string[];
  mealsIncluded?: string[];
  image: string;
}

/** One sellable tier (Basic / Premium / …) with its own stays, plan, and price */
export interface TripPackageBundle {
  key: string;
  label: string;
  pricePerPersonInr: number;
  hotels: TripHotel[];
  itinerary: TripItineraryDay[];
  /** Optional overrides; if omitted, trip-level includes/excludes are shown */
  includes?: string[];
  excludes?: string[];
}

export interface Trip {
  id: string;
  category: TripCategoryKey;
  title: string;
  location: string;
  durationDays: number;
  durationNights: number;
  /** Lowest package price — used on cards */
  startingPricePerPersonInr: number;
  coverImage: string;
  gallery: string[];
  highlights: string[];
  includes: string[];
  excludes: string[];
  packages: TripPackageBundle[];
  /** Pre-selected tier in the trip modal */
  defaultPackageKey: string;
  departures: TripDeparture[];
}

export interface SiteContent {
  brand: {
    name: string;
    tagline: string;
  };
  nav: NavItem[];
  hero: {
    eyebrow: string;
    title: string;
    text: string;
    primaryCta: string;
    secondaryCta: string;
    /** Minimal caption above the tour collage (kept small in CSS) */
    imageLabel: string;
    /** Ordered for grid: large tile first, then side stack, then bottom row */
    collage: Array<{ src: string; alt: string }>;
    metricCards: Metric[];
  };
  trustStrip: string[];
  journeys: {
    eyebrow: string;
    title: string;
    copy: string;
    items: Journey[];
  };
  customizer: {
    eyebrow: string;
    title: string;
    copy: string;
    fields: CustomizerFieldOption[];
    includedTitle: string;
    includedItems: string[];
    submitLabel: string;
  };
  itinerary: {
    eyebrow: string;
    title: string;
    copy: string;
    days: ItineraryDay[];
  };
  gallery: {
    eyebrow: string;
    title: string;
    copy: string;
    items: GalleryItem[];
  };
  testimonials: {
    eyebrow: string;
    title: string;
    items: Quote[];
  };
  faq: {
    eyebrow: string;
    title: string;
    items: FaqItem[];
  };
  cta: {
    eyebrow: string;
    title: string;
    text: string;
    buttonLabel: string;
  };
  footer: {
    quickLinks: FooterLink[];
    tripLinks: FooterLink[];
    contacts: FooterContactItem[];
    socials: FooterSocialLink[];
    legalLinks: FooterLink[];
    copyright: string;
  };
  trips: {
    eyebrow: string;
    title: string;
    copy: string;
    categories: TripCategory[];
    trips: Trip[];
  };
}

