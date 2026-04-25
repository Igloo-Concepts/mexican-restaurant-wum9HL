import { Tabs } from "expo-router";
import { isTopBar, resolveTabBar } from "../../components/nav/TabBars";
import { restaurantConfig } from "../../restaurant.config";
import { layout, theme } from "../../theme";

/**
 * Base-five tabs ship with every app. Additional tabs are registered only
 * when the matching backend module is enabled in `restaurant.config.ts`.
 * Expo Router discovers any file under `app/(tabs)/`, so screens for
 * disabled modules stay on disk but never get a `<Tabs.Screen>` entry —
 * which means the tab bar doesn't show them and the route is unreachable.
 */
export default function TabsLayout() {
  const TabBar = resolveTabBar(layout.nav);
  const tabBarPosition = isTopBar(layout.nav) ? "top" : "bottom";
  const modules = restaurantConfig.modules ?? {};
  const tabBarHidden = new Set(layout.tabBarHiddenRoutes);

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
      <Tabs.Screen
        name="index"
        options={{ title: "Home", href: tabBarHidden.has("index") ? null : undefined }}
      />
      <Tabs.Screen
        name="menu"
        options={{ title: "Menu", href: tabBarHidden.has("menu") ? null : undefined }}
      />
      <Tabs.Screen
        name="gallery"
        options={{ title: "Gallery", href: tabBarHidden.has("gallery") ? null : undefined }}
      />
      <Tabs.Screen
        name="events"
        options={{ title: "Events", href: tabBarHidden.has("events") ? null : undefined }}
      />
      <Tabs.Screen
        name="location"
        options={{ title: "Visit", href: tabBarHidden.has("location") ? null : undefined }}
      />
      {/*
        Module-gated tabs. When a module is disabled we still ship a
        <Tabs.Screen> entry that hides the route from the tab bar so Expo
        Router doesn't auto-create a leaky default entry for the same file.
        `tabBarHiddenRoutes` can also hide a module tab even when enabled.
      */}
      <Tabs.Screen
        name="reserve"
        options={{
          title: "Reserve",
          href:
            !modules.reservations?.enabled || tabBarHidden.has("reserve")
              ? null
              : undefined,
        }}
      />
      <Tabs.Screen
        name="catering"
        options={{
          title: "Catering",
          href:
            !modules.catering?.enabled || tabBarHidden.has("catering")
              ? null
              : undefined,
        }}
      />
      <Tabs.Screen
        name="careers"
        options={{
          title: "Careers",
          href: !modules.jobs?.enabled || tabBarHidden.has("careers") ? null : undefined,
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: "Account",
          href:
            !modules.customerAccounts?.enabled || tabBarHidden.has("account")
              ? null
              : undefined,
        }}
      />
      <Tabs.Screen
        name="photos"
        options={{
          title: "Photos",
          href:
            !modules.photoWall?.enabled || tabBarHidden.has("photos")
              ? null
              : undefined,
        }}
      />
      <Tabs.Screen
        name="locations"
        options={{
          title: "Locations",
          href:
            !modules.multiLocation?.enabled || tabBarHidden.has("locations")
              ? null
              : undefined,
        }}
      />
    </Tabs>
  );
}
