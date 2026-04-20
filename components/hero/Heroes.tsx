import { Image, ScrollView, Text, View } from "react-native";
import { Link } from "expo-router";
import { ActionButton } from "../ActionButton";
import { DecorRule } from "../SectionHeader";
import type { RestaurantConfig } from "../../restaurant.config";
import { radiusFor, spacing, theme, typography } from "../../theme";

type Props = { config: RestaurantConfig };

/* -------------------------------------------------------------------------- */
/* Full-bleed — edge-to-edge image with the CTAs stacked below. Safe default. */
/* -------------------------------------------------------------------------- */
export function FullBleedHero({ config }: Props) {
  const c = config;
  return (
    <View>
      <Image
        source={{ uri: c.hero.image }}
        style={{ width: "100%", height: 320 }}
        resizeMode="cover"
      />
      <View style={{ padding: spacing.lg, gap: spacing.sm }}>
        {c.hero.eyebrow ? (
          <Text style={[typography.eyebrow, { color: theme.accent }]}>{c.hero.eyebrow}</Text>
        ) : null}
        <Text
          style={[typography.h1, { color: theme.text }]}
          numberOfLines={2}
          adjustsFontSizeToFit
          minimumFontScale={0.6}
        >
          {c.name}
        </Text>
        <Text style={[typography.body, { color: theme.muted }]}>{c.tagline}</Text>
        <View style={{ gap: spacing.sm, marginTop: spacing.md }}>
          <Link href="/menu" asChild>
            <View><ActionButton label={c.hero.cta} variant="primary" /></View>
          </Link>
          {c.hero.secondaryCta ? (
            <Link href="/location" asChild>
              <View><ActionButton label={c.hero.secondaryCta} variant="outline" /></View>
            </Link>
          ) : null}
        </View>
      </View>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/* Split — image on top-half, text card slides up overlapping. Magazine feel. */
/* -------------------------------------------------------------------------- */
export function SplitHero({ config }: Props) {
  const c = config;
  return (
    <View style={{ backgroundColor: theme.background }}>
      <Image source={{ uri: c.hero.image }} style={{ width: "100%", height: 260 }} />
      <View
        style={{
          backgroundColor: theme.surface,
          marginTop: -40,
          marginHorizontal: spacing.md,
          borderRadius: radiusFor(theme.radius),
          padding: spacing.lg,
          gap: spacing.sm,
          shadowColor: "#000",
          shadowOpacity: 0.08,
          shadowRadius: 20,
          shadowOffset: { width: 0, height: 8 },
          elevation: 6,
        }}
      >
        {c.hero.eyebrow ? (
          <Text style={[typography.eyebrow, { color: theme.accent }]}>{c.hero.eyebrow}</Text>
        ) : null}
        <Text
          style={[typography.h1, { color: theme.text }]}
          numberOfLines={2}
          adjustsFontSizeToFit
          minimumFontScale={0.6}
        >
          {c.name}
        </Text>
        <Text style={[typography.body, { color: theme.muted }]}>{c.tagline}</Text>
        <DecorRule />
        <Text style={[typography.body, { color: theme.text, marginTop: spacing.sm }]}>
          {c.about}
        </Text>
        <View style={{ flexDirection: "row", gap: spacing.sm, marginTop: spacing.md }}>
          <Link href="/menu" asChild>
            <View style={{ flex: 1 }}>
              <ActionButton label={c.hero.cta} variant="primary" />
            </View>
          </Link>
          {c.hero.secondaryCta ? (
            <Link href="/location" asChild>
              <View style={{ flex: 1 }}>
                <ActionButton label={c.hero.secondaryCta} variant="outline" />
              </View>
            </Link>
          ) : null}
        </View>
      </View>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/* Boxed — framed card with image inset inside theme padding. Classic/elegant. */
/* -------------------------------------------------------------------------- */
export function BoxedHero({ config }: Props) {
  const c = config;
  return (
    <View style={{ padding: spacing.md, gap: spacing.md, backgroundColor: theme.background }}>
      <View
        style={{
          borderRadius: radiusFor(theme.radius),
          overflow: "hidden",
          backgroundColor: theme.surface,
        }}
      >
        <Image
          source={{ uri: c.hero.image }}
          style={{ width: "100%", height: 220 }}
          resizeMode="cover"
        />
        <View style={{ padding: spacing.lg, gap: spacing.sm, alignItems: "center" }}>
          {c.hero.eyebrow ? (
            <Text style={[typography.eyebrow, { color: theme.accent }]}>{c.hero.eyebrow}</Text>
          ) : null}
          <Text
            style={[typography.h1, { color: theme.text, textAlign: "center" }]}
            numberOfLines={2}
            adjustsFontSizeToFit
            minimumFontScale={0.5}
          >
            {c.name}
          </Text>
          <Text style={[typography.body, { color: theme.muted, textAlign: "center" }]}>
            {c.tagline}
          </Text>
          <DecorRule align="center" />
          <View style={{ gap: spacing.sm, width: "100%", marginTop: spacing.md }}>
            <Link href="/menu" asChild>
              <View><ActionButton label={c.hero.cta} variant="primary" /></View>
            </Link>
          </View>
        </View>
      </View>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/* Editorial — big type first, image smaller below. Print-magazine feel.       */
/* -------------------------------------------------------------------------- */
export function EditorialHero({ config }: Props) {
  const c = config;
  return (
    <View style={{ padding: spacing.lg, gap: spacing.md, backgroundColor: theme.background }}>
      {c.hero.eyebrow ? (
        <Text style={[typography.eyebrow, { color: theme.accent }]}>{c.hero.eyebrow}</Text>
      ) : null}
      <Text
        style={[typography.display, { color: theme.text }]}
        numberOfLines={3}
        adjustsFontSizeToFit
        minimumFontScale={0.4}
      >
        {c.name}
      </Text>
      <Text style={[typography.h3, { color: theme.muted }]}>{c.tagline}</Text>
      <View style={{ height: 1, backgroundColor: theme.text, opacity: 0.15, marginVertical: spacing.sm }} />
      <Image
        source={{ uri: c.hero.image }}
        style={{ width: "100%", height: 220, borderRadius: radiusFor(theme.radius) }}
        resizeMode="cover"
      />
      <Text style={[typography.body, { color: theme.text, marginTop: spacing.sm }]}>
        {c.about}
      </Text>
      <View style={{ flexDirection: "row", gap: spacing.md, marginTop: spacing.sm }}>
        <Link href="/menu" asChild>
          <View style={{ flex: 1 }}>
            <ActionButton label={c.hero.cta} variant="primary" />
          </View>
        </Link>
        {c.hero.secondaryCta ? (
          <Link href="/location" asChild>
            <View><ActionButton label={c.hero.secondaryCta} variant="ghost" /></View>
          </Link>
        ) : null}
      </View>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/* Minimal — text-forward, tiny image accent. Fine-dining/luxury feel.         */
/* -------------------------------------------------------------------------- */
export function MinimalHero({ config }: Props) {
  const c = config;
  return (
    <View
      style={{
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.xxl,
        gap: spacing.md,
        backgroundColor: theme.background,
      }}
    >
      {c.hero.eyebrow ? (
        <Text style={[typography.eyebrow, { color: theme.accent, textAlign: "center" }]}>
          {c.hero.eyebrow}
        </Text>
      ) : null}
      <Text
        style={[typography.display, { color: theme.text, textAlign: "center" }]}
        numberOfLines={3}
        adjustsFontSizeToFit
        minimumFontScale={0.4}
      >
        {c.name}
      </Text>
      <DecorRule align="center" />
      <Text
        style={[
          typography.body,
          { color: theme.muted, textAlign: "center", marginTop: spacing.sm },
        ]}
      >
        {c.tagline}
      </Text>
      <View
        style={{
          width: 120,
          height: 120,
          borderRadius: radiusFor(999),
          overflow: "hidden",
          alignSelf: "center",
          marginVertical: spacing.lg,
        }}
      >
        <Image source={{ uri: c.hero.image }} style={{ width: "100%", height: "100%" }} />
      </View>
      <Link href="/menu" asChild>
        <View style={{ alignSelf: "center" }}>
          <ActionButton label={c.hero.cta} variant="outline" />
        </View>
      </Link>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/* Marquee — horizontal scrolling name with image underneath. Bold/playful.    */
/* -------------------------------------------------------------------------- */
export function MarqueeHero({ config }: Props) {
  const c = config;
  const repeated = Array.from({ length: 6 }).map(() => c.name.toUpperCase()).join("  ·  ");
  return (
    <View style={{ gap: spacing.md, paddingTop: spacing.md, backgroundColor: theme.background }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: spacing.md }}
      >
        <Text
          style={[
            typography.display,
            {
              color: theme.accent,
              letterSpacing: 2,
            },
          ]}
        >
          {repeated}
        </Text>
      </ScrollView>
      <Image source={{ uri: c.hero.image }} style={{ width: "100%", height: 260 }} />
      <View style={{ padding: spacing.lg, gap: spacing.sm }}>
        <Text style={[typography.h2, { color: theme.text }]}>{c.tagline}</Text>
        <Text style={[typography.body, { color: theme.muted }]}>{c.about}</Text>
        <Link href="/menu" asChild>
          <View style={{ marginTop: spacing.md }}>
            <ActionButton label={c.hero.cta} variant="primary" />
          </View>
        </Link>
      </View>
    </View>
  );
}

/* -------------------------------------------------------------------------- */

export function resolveHero(variant: string) {
  switch (variant) {
    case "split":
      return SplitHero;
    case "boxed":
      return BoxedHero;
    case "editorial":
      return EditorialHero;
    case "minimal":
      return MinimalHero;
    case "marquee":
      return MarqueeHero;
    case "fullBleed":
    default:
      return FullBleedHero;
  }
}
