import { useState } from "react";
import { Image, ScrollView, View, useWindowDimensions } from "react-native";
import type { RestaurantConfig } from "../../restaurant.config";
import { radiusFor, spacing, theme } from "../../theme";

type Props = { config: RestaurantConfig };

/* -------------------------------------------------------------------------- */
/* Grid — 2-column even grid. Safe default.                                    */
/* -------------------------------------------------------------------------- */
export function GridGallery({ config }: Props) {
  const { width } = useWindowDimensions();
  const itemSize = (width - spacing.md * 3) / 2;
  return (
    <ScrollView
      contentContainerStyle={{
        padding: spacing.md,
        flexDirection: "row",
        flexWrap: "wrap",
        gap: spacing.md,
      }}
      style={{ backgroundColor: theme.background }}
    >
      {config.gallery.map((uri, i) => (
        <View
          key={i}
          style={{
            width: itemSize,
            height: itemSize,
            borderRadius: radiusFor(theme.radius),
            overflow: "hidden",
            backgroundColor: theme.surface,
          }}
        >
          <Image source={{ uri }} style={{ width: "100%", height: "100%" }} />
        </View>
      ))}
    </ScrollView>
  );
}

/* -------------------------------------------------------------------------- */
/* Masonry — staggered two-column with alternating image heights.             */
/* -------------------------------------------------------------------------- */
export function MasonryGallery({ config }: Props) {
  const { width } = useWindowDimensions();
  const itemWidth = (width - spacing.md * 3) / 2;
  const left = config.gallery.filter((_, i) => i % 2 === 0);
  const right = config.gallery.filter((_, i) => i % 2 === 1);
  const heights = [200, 140, 180, 220, 160];
  return (
    <ScrollView
      style={{ backgroundColor: theme.background }}
      contentContainerStyle={{ padding: spacing.md }}
    >
      <View style={{ flexDirection: "row", gap: spacing.md }}>
        <View style={{ flex: 1, gap: spacing.md }}>
          {left.map((uri, i) => (
            <Image
              key={`l-${i}`}
              source={{ uri }}
              style={{
                width: itemWidth,
                height: heights[i % heights.length] ?? 180,
                borderRadius: radiusFor(theme.radius),
              }}
            />
          ))}
        </View>
        <View style={{ flex: 1, gap: spacing.md, marginTop: spacing.xl }}>
          {right.map((uri, i) => (
            <Image
              key={`r-${i}`}
              source={{ uri }}
              style={{
                width: itemWidth,
                height: heights[(i + 2) % heights.length] ?? 180,
                borderRadius: radiusFor(theme.radius),
              }}
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

/* -------------------------------------------------------------------------- */
/* Hero + strip — one oversized hero image then a horizontal thumbnail strip. */
/* -------------------------------------------------------------------------- */
export function HeroStripGallery({ config }: Props) {
  const [active, setActive] = useState(0);
  if (!config.gallery.length) return null;
  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <Image
        source={{ uri: config.gallery[active] }}
        style={{ width: "100%", flex: 1 }}
        resizeMode="cover"
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          padding: spacing.md,
          gap: spacing.sm,
          backgroundColor: theme.surface,
        }}
      >
        {config.gallery.map((uri, i) => (
          <View
            key={i}
            style={{
              borderRadius: radiusFor(8),
              overflow: "hidden",
              borderWidth: active === i ? 2 : 0,
              borderColor: theme.accent,
            }}
          >
            <Image
              source={{ uri }}
              onStartShouldSetResponder={() => {
                setActive(i);
                return true;
              }}
              style={{ width: 72, height: 72 }}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/* Carousel — paginated full-width images with dots indicator.                */
/* -------------------------------------------------------------------------- */
export function CarouselGallery({ config }: Props) {
  const { width } = useWindowDimensions();
  const [page, setPage] = useState(0);
  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const idx = Math.round(e.nativeEvent.contentOffset.x / width);
          setPage(idx);
        }}
      >
        {config.gallery.map((uri, i) => (
          <Image
            key={i}
            source={{ uri }}
            style={{ width, height: "100%" }}
            resizeMode="cover"
          />
        ))}
      </ScrollView>
      <View
        style={{
          position: "absolute",
          bottom: spacing.lg,
          alignSelf: "center",
          flexDirection: "row",
          gap: 6,
        }}
      >
        {config.gallery.map((_, i) => (
          <View
            key={i}
            style={{
              width: page === i ? 20 : 8,
              height: 8,
              borderRadius: 999,
              backgroundColor: page === i ? theme.accent : "#fff",
              opacity: page === i ? 1 : 0.6,
            }}
          />
        ))}
      </View>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/* Full-bleed stack — one image per row, edge to edge. Bold/cinematic.        */
/* -------------------------------------------------------------------------- */
export function FullBleedStackGallery({ config }: Props) {
  return (
    <ScrollView
      style={{ backgroundColor: theme.background }}
      contentContainerStyle={{ gap: 2 }}
    >
      {config.gallery.map((uri, i) => (
        <Image key={i} source={{ uri }} style={{ width: "100%", height: 320 }} />
      ))}
    </ScrollView>
  );
}

/* -------------------------------------------------------------------------- */

export function resolveGallery(variant: string) {
  switch (variant) {
    case "masonry":
      return MasonryGallery;
    case "heroStrip":
      return HeroStripGallery;
    case "carousel":
      return CarouselGallery;
    case "fullBleedStack":
      return FullBleedStackGallery;
    case "grid":
    default:
      return GridGallery;
  }
}
