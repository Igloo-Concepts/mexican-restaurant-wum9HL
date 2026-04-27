import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { restaurantConfig } from "../../restaurant.config";
import { layout, radiusFor, spacing, theme } from "../../theme";

/**
 * Icon glyphs indexed by route name. We keep these as text glyphs so no icon
 * package is required; any variant can swap them for vector icons later.
 */
const GLYPHS: Record<string, string> = {
  index: "⌂",
  menu: "≡",
  gallery: "◳",
  events: "★",
  location: "◉",
  reserve: "◷",
  catering: "◈",
  account: "●",
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

/**
 * Expo Router uses `options.href: null` to hide a screen from the tab bar.
 * Those routes stay in `state.routes`; custom `tabBar` renderers must filter
 * them (expo/router#546). We also respect `restaurantConfig.layout.tabBarHiddenRoutes`
 * so the bar matches config even if `(tabs)/_layout.tsx` is stale or missing
 * per-screen `href` (common when only `restaurant.config.ts` was updated).
 */
function visibleTabBarRoutes(
  state: BottomTabBarProps["state"],
  descriptors: BottomTabBarProps["descriptors"]
) {
  type R = (typeof state.routes)[number];
  const notHiddenByHref = state.routes.filter(
    (route: R) => descriptors[route.key]?.options?.href !== null
  );
  const hiddenByConfig = new Set(restaurantConfig.layout?.tabBarHiddenRoutes ?? []);
  if (hiddenByConfig.size === 0) return notHiddenByHref;
  return notHiddenByHref.filter(
    (route: R) => !hiddenByConfig.has(String(route.name))
  );
}

function isTabRouteFocused(
  state: BottomTabBarProps["state"],
  route: BottomTabBarProps["state"]["routes"][number]
) {
  return state.routes[state.index]?.key === route.key;
}

/* -------------------------------------------------------------------------- */
/* Bottom tabs — classic iOS bar with icons + labels. The safe default.       */
/* -------------------------------------------------------------------------- */
export function BottomTabs(props: BottomTabBarProps) {
  const tabRoutes = visibleTabBarRoutes(props.state, props.descriptors);
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
        {tabRoutes.map((route) => {
          const focused = isTabRouteFocused(props.state, route);
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
  const tabRoutes = visibleTabBarRoutes(props.state, props.descriptors);
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
        {tabRoutes.map((route) => {
          const focused = isTabRouteFocused(props.state, route);
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
  const tabRoutes = visibleTabBarRoutes(props.state, props.descriptors);
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
        {tabRoutes.map((route) => {
          const focused = isTabRouteFocused(props.state, route);
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
  const tabRoutes = visibleTabBarRoutes(props.state, props.descriptors);
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
        {tabRoutes.map((route) => {
          const focused = isTabRouteFocused(props.state, route);
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
  const tabRoutes = visibleTabBarRoutes(props.state, props.descriptors);
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
        {tabRoutes.map((route) => {
          const focused = isTabRouteFocused(props.state, route);
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
/* Center raised — classic bottom bar with the middle tab elevated as a       */
/* prominent circular "feature" action. Great for restaurants that want       */
/* one tab (reservations, events, specials) to dominate visually.             */
/* -------------------------------------------------------------------------- */
export function CenterRaisedTabs(props: BottomTabBarProps) {
  const tabRoutes = visibleTabBarRoutes(props.state, props.descriptors);
  const middleIndex = Math.floor(tabRoutes.length / 2);
  return (
    <SafeAreaView edges={["bottom"]} style={{ backgroundColor: theme.surface }}>
      <View
        style={{
          flexDirection: "row",
          height: 70,
          paddingHorizontal: spacing.sm,
          backgroundColor: theme.surface,
          borderTopWidth: 1,
          borderTopColor: theme.muted + "22",
          alignItems: "center",
        }}
      >
        {tabRoutes.map((route, i) => {
          const focused = isTabRouteFocused(props.state, route);
          const isCenter = i === middleIndex;
          if (isCenter) {
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
                    width: 58,
                    height: 58,
                    borderRadius: 999,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: theme.accent,
                    marginTop: -28,
                    shadowColor: theme.accent,
                    shadowOpacity: 0.35,
                    shadowRadius: 14,
                    shadowOffset: { width: 0, height: 6 },
                    elevation: 8,
                  }}
                >
                  <Text style={{ fontSize: 24, color: "#fff" }}>
                    {GLYPHS[route.name] ?? "•"}
                  </Text>
                </View>
              </Pressable>
            );
          }
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
                style={{ fontSize: 10, color, fontWeight: focused ? "700" : "500" }}
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
/* Segmented — iOS-style segmented control at the top. All tabs share a       */
/* single enclosed capsule; the active segment gets a filled background.      */
/* -------------------------------------------------------------------------- */
export function SegmentedTabs(props: BottomTabBarProps) {
  const tabRoutes = visibleTabBarRoutes(props.state, props.descriptors);
  return (
    <SafeAreaView edges={["top"]} style={{ backgroundColor: theme.background }}>
      <View
        style={{
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm,
          backgroundColor: theme.background,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            backgroundColor: theme.muted + "18",
            borderRadius: radiusFor(12),
            padding: 4,
          }}
        >
          {tabRoutes.map((route) => {
            const focused = isTabRouteFocused(props.state, route);
            return (
              <Pressable
                key={route.key}
                onPress={() => props.navigation.navigate(route.name as never)}
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  paddingVertical: 8,
                  borderRadius: radiusFor(10),
                  backgroundColor: focused ? theme.surface : "transparent",
                  shadowColor: "#000",
                  shadowOpacity: focused ? 0.08 : 0,
                  shadowRadius: 4,
                  shadowOffset: { width: 0, height: 1 },
                  elevation: focused ? 2 : 0,
                }}
              >
                <Text
                  style={{
                    fontSize: 13,
                    color: focused ? theme.text : theme.muted,
                    fontWeight: focused ? "700" : "500",
                  }}
                  numberOfLines={1}
                >
                  {labelFor(props.descriptors, route)}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
}

/* -------------------------------------------------------------------------- */
/* Underline top — horizontally scrollable top tabs with a colored underline. */
/* Magazine/editorial feel, comfortable when you have 5+ tabs.                */
/* -------------------------------------------------------------------------- */
export function UnderlineTopTabs(props: BottomTabBarProps) {
  return (
    <SafeAreaView edges={["top"]} style={{ backgroundColor: theme.background }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: spacing.md,
          gap: spacing.lg,
          backgroundColor: theme.background,
        }}
        style={{
          backgroundColor: theme.background,
          borderBottomWidth: 1,
          borderBottomColor: theme.muted + "22",
        }}
      >
        {visibleTabBarRoutes(props.state, props.descriptors).map((route) => {
          const focused = isTabRouteFocused(props.state, route);
          return (
            <Pressable
              key={route.key}
              onPress={() => props.navigation.navigate(route.name as never)}
              style={{
                paddingVertical: 14,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: focused ? theme.accent : theme.muted,
                  fontWeight: focused ? "700" : "500",
                  fontSize: 15,
                }}
              >
                {labelFor(props.descriptors, route)}
              </Text>
              <View
                style={{
                  marginTop: 6,
                  height: 3,
                  width: focused ? "100%" : 0,
                  minWidth: focused ? 24 : 0,
                  borderRadius: 2,
                  backgroundColor: theme.accent,
                }}
              />
            </Pressable>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

/* -------------------------------------------------------------------------- */
/* Indicator bar — bottom bar where the active tab is marked by a thick       */
/* accent line on the top edge (web-app pattern). Bold, structured, distinct. */
/* -------------------------------------------------------------------------- */
export function IndicatorBarTabs(props: BottomTabBarProps) {
  const tabRoutes = visibleTabBarRoutes(props.state, props.descriptors);
  return (
    <SafeAreaView edges={["bottom"]} style={{ backgroundColor: theme.surface }}>
      <View
        style={{
          flexDirection: "row",
          height: 70,
          backgroundColor: theme.surface,
          borderTopWidth: 1,
          borderTopColor: theme.muted + "22",
        }}
      >
        {tabRoutes.map((route) => {
          const focused = isTabRouteFocused(props.state, route);
          const color = focused ? theme.text : theme.muted;
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
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 3,
                  backgroundColor: focused ? theme.accent : "transparent",
                }}
              />
              <Text style={{ fontSize: 20, color, marginTop: 4 }}>
                {GLYPHS[route.name] ?? "•"}
              </Text>
              <Text
                style={{
                  fontSize: 11,
                  color,
                  fontWeight: focused ? "700" : "500",
                  marginTop: 2,
                }}
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
/* Curved bottom — tall bottom bar with big top corner radius that makes the  */
/* nav feel like a card lifted over the content. Active tab gets an accent    */
/* tinted rounded square behind its icon. Warm/boutique feel.                 */
/* -------------------------------------------------------------------------- */
export function CurvedBottomTabs(props: BottomTabBarProps) {
  const tabRoutes = visibleTabBarRoutes(props.state, props.descriptors);
  return (
    <SafeAreaView edges={["bottom"]} style={{ backgroundColor: theme.background }}>
      <View
        style={{
          flexDirection: "row",
          height: 78,
          paddingHorizontal: spacing.sm,
          backgroundColor: theme.surface,
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          shadowColor: "#000",
          shadowOpacity: 0.08,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: -4 },
          elevation: 6,
          alignItems: "center",
        }}
      >
        {tabRoutes.map((route) => {
          const focused = isTabRouteFocused(props.state, route);
          return (
            <Pressable
              key={route.key}
              onPress={() => props.navigation.navigate(route.name as never)}
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                gap: 4,
              }}
            >
              <View
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: radiusFor(14),
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: focused ? theme.accent + "22" : "transparent",
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    color: focused ? theme.accent : theme.muted,
                  }}
                >
                  {GLYPHS[route.name] ?? "•"}
                </Text>
              </View>
              <Text
                style={{
                  fontSize: 10,
                  color: focused ? theme.accent : theme.muted,
                  fontWeight: focused ? "700" : "500",
                  letterSpacing: 0.3,
                }}
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
/* Labeled dock — a floating capsule that combines icons AND labels. Stays    */
/* detached from the edges like FloatingDock, but legible at a glance.        */
/* -------------------------------------------------------------------------- */
export function LabeledDockTabs(props: BottomTabBarProps) {
  const tabRoutes = visibleTabBarRoutes(props.state, props.descriptors);
  return (
    <SafeAreaView edges={["bottom"]} style={{ backgroundColor: "transparent" }}>
      <View
        style={{
          alignSelf: "center",
          flexDirection: "row",
          backgroundColor: theme.surface,
          borderRadius: 999,
          paddingHorizontal: spacing.xs,
          paddingVertical: spacing.xs,
          marginBottom: spacing.md,
          marginHorizontal: spacing.md,
          shadowColor: "#000",
          shadowOpacity: 0.18,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: 10 },
          elevation: 8,
        }}
      >
        {tabRoutes.map((route) => {
          const focused = isTabRouteFocused(props.state, route);
          return (
            <Pressable
              key={route.key}
              onPress={() => props.navigation.navigate(route.name as never)}
              style={{
                paddingHorizontal: focused ? spacing.md : spacing.sm,
                paddingVertical: 8,
                borderRadius: 999,
                backgroundColor: focused ? theme.accent : "transparent",
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: focused ? "#fff" : theme.text,
                }}
              >
                {GLYPHS[route.name] ?? "•"}
              </Text>
              {focused ? (
                <Text
                  style={{
                    fontSize: 13,
                    color: "#fff",
                    fontWeight: "700",
                  }}
                  numberOfLines={1}
                >
                  {labelFor(props.descriptors, route)}
                </Text>
              ) : null}
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
    case "centerRaised":
      return CenterRaisedTabs;
    case "segmented":
      return SegmentedTabs;
    case "underlineTop":
      return UnderlineTopTabs;
    case "indicatorBar":
      return IndicatorBarTabs;
    case "curvedBottom":
      return CurvedBottomTabs;
    case "labeledDock":
      return LabeledDockTabs;
    case "bottomTabs":
    default:
      return BottomTabs;
  }
}

/** Top-rendered navs need `tabBarPosition: 'top'` on `<Tabs>`. */
export function isTopBar(variant: string): boolean {
  return (
    variant === "minimalTopTabs" ||
    variant === "segmented" ||
    variant === "underlineTop"
  );
}
