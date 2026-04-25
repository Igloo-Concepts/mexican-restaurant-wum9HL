// ============================================================================
// Restaurant Configuration
// Single source of truth for app content, theme, and layout
// ============================================================================

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  category: string;
  image?: string;
  popular?: boolean;
  spicy?: boolean;
  vegetarian?: boolean;
}

export interface EventItem {
  id: string;
  title: string;
  date: string;
  description: string;
  image?: string;
}

export interface LayoutConfig {
  nav?:
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
  hero?:
    | "fullBleed"
    | "split"
    | "boxed"
    | "editorial"
    | "minimal"
    | "marquee";
  menu?: "chips" | "accordion" | "grid" | "magazine" | "compactList";
  gallery?: "grid" | "masonry" | "heroStrip" | "carousel" | "fullBleedStack";
  events?: "cards" | "timeline" | "magazine" | "list";
  location?: "standard" | "compact" | "hero";
  typography?:
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
  density?: "airy" | "comfortable" | "compact";
  cornerStyle?: "rounded" | "sharp" | "pill";
  decor?: "underline" | "dividers" | "dottedRule" | "serifRule" | "ornament" | "none";
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
  preset: string;
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
  hero: {
    title: string;
    subtitle: string;
    image: string;
    cta: string;
    ctaLink: string;
    eyebrow?: string;
    secondaryCta?: string;
    secondaryCtaLink?: string;
  };
  contact: {
    phone: string;
    email: string;
    address: string;
    hours: Array<{ day: string; hours: string }>;
  };
  menu: {
    categories: string[];
    items: MenuItem[
    {
      id: "mx-ant-1",
      name: "Guacamole & totopos",
      description: "Ripe Hass avocado, lime, coriander, toasted pumpkin seeds — with warm corn tortilla chips.",
      price: "£9",
      category: "Antojitos",
      tags: ["Vegetarian","Share"],
      allergens: ["Sesame"],
      calories: "320 kcal",
    },
    {
      id: "mx-ant-2",
      name: "Elote callejero",
      description: "Charred sweet corn, chipotle mayo, cotija-style cheese, lime, tajín.",
      price: "£7.50",
      category: "Antojitos",
      tags: ["Spicy"],
      allergens: ["Dairy","Eggs"],
    },
    {
      id: "mx-ant-3",
      name: "Tostadas de tinga",
      description: "Crispy tortillas, smoky shredded chicken, black beans, crema, pickled onion.",
      price: "£11",
      category: "Antojitos",
      allergens: ["Dairy"],
      calories: "410 kcal",
    },
    {
      id: "mx-ant-4",
      name: "Queso fundido",
      description: "Baked Chihuahua-style cheese with roasted poblanos, chorizo optional — served with warm tortillas.",
      price: "£12",
      category: "Antojitos",
      tags: ["Chef's pick"],
      allergens: ["Dairy"],
    },
    {
      id: "mx-ta-1",
      name: "Tacos al pastor",
      description: "Marinated pork, pineapple, onion, cilantro, red salsa on double corn tortillas (two).",
      price: "£10.50",
      category: "Tacos",
      tags: ["Signature"],
      calories: "380 kcal",
    },
    {
      id: "mx-ta-2",
      name: "Tacos de carnitas",
      description: "Slow-cooked confit pork, white onion, salsa verde, lime (two).",
      price: "£10",
      category: "Tacos",
    },
    {
      id: "mx-ta-3",
      name: "Tacos de pescado estilo Baja",
      description: "Beer-battered cod, cabbage slaw, chipotle crema, pico de gallo (two).",
      price: "£11.50",
      category: "Tacos",
      tags: ["Spicy"],
      allergens: ["Gluten","Fish","Dairy","Eggs"],
    },
    {
      id: "mx-ta-4",
      name: "Tacos de hongos",
      description: "Wood-roasted mushrooms, epazote, cashew crema, crispy leeks (two).",
      price: "£9.50",
      category: "Tacos",
      tags: ["Vegan"],
      allergens: ["Tree nuts"],
    },
    {
      id: "mx-pl-1",
      name: "Mole poblano",
      description: "Chicken leg in complex dark mole — twenty ingredients, chocolate warmth, sesame — rice and beans.",
      price: "£22",
      category: "Platos",
      tags: ["Signature","Contains nuts"],
      allergens: ["Sesame","Tree nuts","Soy"],
      calories: "720 kcal",
    },
    {
      id: "mx-pl-2",
      name: "Chile relleno",
      description: "Roasted poblano stuffed with cheese, tomato caldillo, Mexican red rice.",
      price: "£18",
      category: "Platos",
      allergens: ["Dairy","Eggs","Gluten"],
    },
    {
      id: "mx-pl-3",
      name: "Enchiladas verdes",
      description: "Chicken-filled corn tortillas, tomatillo salsa, crema, queso fresco, refried beans.",
      price: "£17",
      category: "Platos",
      allergens: ["Gluten","Dairy"],
      calories: "640 kcal",
    },
    {
      id: "mx-pl-4",
      name: "Cochinita pibil",
      description: "Yucatán-style achiote pork, pickled red onion, habanero salsa on the side, black beans.",
      price: "£21",
      category: "Platos",
      tags: ["Spicy"],
    },
    {
      id: "mx-po-1",
      name: "Churros con chocolate",
      description: "Crispy cinnamon-sugar churros, dark Oaxacan chocolate dipping sauce.",
      price: "£8",
      category: "Postres",
      allergens: ["Gluten","Dairy","Eggs"],
      calories: "480 kcal",
    },
    {
      id: "mx-po-2",
      name: "Flan de cajeta",
      description: "Silky caramel custard with goat's milk cajeta and toasted pecans.",
      price: "£7.50",
      category: "Postres",
      allergens: ["Dairy","Eggs","Tree nuts"],
    },
    {
      id: "mx-po-3",
      name: "Pastel de tres leches",
      description: "Light sponge soaked in three milks, whipped cream, seasonal berries.",
      price: "£8.50",
      category: "Postres",
      allergens: ["Dairy","Gluten","Eggs"],
    },
    {
      id: "mx-be-1",
      name: "Agua fresca (daily)",
      description: "Rotating flavour — tamarind, hibiscus, or cucumber-lime.",
      price: "£4",
      category: "Bebidas",
      tags: ["Non-alcoholic"],
    },
    {
      id: "mx-be-2",
      name: "Horchata",
      description: "Cinnamon rice milk, chilled.",
      price: "£4.50",
      category: "Bebidas",
      allergens: ["Tree nuts"],
    },
    {
      id: "mx-be-3",
      name: "Margarita clásica",
      description: "Tequila blanco, fresh lime, agave, salted rim.",
      price: "£11",
      category: "Bebidas",
    },
    {
      id: "mx-be-4",
      name: "Mezcal espadín",
      description: "1oz pour — ask for seasonal cocktail specials.",
      price: "£9",
      category: "Bebidas",
    },
  ];
  };
  gallery: string[];
  events: EventItem[];
  layout?: LayoutConfig;
  modules?: ModulesConfig;
}

export const restaurantConfig: RestaurantConfig = {
  name: "La Chispa",
  tagline: "Authentic Mexican Street Food & Vibes",
  about:
    "La Chispa brings the electric energy of Mexico City's street food scene to Austin. Bold flavors, funky atmosphere, and late-night tacos that'll light up your night. From traditional al pastor to creative fusion plates, every dish is a celebration.",
  preset: "funky-mexican",

  theme: {
    primary: "#FF1493", // Hot pink
    secondary: "#39FF14", // Electric lime
    background: "#1A0A2E", // Deep purple-black
    surface: "#2D1B4E", // Purple surface
    text: "#FFFFFF", // White
    muted: "#B8A4D4", // Lavender muted
    accent: "#FFD700", // Golden yellow
    fontHeading: "Bebas Neue",
    fontBody: "Inter",
    radius: 0,
  },

  hero: {
    title: "LA CHISPA",
    subtitle: "Where Every Bite Sparks Joy",
    image: "https://storage.googleapis.com/restaurant-app-generator.firebasestorage.app/generated/vSD1aw2JBURF6B8ER0ndxV7PxRr2/wum9HLpvLExj45/1776864346031-asset.png",
    cta: "Reserve a Table",
    ctaLink: "reserve",
    eyebrow: "AUSTIN'S FUNKIEST TAQUERIA",
    secondaryCta: "View Menu",
    secondaryCtaLink: "menu",
  },

  contact: {
    phone: "(512) 555-TACO",
    email: "hola@lachispa.com",
    address: "420 E 6th Street, Austin, TX 78701",
    hours: [
      { day: "Monday - Thursday", hours: "11:00 AM - 11:00 PM" },
      { day: "Friday - Saturday", hours: "11:00 AM - 2:00 AM" },
      { day: "Sunday", hours: "10:00 AM - 10:00 PM" },
    ],
  },

  menu: {
    categories: ["Tacos", "Antojitos", "Platos Fuertes", "Bebidas", "Postres"],
    items: [
      {
        id: "1",
        name: "Tacos al Pastor",
        description: "Marinated pork, pineapple, cilantro, onions on corn tortillas",
        price: "$4.50 each",
        category: "Tacos",
        image: "https://images.unsplash.com/photo-1562967914-608f82629710?w=1200&q=80&auto=format&fit=crop",
        popular: true,
        spicy: true,
      },
      {
        id: "2",
        name: "Carne Asada Tacos",
        description: "Grilled steak, guacamole, pico de gallo, lime",
        price: "$5.00 each",
        category: "Tacos",
        image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=1200&q=80&auto=format&fit=crop",
        popular: true,
      },
      {
        id: "3",
        name: "Fish Tacos",
        description: "Beer-battered fish, cabbage slaw, chipotle crema",
        price: "$4.75 each",
        category: "Tacos",
        image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=1200&q=80&auto=format&fit=crop",
      },
      {
        id: "4",
        name: "Guacamole Fresco",
        description: "Made-to-order with fresh avocados, lime, cilantro, jalapeño",
        price: "$9.00",
        category: "Antojitos",
        image: "https://storage.googleapis.com/restaurant-app-generator.firebasestorage.app/generated/vSD1aw2JBURF6B8ER0ndxV7PxRr2/wum9HLpvLExj45/1776864436184-asset.png",
        vegetarian: true,
        popular: true,
      },
      {
        id: "5",
        name: "Elote Callejero",
        description: "Grilled corn, mayo, cotija cheese, chili powder, lime",
        price: "$6.00",
        category: "Antojitos",
        image: "https://images.unsplash.com/photo-1447078806655-40579c2520d6?w=1200&q=80&auto=format&fit=crop",
        vegetarian: true,
      },
      {
        id: "6",
        name: "Nachos Supreme",
        description: "Loaded with cheese, beans, jalapeños, sour cream, guac",
        price: "$12.00",
        category: "Antojitos",
        image: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=1200&q=80&auto=format&fit=crop",
        vegetarian: true,
      },
      {
        id: "7",
        name: "Quesadilla Grande",
        description: "Flour tortilla, melted cheese, choice of protein",
        price: "$10.00",
        category: "Antojitos",
        image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=1200&q=80&auto=format&fit=crop",
      },
      {
        id: "8",
        name: "Enchiladas Verdes",
        description: "Chicken enchiladas in tomatillo sauce, rice & beans",
        price: "$14.00",
        category: "Platos Fuertes",
        image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=1200&q=80&auto=format&fit=crop",
      },
      {
        id: "9",
        name: "Carne Asada Fajitas",
        description: "Sizzling steak, peppers, onions, tortillas, all the fixings",
        price: "$18.00",
        category: "Platos Fuertes",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1200&q=80&auto=format&fit=crop",
        popular: true,
      },
      {
        id: "10",
        name: "Burrito Gigante",
        description: "Massive burrito stuffed with your choice of protein, rice, beans, cheese",
        price: "$13.00",
        category: "Platos Fuertes",
        image: "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=1200&q=80&auto=format&fit=crop",
      },
      {
        id: "11",
        name: "Margarita Clásica",
        description: "Tequila, lime, triple sec, salt rim",
        price: "$10.00",
        category: "Bebidas",
        image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=1200&q=80&auto=format&fit=crop",
        popular: true,
      },
      {
        id: "12",
        name: "Churros con Chocolate",
        description: "Crispy churros dusted with cinnamon sugar, chocolate dipping sauce",
        price: "$7.00",
        category: "Postres",
        image: "https://storage.googleapis.com/restaurant-app-generator.firebasestorage.app/generated/vSD1aw2JBURF6B8ER0ndxV7PxRr2/wum9HLpvLExj45/1776862990088-asset.png",
        vegetarian: true,
      },
      {
        id: "13",
        name: "Flan Casero",
        description: "Creamy caramel custard, traditional recipe",
        price: "$6.00",
        category: "Postres",
        image: "https://images.unsplash.com/photo-1475090169767-40ed8d18f67d?w=1200&q=80&auto=format&fit=crop",
        vegetarian: true,
      },
    ],
  },

  gallery: [
    "https://images.unsplash.com/photo-1562967914-608f82629710?w=1200&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=1200&q=80&auto=format&fit=crop",
    "https://storage.googleapis.com/restaurant-app-generator.firebasestorage.app/generated/vSD1aw2JBURF6B8ER0ndxV7PxRr2/wum9HLpvLExj45/1776864436184-asset.png",
    "https://images.unsplash.com/photo-1447078806655-40579c2520d6?w=1200&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=1200&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1200&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=1200&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1550547660-d9450f859349?w=1200&q=80&auto=format&fit=crop",
  ],

  events: [
    {
      id: "1",
      title: "Taco Tuesday Fiesta",
      date: "Every Tuesday",
      description: "$3 tacos all day, live mariachi 6-9pm, $5 margaritas",
      image: "https://images.unsplash.com/photo-1562967914-608f82629710?w=1200&q=80&auto=format&fit=crop",
    },
    {
      id: "2",
      title: "Mezcal Masterclass",
      date: "First Friday Monthly",
      description: "Learn about artisanal mezcal, tasting flight included, $35/person",
      image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=1200&q=80&auto=format&fit=crop",
    },
    {
      id: "3",
      title: "Sunday Brunch Mariachi",
      date: "Every Sunday 11am-3pm",
      description: "Bottomless mimosas, chilaquiles, live mariachi band",
      image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=1200&q=80&auto=format&fit=crop",
    },
    {
      id: "4",
      title: "Día de los Muertos Celebration",
      date: "November 1-2",
      description: "Special menu, altar display, face painting, traditional music",
      image: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=1200&q=80&auto=format&fit=crop",
    },
  ],

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
  },

  modules: {
    reservations: {
      enabled: true,
      partySizeMax: 12,
    },
    menuCms: {
      enabled: true,
    },
  },
};
