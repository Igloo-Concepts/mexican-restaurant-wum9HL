/**
 * Font registry — maps every typography preset to the exact Google Font
 * modules it needs, and exposes a single `getFontAssetsForPreset` used by the
 * app root to load only what's required for the current project. We import
 * statically (Snack bundles modules statically) but only register the subset
 * the active preset uses, so unused families don't take up memory.
 */
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
} from "@expo-google-fonts/inter";
import {
  PlayfairDisplay_400Regular,
  PlayfairDisplay_500Medium,
  PlayfairDisplay_700Bold,
  PlayfairDisplay_400Regular_Italic,
} from "@expo-google-fonts/playfair-display";
import {
  DMSerifDisplay_400Regular,
  DMSerifDisplay_400Regular_Italic,
} from "@expo-google-fonts/dm-serif-display";
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_800ExtraBold,
} from "@expo-google-fonts/poppins";
import {
  SpaceMono_400Regular,
  SpaceMono_700Bold,
} from "@expo-google-fonts/space-mono";
import { BebasNeue_400Regular } from "@expo-google-fonts/bebas-neue";
import {
  Lora_400Regular,
  Lora_500Medium,
  Lora_600SemiBold,
  Lora_700Bold,
  Lora_400Regular_Italic,
} from "@expo-google-fonts/lora";
import {
  CormorantGaramond_300Light,
  CormorantGaramond_400Regular,
  CormorantGaramond_400Regular_Italic,
  CormorantGaramond_600SemiBold,
  CormorantGaramond_700Bold,
} from "@expo-google-fonts/cormorant-garamond";
import { ArchivoBlack_400Regular } from "@expo-google-fonts/archivo-black";
import { AbrilFatface_400Regular } from "@expo-google-fonts/abril-fatface";
import {
  JosefinSans_300Light,
  JosefinSans_400Regular,
  JosefinSans_500Medium,
  JosefinSans_600SemiBold,
  JosefinSans_700Bold,
} from "@expo-google-fonts/josefin-sans";
import {
  LibreBaskerville_400Regular,
  LibreBaskerville_400Regular_Italic,
  LibreBaskerville_700Bold,
} from "@expo-google-fonts/libre-baskerville";

import type { TypographyPreset } from "../restaurant.config";

export const FONTS_FOR_PRESET: Record<TypographyPreset, Record<string, any>> = {
  modernSans: {
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  },
  serifDisplay: {
    PlayfairDisplay_400Regular,
    PlayfairDisplay_500Medium,
    PlayfairDisplay_700Bold,
    PlayfairDisplay_400Regular_Italic,
    Inter_400Regular,
    Inter_600SemiBold,
  },
  editorialSerif: {
    DMSerifDisplay_400Regular,
    DMSerifDisplay_400Regular_Italic,
    LibreBaskerville_400Regular,
    LibreBaskerville_400Regular_Italic,
    LibreBaskerville_700Bold,
  },
  rounded: {
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
  },
  monoMinimal: {
    SpaceMono_400Regular,
    SpaceMono_700Bold,
  },
  boldCondensed: {
    BebasNeue_400Regular,
    Inter_400Regular,
    Inter_500Medium,
    Inter_700Bold,
  },
  warmSerif: {
    Lora_400Regular,
    Lora_500Medium,
    Lora_600SemiBold,
    Lora_700Bold,
    Lora_400Regular_Italic,
  },
  elegantItalic: {
    CormorantGaramond_300Light,
    CormorantGaramond_400Regular,
    CormorantGaramond_400Regular_Italic,
    CormorantGaramond_600SemiBold,
    CormorantGaramond_700Bold,
  },
  heavyDisplay: {
    ArchivoBlack_400Regular,
    Inter_400Regular,
    Inter_500Medium,
    Inter_700Bold,
  },
  decorative: {
    AbrilFatface_400Regular,
    Lora_400Regular,
    Lora_500Medium,
    Lora_600SemiBold,
  },
  geometric: {
    JosefinSans_300Light,
    JosefinSans_400Regular,
    JosefinSans_500Medium,
    JosefinSans_600SemiBold,
    JosefinSans_700Bold,
  },
  classicEditorial: {
    LibreBaskerville_400Regular,
    LibreBaskerville_400Regular_Italic,
    LibreBaskerville_700Bold,
    Inter_400Regular,
    Inter_600SemiBold,
  },
};

/**
 * Flatten into the shape `useFonts()` expects. We always include `Inter` as a
 * baseline fallback so the UI is readable during a partial load or when the
 * AI has written an invalid preset name.
 */
export function getFontAssetsForPreset(preset: string): Record<string, any> {
  const map = FONTS_FOR_PRESET[preset as TypographyPreset];
  return {
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
    ...(map ?? FONTS_FOR_PRESET.modernSans),
  };
}
