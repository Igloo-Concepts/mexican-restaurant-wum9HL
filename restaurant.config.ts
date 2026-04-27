/**
 * Single source of truth that the AI freely edits per project to make every
 * generation feel unique. Screens and components read from this config rather
 * than hardcoding content OR structure — structural variety lives in
 * `config.layout`.
 */
export type LayoutPreset = "classic" | "elegant" | "casual" | "modern";

export type NavVariant =
  | "bottomTabs"
  | "pillTabs"
  | "iconOnlyTabs"
  | "minimalTopTabs"
  | "floatingDock"
  | "centerRaised"
  | "segmented"
  | "underlineTop"
  | "indicatorBar"
  | "curvedBottom"
  | "labeledDock";

export type HeroVariant =
  | "fullBleed"
  | "split"
  | "boxed"
  | "editorial"
  | "minimal"
  | "marquee";

export type MenuVariant =
  | "chips"
  | "accordion"
  | "grid"
  | "magazine"
  | "compactList";

export type GalleryVariant =
  | "grid"
  | "masonry"
  | "heroStrip"
  | "carousel"
  | "fullBleedStack";

export type EventsVariant = "cards" | "timeline" | "magazine" | "list";

export type LocationVariant = "standard" | "compact" | "hero";

export type TypographyPreset =
  | "modernSans"
  | "serifDisplay"
  | "editorialSerif"
  | "rounded"
  | "monoMinimal"
  | "boldCondensed"
  | "warmSerif"
  | "elegantItalic"
  | "heavyDisplay"
  | "decorative"
  | "geometric"
  | "classicEditorial";

export type Density = "airy" | "comfortable" | "compact";

export type CornerStyle = "sharp" | "rounded" | "pill";

export type DecorStyle =
  | "none"
  | "underline"
  | "dividers"
  | "serifRule"
  | "dottedRule"
  | "ornament";

export type Mood =
  | "bright"
  | "warm"
  | "dark"
  | "pastel"
  | "highContrast"
  | "earthy"
  | "monochrome";

export interface LayoutConfig {
  nav: NavVariant;
  hero: HeroVariant;
  menu: MenuVariant;
  gallery: GalleryVariant;
  events: EventsVariant;
  location: LocationVariant;
  typography: TypographyPreset;
  density: Density;
  cornerStyle?: CornerStyle;
  decor?: DecorStyle;
  mood?: Mood;
  tabBarHiddenRoutes?: string[];
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  category: string;
  image?: string;
  tags?: string[];
  allergens?: string[];
  calories?: string;
}

export interface EventItem {
  id: string;
  title: string;
  date: string;
  description: string;
  image?: string;
}

export interface LocationRecord {
  id: string;
  name: string;
  address: string;
  phone?: string;
  mapsUrl?: string;
  hours?: { day: string; hours: string }[];
  primary?: boolean;
  heroImage?: string;
}

/**
 * Feature flags for the paid, backend-powered modules (Phase 2). Each entry
 * is enabled by the AI via the `enableModule` tool on the platform side; the
 * template reads these at runtime to conditionally register tab screens and
 * show the matching UI. Free-plan users never see `enabled: true` here
 * because the AI refuses to flip the flag and sends an upgrade paywall
 * instead.
 */
export interface ModulesConfig {
  /**
   * Optional copy of Manage → Reservations opening hours (sessions per weekday).
   * Baked in at provision so the app still constrains times if the hours API fails.
   */
  reservations?: {
    enabled: boolean;
    depositCents?: number;
    partySizeMax?: number;
    weeklyHours?: Record<
      string,
      Array<{ open: string; close: string }>
    >;
    /** Spacing between bookable times inside each session (15, 30, or 60). */
    slotIntervalMinutes?: number;
    /** Date-specific closures from Manage → Reservations settings. */
    bookingOverrides?: Array<{
      date: string;
      closedAllDay?: boolean;
      closedWindows?: Array<{ open: string; close: string }>;
    }>;
  };
  menuCms?: { enabled: boolean };
  catering?: { enabled: boolean; minGuests?: number };
  pushCampaigns?: { enabled: boolean };
  customerAccounts?: { enabled: boolean; requireForOrdering?: boolean };
  multiLocation?: { enabled: boolean; locations?: LocationRecord[] };
  jobs?: { enabled: boolean; roles?: string[] };
  photoWall?: { enabled: boolean; requireApproval?: boolean };
}

/**
 * Platform backend connection. Populated at provision-time by the Plate
 * platform — DO NOT hand-edit these. Missing apiBase means the generated
 * app runs in "no-backend" mode: module screens still render but any
 * submit action shows a friendly "backend not reachable" notice.
 */
export interface TenantConfig {
  projectId: string;
  apiBase: string;
  apiKey: string;
}

export interface RestaurantConfig {
  name: string;
  tagline: string;
  about: string;
  preset: LayoutPreset;
  theme: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    muted: string;
    accent: string;
    fontHeading: string;
    fontBody: string;
    radius: number;
  };
  /**
   * Structural design variants. Each field swaps in a different component
   * implementation at runtime so two projects with similar colors can still
   * look dramatically different. The AI is expected to pick a non-default
   * combination per project.
   */
  layout?: LayoutConfig;
  hero: {
    image: string;
    cta: string;
    /** Optional secondary CTA label. Used by some hero variants. */
    secondaryCta?: string;
    /** Optional supporting copy shown above/below the main title. */
    eyebrow?: string;
  };
  contact: {
    address: string;
    phone: string;
    email: string;
    mapsUrl: string;
    hours: { day: string; hours: string }[];
    social?: { instagram?: string; facebook?: string; tiktok?: string };
  };
  menu: { categories: string[]; items: MenuItem[] };
  gallery: string[];
  events: EventItem[];
  /** Paid backend modules (reservations, menu CMS, etc.) — opt-in per project. */
  modules?: ModulesConfig;
  /** Platform-injected tenant credentials (do not hand-edit). */
  tenant?: TenantConfig;
}

export const restaurantConfig: RestaurantConfig = {
  name: "La Chispa",
  tagline: "Vibrant Mexican Street Food & Cocktails",
  about: "A fun, funky taqueria bringing the bold flavors and electric energy of Mexico City street food to Austin. Late-night tacos, craft margaritas, and a party atmosphere.",
  preset: "modern",
  theme: {
    primary: "#FF1493",
    secondary: "#39FF14",
    background: "#1A0A2E",
    surface: "#2D1B4E",
    text: "#FFFFFF",
    muted: "#B8A9D4",
    accent: "#FFD700",
    fontHeading: "Bebas Neue",
    fontBody: "Inter",
    radius: 0,
  },
  layout: {
    previewWebTopInset: 16,
    nav: "pillTabs",
    hero: "marquee",
    menu: "grid",
    gallery: "masonry",
    events: "timeline",
    location: "hero",
    typography: "boldCondensed",
    density: "compact",
    cornerStyle: "sharp",
    decor: "underline",
    mood: "bright",
    tabBarHiddenRoutes: ["gallery", "events", "catering"],
  },
  hero: {
    image: "https://storage.googleapis.com/imagenai-api-public-us-central1/c3a0e1e0-0e1f-4f3f-8f3f-0e1f4f3f8f3f/0.png",
    cta: "Reserve a Table",
    secondaryCta: "View Menu",
    eyebrow: "¡BIENVENIDOS!",
  },
  contact: {
    address: "1420 E 6th St, Austin, TX 78702",
    phone: "(512) 555-TACO",
    email: "hola@lachispa.com",
    mapsUrl: "https://maps.google.com/?q=1420+E+6th+St+Austin+TX",
    hours: [
      { day: "Mon-Thu", hours: "11:00 AM - 11:00 PM" },
      { day: "Fri-Sat", hours: "11:00 AM - 2:00 AM" },
      { day: "Sun", hours: "10:00 AM - 10:00 PM" },
    ],
    social: {
      instagram: "@lachispaatx",
    },
  },
  menu: {
    categories: ["Tacos", "Antojitos", "Platos Fuertes", "Bebidas", "Postres"],
    items: [
      {
        id: "1",
        name: "Tacos al Pastor",
        description: "Marinated pork, pineapple, onion, cilantro on fresh corn tortillas",
        price: "$4.50",
        category: "Tacos",
        image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&q=80",
        tags: ["Signature"],
      },
      {
        id: "2",
        name: "Carne Asada Tacos",
        description: "Grilled steak, guacamole, pico de gallo, lime",
        price: "$5.00",
        category: "Tacos",
        image: "https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?w=800&q=80",
      },
      {
        id: "3",
        name: "Fish Tacos",
        description: "Beer-battered cod, cabbage slaw, chipotle crema",
        price: "$5.50",
        category: "Tacos",
        image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=800&q=80",
      },
      {
        id: "4",
        name: "Guacamole Fresco",
        description: "Made-to-order with fresh avocados, lime, cilantro, jalapeño",
        price: "$8.00",
        category: "Antojitos",
        image: "https://storage.googleapis.com/imagenai-api-public-us-central1/d4b1f2e1-1f2e-4e4f-9f4f-1f2e4e4f9f4f/0.png",
        tags: ["Vegetarian"],
      },
      {
        id: "5",
        name: "Elote",
        description: "Grilled Mexican street corn with cotija, lime, chili powder",
        price: "$6.00",
        category: "Antojitos",
        image: "https://images.unsplash.com/photo-1621336477702-1f0f8e0c2e0e?w=800&q=80",
      },
      {
        id: "6",
        name: "Nachos Supreme",
        description: "Loaded with cheese, beans, jalapeños, crema, pico",
        price: "$12.00",
        category: "Antojitos",
        image: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=800&q=80",
      },
      {
        id: "7",
        name: "Quesadilla",
        description: "Flour tortilla with melted cheese, choice of protein",
        price: "$9.00",
        category: "Antojitos",
        image: "https://images.unsplash.com/photo-1618040996337-56904b7850b9?w=800&q=80",
      },
      {
        id: "8",
        name: "Enchiladas Verdes",
        description: "Chicken enchiladas in tangy tomatillo sauce, crema, queso fresco",
        price: "$14.00",
        category: "Platos Fuertes",
        image: "https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?w=800&q=80",
      },
      {
        id: "9",
        name: "Fajitas",
        description: "Sizzling carne asada with peppers, onions, tortillas",
        price: "$18.00",
        category: "Platos Fuertes",
        image: "https://storage.googleapis.com/imagenai-api-public-us-central1/e5c2g3f2-2g3f-5f5g-0g5g-2g3f5f5g0g5g/0.png",
        tags: ["Chef's Pick"],
      },
      {
        id: "10",
        name: "Burrito Grande",
        description: "Massive burrito stuffed with rice, beans, meat, cheese, salsa",
        price: "$13.00",
        category: "Platos Fuertes",
        image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=800&q=80",
      },
      {
        id: "11",
        name: "Margarita Clásica",
        description: "Fresh lime, tequila, triple sec, salt rim",
        price: "$10.00",
        category: "Bebidas",
        image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800&q=80",
        tags: ["Happy Hour"],
      },
      {
        id: "12",
        name: "Churros",
        description: "Crispy cinnamon-sugar churros with chocolate dipping sauce",
        price: "$7.00",
        category: "Postres",
        image: "https://storage.googleapis.com/imagenai-api-public-us-central1/f6d3h4g3-3h4g-6g6h-1h6h-3h4g6g6h1h6h/0.png",
      },
      {
        id: "13",
        name: "Flan",
        description: "Silky caramel custard dessert",
        price: "$6.00",
        category: "Postres",
        image: "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=800&q=80",
      },
    ],
  },
  gallery: [
    "https://storage.googleapis.com/imagenai-api-public-us-central1/d4b1f2e1-1f2e-4e4f-9f4f-1f2e4e4f9f4f/0.png",
    "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&q=80",
    "https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?w=800&q=80",
    "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=800&q=80",
    "https://images.unsplash.com/photo-1621336477702-1f0f8e0c2e0e?w=800&q=80",
    "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=800&q=80",
    "https://storage.googleapis.com/imagenai-api-public-us-central1/e5c2g3f2-2g3f-5f5g-0g5g-2g3f5f5g0g5g/0.png",
    "https://storage.googleapis.com/imagenai-api-public-us-central1/f6d3h4g3-3h4g-6g6h-1h6h-3h4g6g6h1h6h/0.png",
  ],
  events: [
    {
      id: "1",
      title: "Taco Tuesday",
      date: "Every Tuesday",
      description: "$2 tacos all day, $5 margaritas 5-7pm",
      image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&q=80",
    },
    {
      id: "2",
      title: "Mezcal Masterclass",
      date: "First Friday Monthly",
      description: "Learn about artisanal mezcal with tastings and cocktails",
      image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800&q=80",
    },
    {
      id: "3",
      title: "Sunday Brunch Mariachi",
      date: "Every Sunday 11am-2pm",
      description: "Live mariachi band, bottomless mimosas, chilaquiles",
      image: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=800&q=80",
    },
    {
      id: "4",
      title: "Día de los Muertos",
      date: "November 1-2",
      description: "Special menu, altar, face painting, live music",
      image: "https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?w=800&q=80",
    },
  ],
  modules: {
    reservations: {
      enabled: true,
      partySizeMax: 12,
    },
    menuCms: {
      enabled: true,
    },
    catering: {
      enabled: true,
      minGuests: 20,
    },
    pushCampaigns: {
      enabled: true,
    },
    multiLocation: {
      enabled: true,
      locations: [
        {
          id: "1",
          name: "La Chispa East 6th",
          address: "1420 E 6th St, Austin, TX 78702",
          phone: "(512) 555-TACO",
          mapsUrl: "https://maps.google.com/?q=1420+E+6th+St+Austin+TX",
          hours: [
            { day: "Mon-Thu", hours: "11:00 AM - 11:00 PM" },
            { day: "Fri-Sat", hours: "11:00 AM - 2:00 AM" },
            { day: "Sun", hours: "10:00 AM - 10:00 PM" },
          ],
          primary: true,
        },
        {
          id: "2",
          name: "La Chispa South Congress",
          address: "1618 S Congress Ave, Austin, TX 78704",
          phone: "(512) 555-SOCO",
          mapsUrl: "https://maps.google.com/?q=1618+S+Congress+Ave+Austin+TX",
          hours: [
            { day: "Mon-Thu", hours: "11:00 AM - 10:00 PM" },
            { day: "Fri-Sat", hours: "11:00 AM - 12:00 AM" },
            { day: "Sun", hours: "10:00 AM - 9:00 PM" },
          ],
        },
      ],
    },
  },
};
