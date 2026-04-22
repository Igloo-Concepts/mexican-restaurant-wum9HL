import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { layout, radiusFor, spacing, theme } from "../../theme";

/**
 * Icon glyphs indexed by route name. We keep these as text glyphs so no icon
 * package is required; any variant can swap them for vector icons later.
 */
const GLYPHS: Record<string, string> = {
  index: "⌂",
  menu: "≡",
  reserve: "⊞",
  gallery: "◳",
  events: "★",
  location: "◉",
};

function labelFor(
  descriptors: BottomTabBarProps["descriptors"],
  route: BottomTabBarProps["state"]["routes"][number]
): string {
  const options = descriptors[route.key].options;
  if (typeof options.tabBarLabel === "string") return options.tabBarLabel;
  if (typeof options.title === "string") return options.title;
  return route.name;
}

/* -------------------------------------------------------------------------- */
/* Bottom tabs — classic iOS bar with icons + labels. The safe default.       */
/* -------------------------------------------------------------------------- */
export function BottomTabs(props: BottomTabBarProps) {
  return (
    <SafeAreaView edges={["bottom"]} style={{ backgroundColor: theme.surface }}>
      <View
        style={{
          flexDirection: "row",
          height: 64,
          paddingHorizontal: spacing.sm,
          backgroundColor: theme.surface,
          borderTopWidth: 1,
          borderTopColor: theme.muted + "22",
        }}
      >
        {props.state.routes.map((route, i) => {
          const focused = props.state.index === i;
          const color = focused ? theme.accent : theme.muted;
          return (
            <Pressable
              key={route.key}
              onPress={() => props.navigation.navigate(route.name as never)}
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
              }}
            >
              <Text style={{ fontSize: 20, color }}>{GLYPHS[route.name] ?? "•"}</Text>
              <Text
                style={{ fontSize: 11, color, fontWeight: focused ? "700" : "500" }}
                numberOfLines={1}
              >
                {labelFor(props.descriptors, route)}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

/* -------------------------------------------------------------------------- */
/* Pill tabs — floating rounded capsule hovering above the content.           */
/* -------------------------------------------------------------------------- */
export function PillTabs(props: BottomTabBarProps) {
  return (
    <SafeAreaView edges={["bottom"]} style={{ backgroundColor: "transparent" }}>
      <View
        style={{
          marginHorizontal: spacing.lg,
          marginBottom: spacing.sm,
          backgroundColor: theme.text,
          borderRadius: 999,
          padding: spacing.xs,
          flexDirection: "row",
          shadowColor: "#000",
          shadowOpacity: 0.15,
          shadowRadius: 16,
          shadowOffset: { width: 0, height: 8 },
          elevation: 6,
        }}
      >
        {props.state.routes.map((route, i) => {
          const focused = props.state.index === i;
          return (
            <Pressable
              key={route.key}
              onPress={() => props.navigation.navigate(route.name as never)}
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                paddingVertical: 10,
                borderRadius: 999,
                backgroundColor: focused ? theme.accent : "transparent",
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  color: focused ? "#fff" : theme.background,
                }}
              >
                {GLYPHS[route.name] ?? "•"}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

/* -------------------------------------------------------------------------- */
/* Icon-only tabs — flat bar, no labels, oversized icons.                     */
/* -------------------------------------------------------------------------- */
export function IconOnlyTabs(props: BottomTabBarProps) {
  return (
    <SafeAreaView edges={["bottom"]} style={{ backgroundColor: theme.background }}>
      <View
        style={{
          flexDirection: "row",
          height: 72,
          paddingHorizontal: spacing.md,
          backgroundColor: theme.background,
        }}
      >
        {props.state.routes.map((route, i) => {
          const focused = props.state.index === i;
          return (
            <Pressable
              key={route.key}
              onPress={() => props.navigation.navigate(route.name as never)}
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: radiusFor(12),
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: focused ? theme.accent + "22" : "transparent",
                }}
              >
                <Text
                  style={{
                    fontSize: 22,
                    color: focused ? theme.accent : theme.muted,
                  }}
                >
                  {GLYPHS[route.name] ?? "•"}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

/* -------------------------------------------------------------------------- */
/* Minimal top tabs — text-only tabs at the top, scroll underneath.            */
/* -------------------------------------------------------------------------- */
export function MinimalTopTabs(props: BottomTabBarProps) {
  return (
    <SafeAreaView edges={["top"]} style={{ backgroundColor: theme.background }}>
      <View
        style={{
          flexDirection: "row",
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm,
          gap: spacing.md,
          backgroundColor: theme.background,
          borderBottomWidth: 1,
          borderBottomColor: theme.muted + "22",
        }}
      >
        {props.state.routes.map((route, i) => {
          const focused = props.state.index === i;
          return (
            <Pressable
              key={route.key}
              onPress={() => props.navigation.navigate(route.name as never)}
              style={{ paddingVertical: 8 }}
            >
              <Text
                style={{
                  color: focused ? theme.text : theme.muted,
                  fontWeight: focused ? "700" : "500",
                  fontSize: 14,
                  letterSpacing: 0.4,
                  textTransform: "uppercase",
                  borderBottomWidth: focused ? 2 : 0,
                  borderBottomColor: theme.accent,
                  paddingBottom: 4,
                }}
              >
                {labelFor(props.descriptors, route)}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

/* -------------------------------------------------------------------------- */
/* Floating dock — centered pill with elevated primary action.                */
/* -------------------------------------------------------------------------- */
export function FloatingDock(props: BottomTabBarProps) {
  return (
    <SafeAreaView edges={["bottom"]} style={{ backgroundColor: "transparent" }}>
      <View
        style={{
          alignSelf: "center",
          flexDirection: "row",
          backgroundColor: theme.surface,
          borderRadius: 999,
          paddingHorizontal: spacing.sm,
          paddingVertical: spacing.sm,
          marginBottom: spacing.md,
          gap: spacing.sm,
          shadowColor: "#000",
          shadowOpacity: 0.18,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: 10 },
          elevation: 8,
        }}
      >
        {props.state.routes.map((route, i) => {
          const focused = props.state.index === i;
          return (
            <Pressable
              key={route.key}
              onPress={() => props.navigation.navigate(route.name as never)}
              style={{
                width: 48,
                height: 48,
                borderRadius: 999,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: focused ? theme.accent : theme.background,
              }}
            >
              <Text style={{ fontSize: 18, color: focused ? "#fff" : theme.text }}>
                {GLYPHS[route.name] ?? "•"}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

/* -------------------------------------------------------------------------- */

export function resolveTabBar(variant: string) {
  switch (variant) {
    case "pillTabs":
      return PillTabs;
    case "iconOnlyTabs":
      return IconOnlyTabs;
    case "minimalTopTabs":
      return MinimalTopTabs;
    case "floatingDock":
      return FloatingDock;
    case "bottomTabs":
    default:
      return BottomTabs;
  }
}

/** Top-rendered navs need `tabBarPosition: 'top'` on `<Tabs>`. */
export function isTopBar(variant: string): boolean {
  return variant === "minimalTopTabs";
}
