import { Linking, Pressable, Text, View } from "react-native";
import { SafeFormScroll } from "../../components/layout/SafeFormScroll";
import { SectionHeader } from "../../components/SectionHeader";
import { restaurantConfig } from "../../restaurant.config";
import { useLocations } from "../../lib/platform";
import { radiusFor, spacing, theme, typography } from "../../theme";

/**
 * Multi-location picker. Lists every location served by the tenant, with
 * hours, map link, and phone. For single-location restaurants this screen
 * is never registered (the owner doesn't enable the module) so we don't
 * need a "single location" fallback.
 */
export default function LocationsScreen() {
  const { data, loading } = useLocations();
  const fallback = restaurantConfig.modules?.multiLocation?.locations ?? [];
  const list =
    (data?.locations && data.locations.length > 0
      ? data.locations
      : fallback) ?? [];

  return (
    <SafeFormScroll>
      <SectionHeader title="Our locations" />
      {loading && list.length === 0 ? (
        <Text style={{ color: theme.muted, marginTop: spacing.md }}>Loading…</Text>
      ) : list.length === 0 ? (
        <Text style={{ color: theme.muted, marginTop: spacing.md }}>
          New locations coming soon.
        </Text>
      ) : (
        <View style={{ gap: spacing.md, marginTop: spacing.md }}>
          {list.map((loc) => (
            <View
              key={loc.id}
              style={{
                backgroundColor: theme.surface,
                borderRadius: radiusFor(theme.radius),
                padding: spacing.lg,
                borderWidth: 1,
                borderColor: theme.muted,
              }}
            >
              <Text style={[typography.h3, { color: theme.text }]}>{loc.name}</Text>
              <Text style={[typography.body, { color: theme.muted, marginTop: spacing.xs }]}>
                {loc.address}
              </Text>
              {!!loc.hours?.length && (
                <View style={{ marginTop: spacing.sm }}>
                  {loc.hours.map((h: { day: string; hours: string }) => (
                    <Text
                      key={h.day}
                      style={[typography.caption, { color: theme.muted }]}
                    >
                      {h.day}: {h.hours}
                    </Text>
                  ))}
                </View>
              )}
              <View style={{ flexDirection: "row", gap: spacing.sm, marginTop: spacing.md }}>
                {loc.mapsUrl ? (
                  <Pressable
                    onPress={() => Linking.openURL(loc.mapsUrl!).catch(() => {})}
                    style={pillButton(theme.accent)}
                  >
                    <Text style={{ color: "#fff", fontWeight: "600" }}>Directions</Text>
                  </Pressable>
                ) : null}
                {loc.phone ? (
                  <Pressable
                    onPress={() => Linking.openURL(`tel:${loc.phone}`).catch(() => {})}
                    style={pillButton("transparent", theme.text)}
                  >
                    <Text style={{ color: theme.text, fontWeight: "600" }}>Call</Text>
                  </Pressable>
                ) : null}
              </View>
            </View>
          ))}
        </View>
      )}
    </SafeFormScroll>
  );
}

function pillButton(bg: string, borderColor?: string) {
  return {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: bg,
    borderRadius: radiusFor(theme.radius),
    borderWidth: borderColor ? 1 : 0,
    borderColor: borderColor ?? "transparent",
  };
}
