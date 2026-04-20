import { useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import type { MenuItem, RestaurantConfig } from "../../restaurant.config";
import { radiusFor, spacing, theme, typography } from "../../theme";
import { DecorRule } from "../SectionHeader";

type Props = { config: RestaurantConfig };

/* -------------------------------------------------------------------------- */
/* Chips — horizontal category pills with card list. Current default.         */
/* -------------------------------------------------------------------------- */
export function ChipsMenu({ config }: Props) {
  const { categories, items } = config.menu;
  const [active, setActive] = useState(categories[0] ?? "");
  const filtered = items.filter((i) => i.category === active);
  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ padding: spacing.md, gap: spacing.sm }}
        style={{ flexGrow: 0 }}
      >
        {categories.map((cat) => {
          const isActive = cat === active;
          return (
            <Pressable
              key={cat}
              onPress={() => setActive(cat)}
              style={{
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.sm,
                borderRadius: 999,
                backgroundColor: isActive ? theme.accent : theme.surface,
              }}
            >
              <Text
                style={{
                  color: isActive ? "#fff" : theme.text,
                  fontWeight: "600",
                }}
              >
                {cat}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
      <ScrollView contentContainerStyle={{ padding: spacing.md, gap: spacing.md }}>
        {filtered.map((item) => (
          <ItemRowCard key={item.id} item={item} />
        ))}
      </ScrollView>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/* Accordion — every category stacked as an expandable section.               */
/* -------------------------------------------------------------------------- */
export function AccordionMenu({ config }: Props) {
  const { categories, items } = config.menu;
  const [open, setOpen] = useState<string | null>(categories[0] ?? null);
  return (
    <ScrollView
      style={{ backgroundColor: theme.background }}
      contentContainerStyle={{ padding: spacing.md, gap: spacing.sm }}
    >
      {categories.map((cat) => {
        const expanded = open === cat;
        const members = items.filter((i) => i.category === cat);
        return (
          <View
            key={cat}
            style={{
              backgroundColor: theme.surface,
              borderRadius: radiusFor(theme.radius),
              overflow: "hidden",
            }}
          >
            <Pressable
              onPress={() => setOpen(expanded ? null : cat)}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                padding: spacing.md,
              }}
            >
              <Text style={[typography.h3, { color: theme.text }]}>{cat}</Text>
              <Text style={{ color: theme.accent, fontWeight: "700", fontSize: 18 }}>
                {expanded ? "–" : "+"}
              </Text>
            </Pressable>
            {expanded ? (
              <View style={{ padding: spacing.md, paddingTop: 0, gap: spacing.md }}>
                {members.map((i) => (
                  <ItemRowPlain key={i.id} item={i} />
                ))}
              </View>
            ) : null}
          </View>
        );
      })}
    </ScrollView>
  );
}

/* -------------------------------------------------------------------------- */
/* Grid — two-column image cards grouped by category. Highly visual.          */
/* -------------------------------------------------------------------------- */
export function GridMenu({ config }: Props) {
  const { categories, items } = config.menu;
  return (
    <ScrollView
      style={{ backgroundColor: theme.background }}
      contentContainerStyle={{ padding: spacing.md, gap: spacing.lg }}
    >
      {categories.map((cat) => {
        const members = items.filter((i) => i.category === cat);
        if (!members.length) return null;
        return (
          <View key={cat} style={{ gap: spacing.md }}>
            <Text style={[typography.h2, { color: theme.text }]}>{cat}</Text>
            <DecorRule />
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: spacing.md,
              }}
            >
              {members.map((item) => (
                <View
                  key={item.id}
                  style={{
                    width: "48%",
                    backgroundColor: theme.surface,
                    borderRadius: radiusFor(theme.radius),
                    overflow: "hidden",
                  }}
                >
                  {item.image ? (
                    <Image
                      source={{ uri: item.image }}
                      style={{ width: "100%", height: 120 }}
                    />
                  ) : (
                    <View
                      style={{
                        width: "100%",
                        height: 120,
                        backgroundColor: theme.accent + "22",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Text style={{ fontSize: 32 }}>🍽</Text>
                    </View>
                  )}
                  <View style={{ padding: spacing.sm, gap: 2 }}>
                    <Text
                      style={[typography.h3, { color: theme.text }]}
                      numberOfLines={1}
                    >
                      {item.name}
                    </Text>
                    <Text
                      style={[typography.caption, { color: theme.muted }]}
                      numberOfLines={2}
                    >
                      {item.description}
                    </Text>
                    <Text
                      style={{ color: theme.accent, fontWeight: "700", marginTop: spacing.xs }}
                    >
                      {item.price}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}

/* -------------------------------------------------------------------------- */
/* Magazine — alternating full-width photo items. Slow/luxurious scroll.       */
/* -------------------------------------------------------------------------- */
export function MagazineMenu({ config }: Props) {
  const { categories, items } = config.menu;
  return (
    <ScrollView
      style={{ backgroundColor: theme.background }}
      contentContainerStyle={{ paddingBottom: spacing.xl, gap: spacing.xl }}
    >
      {categories.map((cat) => (
        <View key={cat} style={{ gap: spacing.lg }}>
          <View style={{ paddingHorizontal: spacing.lg }}>
            <Text style={[typography.eyebrow, { color: theme.accent }]}>Section</Text>
            <Text style={[typography.h1, { color: theme.text }]}>{cat}</Text>
          </View>
          {items
            .filter((i) => i.category === cat)
            .map((item, idx) => (
              <View
                key={item.id}
                style={{
                  paddingHorizontal: spacing.md,
                  flexDirection: idx % 2 === 0 ? "row" : "row-reverse",
                  gap: spacing.md,
                  alignItems: "center",
                }}
              >
                {item.image ? (
                  <Image
                    source={{ uri: item.image }}
                    style={{
                      width: 140,
                      height: 140,
                      borderRadius: radiusFor(theme.radius),
                    }}
                  />
                ) : (
                  <View
                    style={{
                      width: 140,
                      height: 140,
                      borderRadius: radiusFor(theme.radius),
                      backgroundColor: theme.accent + "22",
                    }}
                  />
                )}
                <View style={{ flex: 1, gap: spacing.xs }}>
                  <Text style={[typography.h3, { color: theme.text }]}>{item.name}</Text>
                  <Text style={[typography.body, { color: theme.muted }]}>
                    {item.description}
                  </Text>
                  <Text
                    style={{
                      color: theme.accent,
                      fontWeight: "700",
                      marginTop: spacing.xs,
                    }}
                  >
                    {item.price}
                  </Text>
                </View>
              </View>
            ))}
        </View>
      ))}
    </ScrollView>
  );
}

/* -------------------------------------------------------------------------- */
/* Compact list — a dense printed menu, dotted leader between name and price. */
/* -------------------------------------------------------------------------- */
export function CompactListMenu({ config }: Props) {
  const { categories, items } = config.menu;
  return (
    <ScrollView
      style={{ backgroundColor: theme.background }}
      contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg }}
    >
      {categories.map((cat) => {
        const members = items.filter((i) => i.category === cat);
        if (!members.length) return null;
        return (
          <View key={cat} style={{ gap: spacing.sm }}>
            <Text
              style={[
                typography.eyebrow,
                { color: theme.accent, textAlign: "center" },
              ]}
            >
              {cat}
            </Text>
            <View
              style={{
                height: 1,
                alignSelf: "stretch",
                backgroundColor: theme.muted + "55",
              }}
            />
            {members.map((item) => (
              <View key={item.id} style={{ paddingVertical: spacing.sm }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "flex-end",
                    gap: spacing.xs,
                  }}
                >
                  <Text style={[typography.h3, { color: theme.text }]}>{item.name}</Text>
                  <Text
                    numberOfLines={1}
                    style={{
                      flex: 1,
                      color: theme.muted + "99",
                      letterSpacing: 2,
                    }}
                  >
                    ···············································
                  </Text>
                  <Text style={{ color: theme.text, fontWeight: "700" }}>{item.price}</Text>
                </View>
                <Text
                  style={[
                    typography.caption,
                    { color: theme.muted, marginTop: 2 },
                  ]}
                >
                  {item.description}
                </Text>
              </View>
            ))}
          </View>
        );
      })}
    </ScrollView>
  );
}

/* -------------------------------------------------------------------------- */

function ItemRowCard({ item }: { item: MenuItem }) {
  return (
    <View
      style={{
        backgroundColor: theme.surface,
        padding: spacing.md,
        borderRadius: radiusFor(theme.radius),
        flexDirection: "row",
        gap: spacing.md,
      }}
    >
      <View style={{ flex: 1 }}>
        <Text style={[typography.h3, { color: theme.text }]}>{item.name}</Text>
        <Text
          style={[typography.body, { color: theme.muted, marginTop: spacing.xs }]}
        >
          {item.description}
        </Text>
      </View>
      <Text style={[typography.h3, { color: theme.accent }]}>{item.price}</Text>
    </View>
  );
}

function ItemRowPlain({ item }: { item: MenuItem }) {
  return (
    <View style={{ gap: 2 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={[typography.h3, { color: theme.text, flex: 1 }]} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={{ color: theme.accent, fontWeight: "700" }}>{item.price}</Text>
      </View>
      <Text style={[typography.caption, { color: theme.muted }]}>{item.description}</Text>
    </View>
  );
}

export function resolveMenu(variant: string) {
  switch (variant) {
    case "accordion":
      return AccordionMenu;
    case "grid":
      return GridMenu;
    case "magazine":
      return MagazineMenu;
    case "compactList":
      return CompactListMenu;
    case "chips":
    default:
      return ChipsMenu;
  }
}
