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
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="menu" options={{ title: "Menu" }} />
      <Tabs.Screen name="gallery" options={{ title: "Gallery" }} />
      <Tabs.Screen name="events" options={{ title: "Events" }} />
      <Tabs.Screen name="location" options={{ title: "Visit" }} />
      {/*
        Module-gated tabs. When a module is disabled we still ship a
        <Tabs.Screen> entry that hides the route from the tab bar so Expo
        Router doesn't auto-create a leaky default entry for the same file.
      */}
      <Tabs.Screen
        name="reserve"
        options={{
          title: "Reserve",
          href: modules.reservations?.enabled ? undefined : null,
        }}
      />
      <Tabs.Screen
        name="catering"
        options={{
          title: "Catering",
          href: modules.catering?.enabled ? undefined : null,
        }}
      />
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
