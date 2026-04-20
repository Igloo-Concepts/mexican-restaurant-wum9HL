import { Image, ScrollView, Text, View } from "react-native";
import type { RestaurantConfig } from "../../restaurant.config";
import { radiusFor, spacing, theme, typography } from "../../theme";
import { DecorRule } from "../SectionHeader";

type Props = { config: RestaurantConfig };

/* -------------------------------------------------------------------------- */
/* Cards — original stacked cards. Safe default.                              */
/* -------------------------------------------------------------------------- */
export function CardsEvents({ config }: Props) {
  return (
    <ScrollView
      contentContainerStyle={{ padding: spacing.md, gap: spacing.md }}
      style={{ backgroundColor: theme.background }}
    >
      {config.events.map((e) => (
        <View
          key={e.id}
          style={{
            backgroundColor: theme.surface,
            padding: spacing.lg,
            borderRadius: radiusFor(theme.radius),
            overflow: "hidden",
          }}
        >
          {e.image ? (
            <Image
              source={{ uri: e.image }}
              style={{
                width: "100%",
                height: 160,
                borderRadius: radiusFor(theme.radius - 4),
                marginBottom: spacing.md,
              }}
            />
          ) : null}
          <Text style={{ color: theme.accent, fontWeight: "700" }}>{e.date}</Text>
          <Text
            style={[typography.h2, { color: theme.text, marginTop: spacing.xs }]}
          >
            {e.title}
          </Text>
          <Text
            style={[typography.body, { color: theme.muted, marginTop: spacing.sm }]}
          >
            {e.description}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

/* -------------------------------------------------------------------------- */
/* Timeline — left rail with dots + connecting line, content on the right.    */
/* -------------------------------------------------------------------------- */
export function TimelineEvents({ config }: Props) {
  return (
    <ScrollView
      style={{ backgroundColor: theme.background }}
      contentContainerStyle={{ padding: spacing.lg }}
    >
      {config.events.map((e, idx) => {
        const last = idx === config.events.length - 1;
        return (
          <View key={e.id} style={{ flexDirection: "row", gap: spacing.md }}>
            <View style={{ alignItems: "center", width: 20 }}>
              <View
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 999,
                  backgroundColor: theme.accent,
                  marginTop: 4,
                }}
              />
              {!last ? (
                <View
                  style={{
                    width: 2,
                    flex: 1,
                    backgroundColor: theme.muted + "44",
                    marginTop: 2,
                  }}
                />
              ) : null}
            </View>
            <View style={{ flex: 1, paddingBottom: spacing.xl }}>
              <Text
                style={[
                  typography.eyebrow,
                  { color: theme.accent, marginBottom: spacing.xs },
                ]}
              >
                {e.date}
              </Text>
              <Text style={[typography.h3, { color: theme.text }]}>{e.title}</Text>
              <Text
                style={[typography.body, { color: theme.muted, marginTop: spacing.xs }]}
              >
                {e.description}
              </Text>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}

/* -------------------------------------------------------------------------- */
/* Magazine — alternating sides, editorial layout with ornaments.              */
/* -------------------------------------------------------------------------- */
export function MagazineEvents({ config }: Props) {
  return (
    <ScrollView
      style={{ backgroundColor: theme.background }}
      contentContainerStyle={{ padding: spacing.lg, gap: spacing.xl }}
    >
      {config.events.map((e, i) => (
        <View key={e.id} style={{ gap: spacing.sm }}>
          <Text
            style={[
              typography.eyebrow,
              { color: theme.accent, textAlign: i % 2 === 0 ? "left" : "right" },
            ]}
          >
            {e.date}
          </Text>
          <Text
            style={[
              typography.h1,
              { color: theme.text, textAlign: i % 2 === 0 ? "left" : "right" },
            ]}
          >
            {e.title}
          </Text>
          <DecorRule align={i % 2 === 0 ? "left" : "center"} />
          <Text
            style={[
              typography.body,
              {
                color: theme.muted,
                marginTop: spacing.sm,
                textAlign: i % 2 === 0 ? "left" : "right",
              },
            ]}
          >
            {e.description}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

/* -------------------------------------------------------------------------- */
/* List — minimal dense listing, date on left, title + blurb on right.         */
/* -------------------------------------------------------------------------- */
export function ListEvents({ config }: Props) {
  return (
    <ScrollView
      style={{ backgroundColor: theme.background }}
      contentContainerStyle={{ paddingVertical: spacing.md }}
    >
      {config.events.map((e) => (
        <View
          key={e.id}
          style={{
            flexDirection: "row",
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.md,
            gap: spacing.md,
            borderBottomWidth: 1,
            borderBottomColor: theme.muted + "22",
          }}
        >
          <View style={{ width: 72 }}>
            <Text style={[typography.eyebrow, { color: theme.accent }]}>{e.date}</Text>
          </View>
          <View style={{ flex: 1, gap: spacing.xs }}>
            <Text style={[typography.h3, { color: theme.text }]}>{e.title}</Text>
            <Text style={[typography.caption, { color: theme.muted }]}>
              {e.description}
            </Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

/* -------------------------------------------------------------------------- */

export function resolveEvents(variant: string) {
  switch (variant) {
    case "timeline":
      return TimelineEvents;
    case "magazine":
      return MagazineEvents;
    case "list":
      return ListEvents;
    case "cards":
    default:
      return CardsEvents;
  }
}
