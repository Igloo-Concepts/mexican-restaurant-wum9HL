import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import { View } from "react-native";
import { getFontAssetsForPreset } from "../lib/fonts";
import { layout, theme } from "../theme";

export default function RootLayout() {
  const [loaded] = useFonts(getFontAssetsForPreset(layout.typography));

  // While the active typography preset's font files are loading we paint a
  // solid background (not a spinner) so the first paint already matches the
  // project's palette. Fonts typically resolve within a few hundred ms on
  // Snack web; native Expo Go caches them after the first boot.
  if (!loaded) {
    return <View style={{ flex: 1, backgroundColor: theme.background }} />;
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: theme.background },
          headerTintColor: theme.text,
          headerTitleStyle: { fontWeight: "700" },
          contentStyle: { backgroundColor: theme.background },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </SafeAreaProvider>
  );
}
