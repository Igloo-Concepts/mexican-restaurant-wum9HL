import { ScrollView, View } from "react-native";
import { restaurantConfig } from "../../restaurant.config";
import { resolveHero } from "../../components/hero/Heroes";
import { layout, spacing, theme } from "../../theme";

export default function HomeScreen() {
  const Hero = resolveHero(layout.hero);
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.background }}
      contentContainerStyle={{ paddingBottom: spacing.xl }}
    >
      <Hero config={restaurantConfig} />
      {/* Additional home sections (about block, featured menu, etc.) can be added
          here or extracted into their own variants later. */}
      <View style={{ height: spacing.md }} />
    </ScrollView>
  );
}
