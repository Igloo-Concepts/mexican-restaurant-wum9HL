import { Tabs } from "expo-router";
import { isTopBar, resolveTabBar } from "../../components/nav/TabBars";
import { restaurantConfig } from "../../restaurant.config";
import { layout, theme } from "../../theme";

/**
 * Streamlined navigation: core tabs in the bottom pill (Home, Menu, Reserve, Visit),
 * secondary items (Gallery, Events, Catering) accessible via hamburger menu on home screen.
 */
export default function TabsLayout() {
  const TabBar = resolveTabBar(layout.nav);
  const tabBarPosition = isTopBar(layout.nav) ? "top" : "bottom";
  const modules = restaurantConfig.modules ?? {};

  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      tabBarPosition={tabBarPosition as any}
      screenOptions={{
        headerStyle: { backgroundColor: theme.background },
        headerTitleStyle: { fontWeight: "700", color: theme.text },
        headerShadowVisible: false,
      }}
    >
      {/* Core tabs - always visible in bottom pill */}
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="menu" options={{ title: "Menu" }} />
      <Tabs.Screen
        name="reserve"
        options={{
          title: "Reserve",
          href: modules.reservations?.enabled ? undefined : null,
        }}
      />
      <Tabs.Screen name="location" options={{ title: "Visit" }} />

      {/* Secondary screens - hidden from tab bar, accessible via hamburger menu */}
      <Tabs.Screen
        name="gallery"
        options={{ title: "Gallery", href: null }}
      />
      <Tabs.Screen
        name="events"
        options={{ title: "Events", href: null }}
      />
      <Tabs.Screen
        name="catering"
        options={{
          title: "Catering",
          href: null, // Always hidden from tabs, accessible via menu
        }}
      />

      {/* Other module-gated tabs */}
      <Tabs.Screen
        name="careers"
        options={{
          title: "Careers",
          href: modules.jobs?.enabled ? undefined : null,
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: "Account",
          href: modules.customerAccounts?.enabled ? undefined : null,
        }}
      />
      <Tabs.Screen
        name="photos"
        options={{
          title: "Photos",
          href: modules.photoWall?.enabled ? undefined : null,
        }}
      />
      <Tabs.Screen
        name="locations"
        options={{
          title: "Locations",
          href: modules.multiLocation?.enabled ? undefined : null,
        }}
      />
    </Tabs>
  );
}
