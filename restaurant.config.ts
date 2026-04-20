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
  | "floatingDock";

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
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  category: string;
  image?: string;
  tags?: string[];
}

export interface EventItem {
  id: string;
  title: string;
  date: string;
  description: string;
  image?: string;
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
}

export const restaurantConfig: RestaurantConfig = {
  name: "Sample Bistro",
  tagline: "Honest food, beautifully made.",
  about:
    "A family-run neighbourhood bistro serving seasonal dishes inspired by Mediterranean coasts. Open from breakfast through late-night supper.",
  preset: "modern",
  theme: {
    primary: "#1f1d1a",
    secondary: "#c69a52",
    background: "#fbf8f3",
    surface: "#ffffff",
    text: "#1f1d1a",
    muted: "#7a7268",
    accent: "#a4583c",
    fontHeading: "System",
    fontBody: "System",
    radius: 16,
  },
  layout: {
    nav: "iconOnlyTabs",
    hero: "split",
    menu: "compactList",
    gallery: "fullBleedStack",
    events: "magazine",
    location: "compact",
    typography: "warmSerif",
    density: "airy",
    cornerStyle: "pill",
    decor: "dividers",
    mood: "bright",
  },
  hero: {
    image:
      "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=1200&q=80&auto=format&fit=crop",
    cta: "Reserve a table",
    secondaryCta: "View the menu",
    eyebrow: "Since 1998",
  },
  contact: {
    address: "12 Market Street, Cirencester",
    phone: "+44 1285 000 000",
    email: "hello@example.com",
    mapsUrl: "https://maps.google.com/?q=12+Market+Street+Cirencester",
    hours: [
      { day: "Mon-Thu", hours: "8:00 - 22:00" },
      { day: "Fri-Sat", hours: "8:00 - 23:30" },
      { day: "Sun", hours: "9:00 - 21:00" },
    ],
    social: {
      instagram: "https://instagram.com/example",
    },
  },
  menu: {
    categories: ["Starters", "Mains", "Desserts", "Drinks"],
    items: [
      {
        id: "1",
        name: "Burrata & heritage tomato",
        description: "Creamy burrata, sun-ripened tomatoes, basil oil, sourdough",
        price: "£11",
        category: "Starters",
      },
      {
        id: "2",
        name: "Slow-braised lamb shoulder",
        description: "Eight-hour lamb, rosemary jus, smoked mash",
        price: "£24",
        category: "Mains",
      },
      {
        id: "3",
        name: "Salted caramel tart",
        description: "Dark chocolate ganache, sea salt, crème fraîche",
        price: "£9",
        category: "Desserts",
      },
      {
        id: "4",
        name: "House negroni",
        description: "Campari, sweet vermouth, gin, orange",
        price: "£10",
        category: "Drinks",
      },
    ],
  },
  gallery: [
    "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=1200&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1591189863430-ab87e120f312?w=1200&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1574484284002-952d92456975?w=1200&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80&auto=format&fit=crop",
  ],
  events: [
    {
      id: "e1",
      title: "Wine pairing supper",
      date: "Friday 24 May",
      description: "Five-course tasting menu with paired natural wines.",
    },
    {
      id: "e2",
      title: "Sunday jazz brunch",
      date: "Every Sunday",
      description: "Live trio from 11am, bottomless mimosas optional.",
    },
  ],
};
