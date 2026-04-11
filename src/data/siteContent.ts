import type { SiteContent } from "../types/site";
import { fallbackTrips } from "./tripsFallback";

export const siteContent: SiteContent = {
  brand: {
    name: "Raah Explorer",
    tagline: "Future-forward journeys"
  },
  nav: [
    { label: "Journeys", href: "#journeys" },
    { label: "Trips", href: "#trips" },
    { label: "Itinerary", href: "#itinerary" },
    { label: "Gallery", href: "#gallery" },
    { label: "Q&A", href: "#faq" },
    { label: "Customize", href: "#customize" }
  ],
  hero: {
    eyebrow: "Domestic, International, Group & Custom Trips",
    title: "Travel beyond packages with a smarter way to plan every journey.",
    text: "Raah Explorer creates premium domestic holidays, international escapes, curated group tours, and fully custom personal trips with detailed day-wise itinerary planning, stays, transport, experiences, and support from start to finish.",
    primaryCta: "Customize Your Trip",
    secondaryCta: "See Day-wise Plan",
    imageLabel: "Himalayan valleys · beaches · cities — curated for you",
    collage: [
      { src: "/Himalaya/Himalaya-background.png", alt: "Himalayan valley at golden hour" },
      { src: "/Domestic Destinations Labels/himachal.webp", alt: "Himachal hills" },
      { src: "/Domestic Destinations Labels/spiti.webp", alt: "Spiti landscape" },
      { src: "/International Destinations Labels/maldives.webp", alt: "Maldives coast" },
      { src: "/International Destinations Labels/Bali.webp", alt: "Bali scenery" },
      { src: "/Domestic Destinations Labels/kashmir.webp", alt: "Kashmir lakes and mountains" }
    ],
    metricCards: [
      { value: "1200+", label: "Trips designed" },
      { value: "32", label: "International routes" },
      { value: "4.9/5", label: "Traveler satisfaction" }
    ]
  },
  trustStrip: [
    "Custom personal trips",
    "Domestic family holidays",
    "International vacations",
    "Domestic group departures",
    "Visa & travel support"
  ],
  journeys: {
    eyebrow: "Journey Formats",
    title: "Trips built around the kind of explorer you are",
    copy: "Choose a ready travel format or let Raah Explorer build a route from scratch with dates, destinations, transport, stays, sightseeing, and cost planning aligned to your exact preferences.",
    items: [
      {
        tag: "Domestic Custom Trips",
        title: "Hill stations, beaches, culture loops, and luxury getaways across India",
        description: "Designed for couples, families, solo explorers, and premium stay seekers.",
        image: "/Images/tropical-beach-with-hut-kayaks-palm-trees.jpg"
      },
      {
        tag: "International Escapes",
        title: "Handcrafted global holidays with visa guidance, route planning and local experiences",
        description: "Perfect for honeymooners, milestone travelers, and global city explorers.",
        image: "/Images/travel-composition-with-hand-holding-pencil.jpg"
      },
      {
        tag: "Domestic Group Tours",
        title: "Fixed departures and curated group journeys with coordinated logistics",
        description: "Ideal for corporate groups, friend circles, schools, and themed travel communities.",
        image: "/Images/pexels-bertellifotografia-3856033.jpg"
      }
    ]
  },
  customizer: {
    eyebrow: "Trip Customizer",
    title: "Build your personal trip with clear details before you even pack",
    copy: "Share your dream route, budget range, travel style, stay preference, and group size. We convert it into a complete proposal with day-wise flow and cost logic.",
    fields: [
      {
        label: "Destination Type",
        type: "select",
        options: ["Domestic", "International", "Domestic Group Tour", "Custom Multi-country"]
      },
      {
        label: "Travel Month",
        type: "month"
      },
      {
        label: "Travelers",
        type: "text",
        placeholder: "2 Adults, 1 Child"
      },
      {
        label: "Budget Range",
        type: "inr",
        placeholder: "e.g. 1,50,000 or 1,00,000 – 2,50,000"
      },
      {
        label: "Preferred Destinations",
        type: "text",
        placeholder: "Bali, Ubud, Nusa Penida"
      },
      {
        label: "Experience Goals",
        type: "textarea",
        placeholder: "Sunrise viewpoints, private villa stay, water activities, local culture walk, and a relaxed final day."
      }
    ],
    includedTitle: "Included In Planning",
    includedItems: [
      "Flight or transfer routing guidance",
      "Hotel category and stay-night allocation",
      "Day-wise sightseeing and rest balance",
      "Meal notes, activity notes, and pickup points",
      "Budget alignment with upgrade options",
      "Human support before and during travel"
    ],
    submitLabel: "Request Personalized Plan"
  },
  itinerary: {
    eyebrow: "Day-wise Itinerary",
    title: "Every trip comes with a clear day-by-day plan",
    copy: "Here is an example of how Raah Explorer presents a custom trip so travelers know what happens each day, where they stay, and how the experience flows from arrival to return.",
    days: [
      {
        day: "Day 1",
        title: "Arrival and luxury check-in",
        summary: "Airport pickup, private transfer, villa check-in, sunset dinner experience.",
        eyebrow: "Day 1 Highlights",
        description: "Welcome at the airport, premium transfer to your stay, a slow arrival afternoon, and a sunset dining experience designed to start the journey beautifully.",
        points: [
          "Private airport pickup and fast-track hotel check-in",
          "Evening skyline view or beachside dinner",
          "Local support manager available on call"
        ],
        image: "/Images/pexels-oleksiy-konstantinidi-2147541276-30769052.jpg"
      },
      {
        day: "Day 2",
        title: "Local culture and temple trail",
        summary: "Breakfast, guided temple circuit, artisan village stop, evening leisure.",
        eyebrow: "Day 2 Highlights",
        description: "Start the morning with a guided cultural route, visit iconic spiritual landmarks, and blend sightseeing with local food and slow exploration.",
        points: [
          "Breakfast and heritage route planning",
          "Temple and culture circuit with guide support",
          "Leisure evening with local shopping or cafe stop"
        ],
        image: "/Images/pexels-roman-saienko-1867764487-30954090.jpg"
      },
      {
        day: "Day 3",
        title: "Adventure and island exploration",
        summary: "Speedboat excursion, snorkeling, beach club halt, photography session.",
        eyebrow: "Day 3 Highlights",
        description: "This is the active day of the journey with water experiences, coastal viewpoints, and a flexible afternoon designed around pace and comfort.",
        points: [
          "Curated activity schedule with transfer support",
          "Water adventure or scenic island hop",
          "Golden hour photo stop and relaxed dinner"
        ],
        image: "/Images/pexels-abinaya-palanichamy-2160399839-36696891.jpg"
      },
      {
        day: "Day 4",
        title: "Slow day and curated departure",
        summary: "Wellness breakfast, free time, shopping stop, airport drop with support.",
        eyebrow: "Day 4 Highlights",
        description: "The final day keeps things light, letting travelers enjoy a calm breakfast, packing support, souvenir stop, and stress-free departure handling.",
        points: [
          "Late breakfast and checkout coordination",
          "Optional final stop for shopping or wellness",
          "Airport transfer with schedule assistance"
        ],
        image: "/Images/pexels-josiahfarrow-3396660.jpg"
      }
    ]
  },
  gallery: {
    eyebrow: "Destination Visuals",
    title: "Explore the mood of journeys before you book them",
    copy: "From domestic mountain escapes to international island stays, Raah Explorer presents every journey with visual storytelling.",
    items: [
      {
        title: "International Signature",
        subtitle: "Curated long-haul luxury and scenic escapes",
        image: "/Images/pexels-asadphoto-14615249.jpg"
      },
      {
        title: "Domestic Hidden Routes",
        subtitle: "Slow travel with cinematic landscapes",
        image: "/Images/pexels-shobith-m-586341645-17292964.jpg"
      },
      {
        title: "Group Departures",
        subtitle: "Managed domestic tours with planned comfort",
        image: "/Images/pexels-omkar-pendsay-432283713-17259764.jpg"
      }
    ]
  },
  testimonials: {
    eyebrow: "Why Travelers Choose Us",
    title: "More than bookings. We design journeys that flow right.",
    items: [
      {
        quote: "The day-wise itinerary was so clear that we never felt lost. Every transfer and stay felt pre-thought.",
        name: "Priya & Arjun",
        trip: "Bali custom trip"
      },
      {
        quote: "Raah Explorer planned our domestic group trip beautifully. The route, timing, and hotel choices were perfect.",
        name: "Corporate Travel Lead",
        trip: "Himachal group departure"
      },
      {
        quote: "We gave only our budget and travel style. They returned a complete international plan with amazing detail.",
        name: "Megha S.",
        trip: "Europe personalized itinerary"
      }
    ]
  },
  faq: {
    eyebrow: "Q&A Section",
    title: "Common traveler questions answered before you book",
    items: [
      {
        question: "What is the Q&A section?",
        answer: "This Q&A section is your traveler help area. It answers common questions about trip customization, inclusions, planning process, group departures, and support before and during the journey."
      },
      {
        question: "Can Raah Explorer create a fully custom personal trip?",
        answer: "Yes. You can share your destination, dates, group size, budget, travel style, and special preferences. The team builds a custom trip proposal with day-wise itinerary, hotel suggestions, transfers, sightseeing, and support."
      },
      {
        question: "Do you provide both domestic and international tours?",
        answer: "Yes. Raah Explorer handles domestic custom trips, international vacations, and domestic group departures."
      },
      {
        question: "How do I update content on the website?",
        answer: "You only need to update the data file in src/data/siteContent.ts and replace images inside public/assets. The site reads that content automatically across all sections."
      }
    ]
  },
  cta: {
    eyebrow: "Raah Explorer",
    title: "Ready to design your next journey?",
    text: "Tell us where you want to go and how you want to feel when you get there.",
    buttonLabel: "Start Your Travel Plan"
  },
  footer: {
    quickLinks: [
      { label: "Home", href: "#top" },
      { label: "Tours", href: "#journeys" },
      { label: "Gallery", href: "#gallery" },
      { label: "About Us", href: "#faq" },
      { label: "Contact", href: "#customize" }
    ],
    tripLinks: [
      { label: "Trending Trips", href: "#journeys" },
      { label: "International Trips", href: "#journeys" },
      { label: "Domestic Trips", href: "#journeys" }
    ],
    contacts: [
      { icon: "phone", label: "88664 25004", value: "88664 25004", href: "tel:+918866425004" },
      { icon: "phone", label: "88667 15004", value: "88667 15004", href: "tel:+918866715004" },
      { icon: "email", label: "info@raahexplorer.com", value: "info@raahexplorer.com", href: "mailto:info@raahexplorer.com" },
      {
        icon: "location",
        label: "312, Shreeya Amalga, Opp. Maple County Road, Thaltej, Ahmedabad, Gujarat 380059",
        value: "312, Shreeya Amalga, Opp. Maple County Road, Thaltej, Ahmedabad, Gujarat 380059"
      }
    ],
    socials: [
      { icon: "facebook", label: "Facebook", href: "https://www.facebook.com/profile.php?id=61563169937550" },
      { icon: "mail", label: "Email", href: "mailto:info@raahexplorer.com" },
      { icon: "instagram", label: "Instagram", href: "https://www.instagram.com/raah.explorer/" },
      { icon: "twitter", label: "Twitter", href: "https://x.com/RaahExplorer" },
      { icon: "youtube", label: "YouTube", href: "https://youtube.com/@cliffhikers?si=7Dvy2tPDAmC7bUpg" },
      { icon: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/company/cliff-hikers/?viewAsMember=true" }
    ],
    legalLinks: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" }
    ],
    copyright: "© 2025 Raah Explorer. All rights reserved."
  },
  trips: {
    eyebrow: "Trending Destinations",
    title: "Trending Destinations",
    copy: "Most popular destinations this season",
    categories: [
      {
        key: "international",
        label: "International Trips",
        description: "Visa-ready itineraries, premium stays, and seamless city-to-island routing.",
        coverImage: "/International Destinations Labels/malaysia.webp"
      },
      {
        key: "domestic",
        label: "Domestic Trips",
        description: "Hill stations, beaches, culture circuits, and stay-first weekend getaways.",
        coverImage: "/Domestic Destinations Labels/kashmir.webp"
      },
      {
        key: "group",
        label: "Group Trips",
        description: "Fixed departures with coordinated logistics, guide support, and group pricing.",
        coverImage: "/Domestic Destinations Labels/himachal.webp"
      }
    ],
    trips: fallbackTrips
  }
};

