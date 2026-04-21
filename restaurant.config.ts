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

export interface ModulesConfig {
  reservations?: {
    enabled: boolean;
    partySizeMax?: number;
    depositCents?: number;
  };
  menuCms?: {
    enabled: boolean;
  };
  catering?: {
    enabled: boolean;
    minGuests?: number;
  };
  pushCampaigns?: {
    enabled: boolean;
  };
  customerAccounts?: {
    enabled: boolean;
  };
  multiLocation?: {
    enabled: boolean;
  };
  jobs?: {
    enabled: boolean;
  };
  photoWall?: {
    enabled: boolean;
  };
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
  modules?: ModulesConfig;
}

export const restaurantConfig: RestaurantConfig = {
  name: "La Chispa",
  tagline: "Tacos, tequila & good vibes only.",
  about:
    "La Chispa brings the electric energy of Mexico City street food to your neighborhood. We're all about bold flavors, ice-cold margaritas, and a party atmosphere that makes every meal feel like a fiesta. No reservations needed — just bring your appetite and your dancing shoes.",
  preset: "casual",
  theme: {
    primary: "#FF1493", // Hot pink
    secondary: "#39FF14", // Electric lime
    background: "#1A0A2E", // Deep purple-black
    surface: "#2D1B4E", // Rich purple
    text: "#FFFFFF",
    muted: "#B8A9C9",
    accent: "#FFD700", // Golden yellow
    fontHeading: "BebasNeue_400Regular",
    fontBody: "Inter_500Medium",
    radius: 0,
  },
  layout: {
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
  },
  hero: {
    image:
      "https://storage.googleapis.com/restaurant-app-generator.firebasestorage.app/generated/vSD1aw2JBURF6B8ER0ndxV7PxRr2/wum9HLpvLExj45/1776715453800-asset.png",
    cta: "Reserve a Table",
    secondaryCta: "See the Menu",
    eyebrow: "🌶️ Street Food Vibes",
  },
  contact: {
    address: "742 Fiesta Boulevard, Austin, TX 78701",
    phone: "(512) 555-TACO",
    email: "hola@lachispa.com",
    mapsUrl: "https://maps.google.com/?q=742+Fiesta+Boulevard+Austin+TX",
    hours: [
      { day: "Mon-Thu", hours: "11:00 AM - 10:00 PM" },
      { day: "Fri-Sat", hours: "11:00 AM - 2:00 AM" },
      { day: "Sun", hours: "10:00 AM - 9:00 PM" },
    ],
    social: {
      instagram: "https://instagram.com/lachispaatx",
      tiktok: "https://tiktok.com/@lachispaatx",
    },
  },
  menu: {
    categories: ["Tacos", "Antojitos", "Platos Fuertes", "Bebidas", "Postres"],
    items: [
      {
        id: "1",
        name: "Tacos Al Pastor",
        description:
          "Marinated pork, pineapple, cilantro, onion, salsa verde on corn tortillas",
        price: "$4.50",
        category: "Tacos",
        image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=1200&q=80&auto=format&fit=crop",
        tags: ["Popular", "Spicy"],
      },
      {
        id: "2",
        name: "Tacos de Carnitas",
        description:
          "Slow-braised pork, pickled onions, fresh cilantro, house salsa",
        price: "$4.50",
        category: "Tacos",
        image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=1200&q=80&auto=format&fit=crop",
        tags: ["Fan Favorite"],
      },
      {
        id: "3",
        name: "Tacos de Birria",
        description:
          "Slow-cooked beef birria, melted cheese, consommé for dipping",
        price: "$5.50",
        category: "Tacos",
        image: "https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?w=1200&q=80&auto=format&fit=crop",
        tags: ["Chef's Pick", "Trending"],
      },
      {
        id: "4",
        name: "Guacamole Fresco",
        description:
          "Made tableside with ripe avocados, lime, cilantro, jalapeño, served with warm chips",
        price: "$12",
        category: "Antojitos",
        image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=1200&q=80&auto=format&fit=crop",
        tags: ["Vegetarian"],
      },
      {
        id: "5",
        name: "Elotes Callejeros",
        description:
          "Grilled street corn, mayo, cotija cheese, chili powder, lime",
        price: "$7",
        category: "Antojitos",
        image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=1200&q=80&auto=format&fit=crop",
        tags: ["Vegetarian", "Street Food"],
      },
      {
        id: "6",
        name: "Queso Fundido",
        description:
          "Melted Oaxacan cheese with chorizo, served with fresh tortillas",
        price: "$14",
        category: "Antojitos",
        image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=1200&q=80&auto=format&fit=crop",
        tags: ["Shareable"],
      },
      {
        id: "7",
        name: "Carne Asada Platter",
        description:
          "Grilled skirt steak, rice, beans, guacamole, pico de gallo, warm tortillas",
        price: "$24",
        category: "Platos Fuertes",
        image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=1200&q=80&auto=format&fit=crop",
        tags: ["Popular"],
      },
      {
        id: "8",
        name: "Enchiladas Suizas",
        description:
          "Chicken enchiladas, creamy tomatillo sauce, crema, queso fresco",
        price: "$18",
        category: "Platos Fuertes",
        image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e701?w=1200&q=80&auto=format&fit=crop",
      },
      {
        id: "9",
        name: "Margarita Clásica",
        description:
          "Premium tequila, fresh lime, agave, salt rim — frozen or on the rocks",
        price: "$12",
        category: "Bebidas",
        image: "https://images.unsplash.com/photo-1517427294546-5aa121f68e8a?w=1200&q=80&auto=format&fit=crop",
        tags: ["Signature"],
      },
      {
        id: "10",
        name: "Michelada Loca",
        description:
          "Mexican lager, lime, Tajín, chamoy, hot sauce, served in a chili-salt rimmed glass",
        price: "$10",
        category: "Bebidas",
        tags: ["Spicy", "Refreshing"],
      },
      {
        id: "11",
        name: "Churros con Chocolate",
        description:
          "Crispy cinnamon-sugar churros with rich Mexican chocolate dipping sauce",
        price: "$9",
        category: "Postres",
        image: "https://storage.googleapis.com/restaurant-app-generator.firebasestorage.app/generated/vSD1aw2JBURF6B8ER0ndxV7PxRr2/wum9HLpvLExj45/1776715544818-asset.png",
        tags: ["Sweet"],
      },
      {
        id: "12",
        name: "Tres Leches",
        description:
          "Classic three-milk cake, whipped cream, fresh strawberries",
        price: "$10",
        category: "Postres",
        image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=1200&q=80&auto=format&fit=crop",
        tags: ["Fan Favorite"],
      },
    ],
  },
  gallery: [
    "https://storage.googleapis.com/restaurant-app-generator.firebasestorage.app/generated/vSD1aw2JBURF6B8ER0ndxV7PxRr2/wum9HLpvLExj45/1776715453800-asset.png",
    "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=1200&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=1200&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=1200&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=1200&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=1200&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=1200&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517427294546-5aa121f68e8a?w=1200&q=80&auto=format&fit=crop",
  ],
  events: [
    {
      id: "e1",
      title: "Taco Tuesday Fiesta",
      date: "Every Tuesday",
      description:
        "$2 tacos all night long! Live DJ spinning Latin beats from 7pm. First margarita on the house.",
      image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=1200&q=80&auto=format&fit=crop",
    },
    {
      id: "e2",
      title: "Mezcal Masterclass",
      date: "First Saturday of the Month",
      description:
        "Learn the art of mezcal with our resident expert. Taste 5 premium mezcals paired with small bites. $45/person.",
      image: "https://images.unsplash.com/photo-1517427294546-5aa121f68e8a?w=1200&q=80&auto=format&fit=crop",
    },
    {
      id: "e3",
      title: "Sunday Brunch Mariachi",
      date: "Every Sunday 11am-3pm",
      description:
        "Live mariachi band, bottomless mimosas, and our famous chilaquiles. Reservations recommended!",
      image: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=1200&q=80&auto=format&fit=crop",
    },
    {
      id: "e4",
      title: "Día de los Muertos Celebration",
      date: "November 1-2",
      description:
        "Join us for our biggest party of the year! Face painting, altar displays, special menu, and live entertainment all weekend.",
      image: "https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=1200&q=80&auto=format&fit=crop",
    },
  ],
  modules: {
    reservations: {
      enabled: true,
      partySizeMax: 12,
      depositCents: 0,
    },
  },
};
