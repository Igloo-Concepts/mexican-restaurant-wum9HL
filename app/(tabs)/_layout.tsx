import { Tabs } from "expo-router";
import { isTopBar, resolveTabBar } from "../../components/nav/TabBars";
import { layout, theme } from "../../theme";
import { restaurantConfig } from "../../restaurant.config";

export default function TabsLayout() {
  const TabBar = resolveTabBar(layout.nav);
  const tabBarPosition = isTopBar(layout.nav) ? "top" : "bottom";
  
  const reservationsEnabled = restaurantConfig.modules?.reservations?.enabled;
  
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
      {reservationsEnabled && (
        <Tabs.Screen name="reserve" options={{ title: "Reserve" }} />
      )}
      <Tabs.Screen name="gallery" options={{ title: "Gallery" }} />
      <Tabs.Screen name="events" options={{ title: "Events" }} />
      <Tabs.Screen name="location" options={{ title: "Visit" }} />
    </Tabs>
  );
}
