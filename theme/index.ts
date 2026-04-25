import * as ConfigModule from "../restaurant.config";
import type {
  Density,
  LayoutConfig,
  TypographyPreset,
} from "../restaurant.config";

const fallbackTheme = {
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
};

type Theme = typeof fallbackTheme;

const resolved =
  (ConfigModule as any).restaurantConfig ??
  (ConfigModule as any).default ??
  (ConfigModule as any).config ??
  null;

const rawTheme: Partial<Theme> | null =
  resolved && typeof resolved === "object" && resolved.theme && typeof resolved.theme === "object"
    ? (resolved.theme as Partial<Theme>)
    : null;

function mergeTheme(partial: Partial<Theme> | null): Theme {
  if (!partial) return { ...fallbackTheme };
  const out = { ...fallbackTheme };
  for (const key of Object.keys(fallbackTheme) as (keyof Theme)[]) {
    const v = partial[key];
    if (v === undefined || v === null || v === "") continue;
    (out as any)[key] = v;
  }
  return out;
}

export const theme: Theme = mergeTheme(rawTheme);

/* --------------------------------------------------------------------------
 * Density
 * -------------------------------------------------------------------------- */

const densityScales = {
  airy: {
    xs: 6, sm: 12, md: 20, lg: 32, xl: 44, xxl: 64,
    sectionY: 56, cardPad: 24, gutter: 20,
  },
  comfortable: {
    xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48,
    sectionY: 36, cardPad: 16, gutter: 16,
  },
  compact: {
    xs: 2, sm: 6, md: 12, lg: 18, xl: 24, xxl: 36,
    sectionY: 24, cardPad: 12, gutter: 10,
  },
} as const;

function resolveDensity(d?: Density) {
  if (d === "airy") return densityScales.airy;
  if (d === "compact") return densityScales.compact;
  return densityScales.comfortable;
}

const layoutConfig: Partial<LayoutConfig> =
  resolved?.layout && typeof resolved.layout === "object" ? resolved.layout : {};

export const spacing = resolveDensity(layoutConfig.density as Density | undefined);

/* --------------------------------------------------------------------------
 * Typography presets. Each preset uses real Google Fonts loaded by `lib/fonts.ts`
 * at app boot. `fontFamily` values here correspond to the @expo-google-fonts
 * constant names (e.g. `Inter_700Bold`) — DO NOT rename without updating
 * `lib/fonts.ts` too.
 *
 * When fonts haven't loaded yet (first paint, or invalid preset), React Native
 * falls back to system sans which is fine — nothing crashes.
 * -------------------------------------------------------------------------- */

type TextStyle = {
  fontSize: number;
  fontWeight:
    | "100" | "200" | "300" | "400" | "500"
    | "600" | "700" | "800" | "900";
  letterSpacing?: number;
  lineHeight?: number;
  fontFamily?: string;
  textTransform?: "uppercase" | "lowercase" | "capitalize" | "none";
  fontStyle?: "normal" | "italic";
};

type TypographyScale = {
  display: TextStyle;
  h1: TextStyle;
  h2: TextStyle;
  h3: TextStyle;
  body: TextStyle;
  caption: TextStyle;
  eyebrow: TextStyle;
};

const typographyPresets: Record<TypographyPreset, TypographyScale> = {
  modernSans: {
    display: { fontSize: 44, fontWeight: "800", letterSpacing: -1.2, lineHeight: 48, fontFamily: "Inter_800ExtraBold" },
    h1: { fontSize: 32, fontWeight: "700", letterSpacing: -0.5, lineHeight: 38, fontFamily: "Inter_700Bold" },
    h2: { fontSize: 24, fontWeight: "700", letterSpacing: -0.3, lineHeight: 30, fontFamily: "Inter_700Bold" },
    h3: { fontSize: 18, fontWeight: "600", lineHeight: 24, fontFamily: "Inter_600SemiBold" },
    body: { fontSize: 15, fontWeight: "400", lineHeight: 22, fontFamily: "Inter_400Regular" },
    caption: { fontSize: 13, fontWeight: "400", lineHeight: 18, fontFamily: "Inter_400Regular" },
    eyebrow: { fontSize: 11, fontWeight: "700", letterSpacing: 2, textTransform: "uppercase", fontFamily: "Inter_700Bold" },
  },
  serifDisplay: {
    display: { fontSize: 52, fontWeight: "700", letterSpacing: -1, lineHeight: 56, fontFamily: "PlayfairDisplay_700Bold" },
    h1: { fontSize: 36, fontWeight: "700", letterSpacing: -0.4, lineHeight: 42, fontFamily: "PlayfairDisplay_700Bold" },
    h2: { fontSize: 26, fontWeight: "500", letterSpacing: -0.2, lineHeight: 32, fontFamily: "PlayfairDisplay_500Medium" },
    h3: { fontSize: 19, fontWeight: "500", lineHeight: 26, fontFamily: "PlayfairDisplay_500Medium" },
    body: { fontSize: 16, fontWeight: "400", lineHeight: 24, fontFamily: "Inter_400Regular" },
    caption: { fontSize: 13, fontWeight: "400", lineHeight: 18, fontStyle: "italic", fontFamily: "PlayfairDisplay_400Regular_Italic" },
    eyebrow: { fontSize: 12, fontWeight: "600", letterSpacing: 3, textTransform: "uppercase", fontFamily: "Inter_600SemiBold" },
  },
  editorialSerif: {
    display: { fontSize: 64, fontWeight: "400", letterSpacing: -1.5, lineHeight: 64, fontFamily: "DMSerifDisplay_400Regular" },
    h1: { fontSize: 42, fontWeight: "400", letterSpacing: -0.8, lineHeight: 46, fontFamily: "DMSerifDisplay_400Regular" },
    h2: { fontSize: 28, fontWeight: "400", letterSpacing: -0.3, lineHeight: 34, fontStyle: "italic", fontFamily: "DMSerifDisplay_400Regular_Italic" },
    h3: { fontSize: 19, fontWeight: "700", lineHeight: 26, fontFamily: "LibreBaskerville_700Bold" },
    body: { fontSize: 16, fontWeight: "400", lineHeight: 26, fontFamily: "LibreBaskerville_400Regular" },
    caption: { fontSize: 12, fontWeight: "400", letterSpacing: 1, textTransform: "uppercase", fontFamily: "LibreBaskerville_400Regular" },
    eyebrow: { fontSize: 11, fontWeight: "400", letterSpacing: 4, textTransform: "uppercase", fontFamily: "LibreBaskerville_400Regular" },
  },
  rounded: {
    display: { fontSize: 44, fontWeight: "800", letterSpacing: -0.8, lineHeight: 50, fontFamily: "Poppins_800ExtraBold" },
    h1: { fontSize: 30, fontWeight: "700", letterSpacing: -0.3, lineHeight: 36, fontFamily: "Poppins_700Bold" },
    h2: { fontSize: 22, fontWeight: "700", lineHeight: 28, fontFamily: "Poppins_700Bold" },
    h3: { fontSize: 17, fontWeight: "600", lineHeight: 24, fontFamily: "Poppins_600SemiBold" },
    body: { fontSize: 15, fontWeight: "500", lineHeight: 22, fontFamily: "Poppins_500Medium" },
    caption: { fontSize: 13, fontWeight: "500", lineHeight: 18, fontFamily: "Poppins_500Medium" },
    eyebrow: { fontSize: 12, fontWeight: "700", letterSpacing: 1.4, textTransform: "uppercase", fontFamily: "Poppins_700Bold" },
  },
  monoMinimal: {
    display: { fontSize: 40, fontWeight: "700", letterSpacing: -0.5, lineHeight: 46, fontFamily: "SpaceMono_700Bold" },
    h1: { fontSize: 26, fontWeight: "700", letterSpacing: 0, lineHeight: 32, fontFamily: "SpaceMono_700Bold" },
    h2: { fontSize: 20, fontWeight: "700", lineHeight: 26, fontFamily: "SpaceMono_700Bold" },
    h3: { fontSize: 16, fontWeight: "400", lineHeight: 22, fontFamily: "SpaceMono_400Regular" },
    body: { fontSize: 14, fontWeight: "400", lineHeight: 22, fontFamily: "SpaceMono_400Regular" },
    caption: { fontSize: 12, fontWeight: "400", lineHeight: 16, fontFamily: "SpaceMono_400Regular" },
    eyebrow: { fontSize: 11, fontWeight: "700", letterSpacing: 2, textTransform: "uppercase", fontFamily: "SpaceMono_700Bold" },
  },
  boldCondensed: {
    display: { fontSize: 64, fontWeight: "400", letterSpacing: 1, lineHeight: 64, textTransform: "uppercase", fontFamily: "BebasNeue_400Regular" },
    h1: { fontSize: 46, fontWeight: "400", letterSpacing: 0.5, lineHeight: 48, textTransform: "uppercase", fontFamily: "BebasNeue_400Regular" },
    h2: { fontSize: 32, fontWeight: "400", letterSpacing: 0.5, lineHeight: 34, textTransform: "uppercase", fontFamily: "BebasNeue_400Regular" },
    h3: { fontSize: 20, fontWeight: "700", lineHeight: 24, fontFamily: "Inter_700Bold" },
    body: { fontSize: 15, fontWeight: "500", lineHeight: 22, fontFamily: "Inter_500Medium" },
    caption: { fontSize: 12, fontWeight: "700", letterSpacing: 1.5, textTransform: "uppercase", fontFamily: "Inter_700Bold" },
    eyebrow: { fontSize: 11, fontWeight: "400", letterSpacing: 3, textTransform: "uppercase", fontFamily: "BebasNeue_400Regular" },
  },
  warmSerif: {
    display: { fontSize: 48, fontWeight: "700", letterSpacing: -0.8, lineHeight: 52, fontFamily: "Lora_700Bold" },
    h1: { fontSize: 34, fontWeight: "700", letterSpacing: -0.4, lineHeight: 40, fontFamily: "Lora_700Bold" },
    h2: { fontSize: 24, fontWeight: "600", letterSpacing: -0.2, lineHeight: 30, fontFamily: "Lora_600SemiBold" },
    h3: { fontSize: 18, fontWeight: "600", lineHeight: 24, fontFamily: "Lora_600SemiBold" },
    body: { fontSize: 16, fontWeight: "400", lineHeight: 24, fontFamily: "Lora_400Regular" },
    caption: { fontSize: 13, fontWeight: "400", lineHeight: 18, fontStyle: "italic", fontFamily: "Lora_400Regular_Italic" },
    eyebrow: { fontSize: 11, fontWeight: "500", letterSpacing: 2.5, textTransform: "uppercase", fontFamily: "Lora_500Medium" },
  },
  elegantItalic: {
    display: { fontSize: 72, fontWeight: "300", letterSpacing: -2, lineHeight: 72, fontStyle: "italic", fontFamily: "CormorantGaramond_400Regular_Italic" },
    h1: { fontSize: 48, fontWeight: "300", letterSpacing: -0.8, lineHeight: 52, fontFamily: "CormorantGaramond_300Light" },
    h2: { fontSize: 32, fontWeight: "400", letterSpacing: -0.3, lineHeight: 36, fontStyle: "italic", fontFamily: "CormorantGaramond_400Regular_Italic" },
    h3: { fontSize: 22, fontWeight: "600", lineHeight: 28, fontFamily: "CormorantGaramond_600SemiBold" },
    body: { fontSize: 17, fontWeight: "400", lineHeight: 28, fontFamily: "CormorantGaramond_400Regular" },
    caption: { fontSize: 13, fontWeight: "400", letterSpacing: 0.5, fontStyle: "italic", fontFamily: "CormorantGaramond_400Regular_Italic" },
    eyebrow: { fontSize: 11, fontWeight: "600", letterSpacing: 4, textTransform: "uppercase", fontFamily: "CormorantGaramond_600SemiBold" },
  },
  heavyDisplay: {
    display: { fontSize: 58, fontWeight: "400", letterSpacing: -2, lineHeight: 58, textTransform: "uppercase", fontFamily: "ArchivoBlack_400Regular" },
    h1: { fontSize: 40, fontWeight: "400", letterSpacing: -0.8, lineHeight: 44, textTransform: "uppercase", fontFamily: "ArchivoBlack_400Regular" },
    h2: { fontSize: 26, fontWeight: "400", letterSpacing: -0.3, lineHeight: 30, textTransform: "uppercase", fontFamily: "ArchivoBlack_400Regular" },
    h3: { fontSize: 18, fontWeight: "700", lineHeight: 24, fontFamily: "Inter_700Bold" },
    body: { fontSize: 15, fontWeight: "500", lineHeight: 22, fontFamily: "Inter_500Medium" },
    caption: { fontSize: 12, fontWeight: "500", letterSpacing: 1, textTransform: "uppercase", fontFamily: "Inter_500Medium" },
    eyebrow: { fontSize: 11, fontWeight: "400", letterSpacing: 3, textTransform: "uppercase", fontFamily: "ArchivoBlack_400Regular" },
  },
  decorative: {
    display: { fontSize: 60, fontWeight: "400", letterSpacing: -1.2, lineHeight: 64, fontFamily: "AbrilFatface_400Regular" },
    h1: { fontSize: 42, fontWeight: "400", letterSpacing: -0.5, lineHeight: 48, fontFamily: "AbrilFatface_400Regular" },
    h2: { fontSize: 28, fontWeight: "400", letterSpacing: -0.2, lineHeight: 34, fontFamily: "AbrilFatface_400Regular" },
    h3: { fontSize: 19, fontWeight: "600", lineHeight: 26, fontFamily: "Lora_600SemiBold" },
    body: { fontSize: 16, fontWeight: "400", lineHeight: 24, fontFamily: "Lora_400Regular" },
    caption: { fontSize: 13, fontWeight: "500", lineHeight: 18, fontFamily: "Lora_500Medium" },
    eyebrow: { fontSize: 11, fontWeight: "500", letterSpacing: 3, textTransform: "uppercase", fontFamily: "Lora_500Medium" },
  },
  geometric: {
    display: { fontSize: 50, fontWeight: "300", letterSpacing: -0.5, lineHeight: 56, fontFamily: "JosefinSans_300Light" },
    h1: { fontSize: 34, fontWeight: "600", letterSpacing: 0, lineHeight: 40, fontFamily: "JosefinSans_600SemiBold" },
    h2: { fontSize: 24, fontWeight: "500", lineHeight: 30, fontFamily: "JosefinSans_500Medium" },
    h3: { fontSize: 18, fontWeight: "600", lineHeight: 24, fontFamily: "JosefinSans_600SemiBold" },
    body: { fontSize: 15, fontWeight: "400", lineHeight: 22, fontFamily: "JosefinSans_400Regular" },
    caption: { fontSize: 13, fontWeight: "400", lineHeight: 18, fontFamily: "JosefinSans_400Regular" },
    eyebrow: { fontSize: 11, fontWeight: "500", letterSpacing: 4, textTransform: "uppercase", fontFamily: "JosefinSans_500Medium" },
  },
  classicEditorial: {
    display: { fontSize: 44, fontWeight: "700", letterSpacing: -0.5, lineHeight: 50, fontFamily: "LibreBaskerville_700Bold" },
    h1: { fontSize: 30, fontWeight: "700", letterSpacing: -0.3, lineHeight: 36, fontFamily: "LibreBaskerville_700Bold" },
    h2: { fontSize: 22, fontWeight: "400", letterSpacing: -0.1, lineHeight: 28, fontStyle: "italic", fontFamily: "LibreBaskerville_400Regular_Italic" },
    h3: { fontSize: 17, fontWeight: "700", lineHeight: 24, fontFamily: "LibreBaskerville_700Bold" },
    body: { fontSize: 16, fontWeight: "400", lineHeight: 26, fontFamily: "LibreBaskerville_400Regular" },
    caption: { fontSize: 12, fontWeight: "400", letterSpacing: 0.3, fontStyle: "italic", fontFamily: "LibreBaskerville_400Regular_Italic" },
    eyebrow: { fontSize: 11, fontWeight: "600", letterSpacing: 3, textTransform: "uppercase", fontFamily: "Inter_600SemiBold" },
  },
};

function resolveTypography(p?: TypographyPreset): TypographyScale {
  if (p && typographyPresets[p]) return typographyPresets[p];
  return typographyPresets.modernSans;
}

export const typography = resolveTypography(
  layoutConfig.typography as TypographyPreset | undefined
);

/* --------------------------------------------------------------------------
 * Layout resolver
 * -------------------------------------------------------------------------- */

export const layout: Required<LayoutConfig> = {
  nav: (layoutConfig.nav as LayoutConfig["nav"]) ?? "bottomTabs",
  hero: (layoutConfig.hero as LayoutConfig["hero"]) ?? "fullBleed",
  menu: (layoutConfig.menu as LayoutConfig["menu"]) ?? "chips",
  gallery: (layoutConfig.gallery as LayoutConfig["gallery"]) ?? "grid",
  events: (layoutConfig.events as LayoutConfig["events"]) ?? "cards",
  location: (layoutConfig.location as LayoutConfig["location"]) ?? "standard",
  typography: (layoutConfig.typography as TypographyPreset) ?? "modernSans",
  density: (layoutConfig.density as Density) ?? "comfortable",
  cornerStyle: layoutConfig.cornerStyle ?? "rounded",
  decor: layoutConfig.decor ?? "dividers",
  mood: layoutConfig.mood ?? "warm",
  tabBarHiddenRoutes: Array.isArray(layoutConfig.tabBarHiddenRoutes)
    ? layoutConfig.tabBarHiddenRoutes
    : [],
};

export function radiusFor(base: number): number {
  if (layout.cornerStyle === "sharp") return 0;
  if (layout.cornerStyle === "pill") return 999;
  return base;
}
