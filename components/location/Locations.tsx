import { Image, Linking, Pressable, ScrollView, Text, View } from "react-native";
import type { RestaurantConfig } from "../../restaurant.config";
import { ActionButton } from "../ActionButton";
import { DecorRule } from "../SectionHeader";
import { radiusFor, spacing, theme, typography } from "../../theme";

type Props = { config: RestaurantConfig };

/* -------------------------------------------------------------------------- */
/* Standard — original stacked cards (visit, hours, contact).                  */
/* -------------------------------------------------------------------------- */
export function StandardLocation({ config }: Props) {
  const c = config.contact;
  return (
    <ScrollView
      contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg }}
      style={{ backgroundColor: theme.background }}
    >
      <View>
        <Text style={[typography.h2, { color: theme.text }]}>Visit us</Text>
        <Text
          style={[typography.body, { color: theme.muted, marginTop: spacing.xs }]}
        >
          {c.address}
        </Text>
      </View>
      <ActionButton label="Open in Maps" onPress={() => Linking.openURL(c.mapsUrl)} />
      <Card>
        <Text style={[typography.h3, { color: theme.text }]}>Opening hours</Text>
        {c.hours.map((h) => (
          <Row key={h.day} label={h.day} value={h.hours} />
        ))}
      </Card>
      <Card>
        <Text style={[typography.h3, { color: theme.text }]}>Contact</Text>
        <Pressable onPress={() => Linking.openURL(`tel:${c.phone}`)}>
          <Text style={[typography.body, { color: theme.accent }]}>{c.phone}</Text>
        </Pressable>
        <Pressable onPress={() => Linking.openURL(`mailto:${c.email}`)}>
          <Text style={[typography.body, { color: theme.accent }]}>{c.email}</Text>
        </Pressable>
      </Card>
    </ScrollView>
  );
}

/* -------------------------------------------------------------------------- */
/* Compact — pure text, classic printed-card feel, centered.                   */
/* -------------------------------------------------------------------------- */
export function CompactLocation({ config }: Props) {
  const c = config.contact;
  return (
    <ScrollView
      contentContainerStyle={{
        padding: spacing.xl,
        gap: spacing.md,
        alignItems: "center",
      }}
      style={{ backgroundColor: theme.background }}
    >
      <Text style={[typography.eyebrow, { color: theme.accent }]}>Find us</Text>
      <Text style={[typography.h1, { color: theme.text, textAlign: "center" }]}>
        {config.name}
      </Text>
      <DecorRule align="center" />
      <Text
        style={[
          typography.body,
          { color: theme.text, textAlign: "center", marginTop: spacing.md },
        ]}
      >
        {c.address}
      </Text>
      <Pressable
        onPress={() => Linking.openURL(c.mapsUrl)}
        style={{ marginTop: spacing.sm }}
      >
        <Text style={{ color: theme.accent, fontWeight: "700", letterSpacing: 1 }}>
          GET DIRECTIONS →
        </Text>
      </Pressable>
      <View
        style={{
          height: 1,
          alignSelf: "stretch",
          backgroundColor: theme.muted + "44",
          marginVertical: spacing.lg,
        }}
      />
      <View style={{ alignItems: "center", gap: spacing.xs }}>
        {c.hours.map((h) => (
          <View
            key={h.day}
            style={{ flexDirection: "row", gap: spacing.md, minWidth: 240, justifyContent: "space-between" }}
          >
            <Text style={[typography.body, { color: theme.muted }]}>{h.day}</Text>
            <Text style={[typography.body, { color: theme.text, fontWeight: "600" }]}>
              {h.hours}
            </Text>
          </View>
        ))}
      </View>
      <View
        style={{
          height: 1,
          alignSelf: "stretch",
          backgroundColor: theme.muted + "44",
          marginVertical: spacing.lg,
        }}
      />
      <Pressable onPress={() => Linking.openURL(`tel:${c.phone}`)}>
        <Text style={[typography.h3, { color: theme.accent }]}>{c.phone}</Text>
      </Pressable>
      <Pressable onPress={() => Linking.openURL(`mailto:${c.email}`)}>
        <Text style={[typography.body, { color: theme.muted }]}>{c.email}</Text>
      </Pressable>
    </ScrollView>
  );
}

/* -------------------------------------------------------------------------- */
/* Hero — full-bleed hero image at the top, content overlay, then info cards. */
/* -------------------------------------------------------------------------- */
export function HeroLocation({ config }: Props) {
  const c = config.contact;
  return (
    <ScrollView style={{ backgroundColor: theme.background }}>
      <View>
        <Image
          source={{ uri: config.hero.image }}
          style={{ width: "100%", height: 280 }}
          resizeMode="cover"
        />
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: spacing.lg,
            backgroundColor: "rgba(0,0,0,0.45)",
          }}
        >
          <Text style={[typography.h1, { color: "#fff" }]}>Visit us</Text>
          <Text style={[typography.body, { color: "#fff", opacity: 0.85 }]}>
            {c.address}
          </Text>
        </View>
      </View>
      <View style={{ padding: spacing.lg, gap: spacing.md }}>
        <ActionButton label="Open in Maps" onPress={() => Linking.openURL(c.mapsUrl)} />
        <Card>
          <Text style={[typography.h3, { color: theme.text }]}>Opening hours</Text>
          {c.hours.map((h) => (
            <Row key={h.day} label={h.day} value={h.hours} />
          ))}
        </Card>
        <Card>
          <Text style={[typography.h3, { color: theme.text }]}>Contact</Text>
          <Pressable onPress={() => Linking.openURL(`tel:${c.phone}`)}>
            <Text style={[typography.body, { color: theme.accent }]}>{c.phone}</Text>
          </Pressable>
          <Pressable onPress={() => Linking.openURL(`mailto:${c.email}`)}>
            <Text style={[typography.body, { color: theme.accent }]}>{c.email}</Text>
          </Pressable>
        </Card>
      </View>
    </ScrollView>
  );
}

/* -------------------------------------------------------------------------- */

function Card({ children }: { children: React.ReactNode }) {
  return (
    <View
      style={{
        backgroundColor: theme.surface,
        padding: spacing.lg,
        borderRadius: radiusFor(theme.radius),
        gap: spacing.sm,
      }}
    >
      {children}
    </View>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
      <Text style={[typography.body, { color: theme.text }]}>{label}</Text>
      <Text style={[typography.body, { color: theme.muted }]}>{value}</Text>
    </View>
  );
}

export function resolveLocation(variant: string) {
  switch (variant) {
    case "compact":
      return CompactLocation;
    case "hero":
      return HeroLocation;
    case "standard":
    default:
      return StandardLocation;
  }
}
