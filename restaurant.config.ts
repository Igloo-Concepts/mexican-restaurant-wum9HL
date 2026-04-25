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
  "name": "mexican restaurant",
  "tagline": "build a fun funky mexican restaurant",
  "about": "build a fun funky mexican restaurant",
  "preset": "modern",
  "theme": {
    "primary": "#1f1d1a",
    "secondary": "#c69a52",
    "background": "#fbf8f3",
    "surface": "#ffffff",
    "text": "#1f1d1a",
    "muted": "#7a7268",
    "accent": "#b45f43",
    "fontHeading": "System",
    "fontBody": "System",
    "radius": 16
  },
  "layout": {
    "nav": "bottomTabs",
    "hero": "fullBleed",
    "menu": "chips",
    "gallery": "grid",
    "events": "cards",
    "location": "standard",
    "typography": "modernSans",
    "density": "comfortable",
    "cornerStyle": "rounded",
    "decor": "dividers",
    "mood": "warm"
  },
  "hero": {
    "image": "https://images.unsplash.com/photo-1565299585323-381d00140451?w=1200&q=80",
    "cta": "Reserve a table",
    "secondaryCta": "View the menu",
    "eyebrow": "Hecho a mano"
  },
  "contact": {
    "address": "18 Calle de Republica, Roma Norte, CDMX",
    "phone": "+52 55 1234 5678",
    "email": "hola@example.com",
    "mapsUrl": "https://maps.google.com/?q=Roma+Norte+Mexico+City",
    "hours": [
      {
        "day": "Mon-Thu",
        "hours": "8:00 - 22:00"
      },
      {
        "day": "Fri-Sat",
        "hours": "8:00 - 23:30"
      },
      {
        "day": "Sun",
        "hours": "9:00 - 21:00"
      }
    ],
    "social": {}
  },
  "menu": {
    "categories": [
      "Antojitos",
      "Tacos",
      "Platos",
      "Postres",
      "Bebidas"
    ],
    "items": [
      {
        "id": "mx-ant-1",
        "name": "Guacamole & totopos",
        "description": "Ripe Hass avocado, lime, coriander, toasted pumpkin seeds — with warm corn tortilla chips.",
        "price": "£9",
        "category": "Antojitos",
        "tags": [
          "Vegetarian",
          "Share"
        ],
        "allergens": [
          "Sesame"
        ],
        "calories": "320 kcal"
      },
      {
        "id": "mx-ant-2",
        "name": "Elote callejero",
        "description": "Charred sweet corn, chipotle mayo, cotija-style cheese, lime, tajín.",
        "price": "£7.50",
        "category": "Antojitos",
        "tags": [
          "Spicy"
        ],
        "allergens": [
          "Dairy",
          "Eggs"
        ]
      },
      {
        "id": "mx-ant-3",
        "name": "Tostadas de tinga",
        "description": "Crispy tortillas, smoky shredded chicken, black beans, crema, pickled onion.",
        "price": "£11",
        "category": "Antojitos",
        "allergens": [
          "Dairy"
        ],
        "calories": "410 kcal"
      },
      {
        "id": "mx-ant-4",
        "name": "Queso fundido",
        "description": "Baked Chihuahua-style cheese with roasted poblanos, chorizo optional — served with warm tortillas.",
        "price": "£12",
        "category": "Antojitos",
        "tags": [
          "Chef's pick"
        ],
        "allergens": [
          "Dairy"
        ]
      },
      {
        "id": "mx-ta-1",
        "name": "Tacos al pastor",
        "description": "Marinated pork, pineapple, onion, cilantro, red salsa on double corn tortillas (two).",
        "price": "£10.50",
        "category": "Tacos",
        "tags": [
          "Signature"
        ],
        "calories": "380 kcal"
      },
      {
        "id": "mx-ta-2",
        "name": "Tacos de carnitas",
        "description": "Slow-cooked confit pork, white onion, salsa verde, lime (two).",
        "price": "£10",
        "category": "Tacos"
      },
      {
        "id": "mx-ta-3",
        "name": "Tacos de pescado estilo Baja",
        "description": "Beer-battered cod, cabbage slaw, chipotle crema, pico de gallo (two).",
        "price": "£11.50",
        "category": "Tacos",
        "tags": [
          "Spicy"
        ],
        "allergens": [
          "Gluten",
          "Fish",
          "Dairy",
          "Eggs"
        ]
      },
      {
        "id": "mx-ta-4",
        "name": "Tacos de hongos",
        "description": "Wood-roasted mushrooms, epazote, cashew crema, crispy leeks (two).",
        "price": "£9.50",
        "category": "Tacos",
        "tags": [
          "Vegan"
        ],
        "allergens": [
          "Tree nuts"
        ]
      },
      {
        "id": "mx-pl-1",
        "name": "Mole poblano",
        "description": "Chicken leg in complex dark mole — twenty ingredients, chocolate warmth, sesame — rice and beans.",
        "price": "£22",
        "category": "Platos",
        "tags": [
          "Signature",
          "Contains nuts"
        ],
        "allergens": [
          "Sesame",
          "Tree nuts",
          "Soy"
        ],
        "calories": "720 kcal"
      },
      {
        "id": "mx-pl-2",
        "name": "Chile relleno",
        "description": "Roasted poblano stuffed with cheese, tomato caldillo, Mexican red rice.",
        "price": "£18",
        "category": "Platos",
        "allergens": [
          "Dairy",
          "Eggs",
          "Gluten"
        ]
      },
      {
        "id": "mx-pl-3",
        "name": "Enchiladas verdes",
        "description": "Chicken-filled corn tortillas, tomatillo salsa, crema, queso fresco, refried beans.",
        "price": "£17",
        "category": "Platos",
        "allergens": [
          "Gluten",
          "Dairy"
        ],
        "calories": "640 kcal"
      },
      {
        "id": "mx-pl-4",
        "name": "Cochinita pibil",
        "description": "Yucatán-style achiote pork, pickled red onion, habanero salsa on the side, black beans.",
        "price": "£21",
        "category": "Platos",
        "tags": [
          "Spicy"
        ]
      },
      {
        "id": "mx-po-1",
        "name": "Churros con chocolate",
        "description": "Crispy cinnamon-sugar churros, dark Oaxacan chocolate dipping sauce.",
        "price": "£8",
        "category": "Postres",
        "allergens": [
          "Gluten",
          "Dairy",
          "Eggs"
        ],
        "calories": "480 kcal"
      },
      {
        "id": "mx-po-2",
        "name": "Flan de cajeta",
        "description": "Silky caramel custard with goat's milk cajeta and toasted pecans.",
        "price": "£7.50",
        "category": "Postres",
        "allergens": [
          "Dairy",
          "Eggs",
          "Tree nuts"
        ]
      },
      {
        "id": "mx-po-3",
        "name": "Pastel de tres leches",
        "description": "Light sponge soaked in three milks, whipped cream, seasonal berries.",
        "price": "£8.50",
        "category": "Postres",
        "allergens": [
          "Dairy",
          "Gluten",
          "Eggs"
        ]
      },
      {
        "id": "mx-be-1",
        "name": "Agua fresca (daily)",
        "description": "Rotating flavour — tamarind, hibiscus, or cucumber-lime.",
        "price": "£4",
        "category": "Bebidas",
        "tags": [
          "Non-alcoholic"
        ]
      },
      {
        "id": "mx-be-2",
        "name": "Horchata",
        "description": "Cinnamon rice milk, chilled.",
        "price": "£4.50",
        "category": "Bebidas",
        "allergens": [
          "Tree nuts"
        ]
      },
      {
        "id": "mx-be-3",
        "name": "Margarita clásica",
        "description": "Tequila blanco, fresh lime, agave, salted rim.",
        "price": "£11",
        "category": "Bebidas"
      },
      {
        "id": "mx-be-4",
        "name": "Mezcal espadín",
        "description": "1oz pour — ask for seasonal cocktail specials.",
        "price": "£9",
        "category": "Bebidas"
      }
    ]
  },
  "gallery": [
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80",
    "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80"
  ],
  "events": [
    {
      "id": "e1",
      "title": "Taco night",
      "date": "Every Thursday",
      "description": "Fresh tortillas, house salsas, and rotating specials."
    }
  ],
  "modules": {
    "reservations": {
      "enabled": true,
      "partySizeMax": 12,
      "confirmationEmail": {
        "enabled": false,
        "subject": "Your table reservation is confirmed"
      },
      "weeklyHours": {
        "monday": [
          {
            "open": "12:00",
            "close": "14:30"
          },
          {
            "open": "17:00",
            "close": "22:30"
          }
        ],
        "tuesday": [
          {
            "open": "12:00",
            "close": "14:30"
          }
        ],
        "wednesday": [
          {
            "open": "12:00",
            "close": "14:30"
          }
        ],
        "thursday": [
          {
            "open": "12:00",
            "close": "14:30"
          }
        ],
        "friday": [
          {
            "open": "12:00",
            "close": "14:30"
          }
        ],
        "saturday": [
          {
            "open": "12:00",
            "close": "22:30"
          }
        ],
        "sunday": [
          {
            "open": "10:00",
            "close": "14:30"
          }
        ]
      },
      "slotIntervalMinutes": 30,
      "bookingOverrides": [
        {
          "date": "2026-04-25",
          "closedAllDay": true,
          "closedWindows": []
        },
        {
          "date": "2026-04-26",
          "closedAllDay": true,
          "closedWindows": []
        }
      ]
    },
    "menuCms": {
      "enabled": true
    },
    "catering": {
      "enabled": true
    },
    "pushCampaigns": {
      "enabled": true
    },
    "customerAccounts": {
      "enabled": true
    },
    "multiLocation": {
      "enabled": true
    },
    "jobs": {
      "enabled": true
    },
    "photoWall": {
      "enabled": true
    }
  },
  "tenant": {
    "projectId": "wum9HLpvLExj45",
    "apiBase": "https://mode-millions-ride-boston.trycloudflare.com",
    "apiKey": "f5c5dab21b54e378078d0210ce8ed82378764dbdb6ab7098c51402cd38cf17f1"
  }
};
