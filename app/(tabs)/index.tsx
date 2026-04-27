import { ScrollView, View } from "react-native";
import { restaurantConfig } from "../../restaurant.config";
import { resolveHero } from "../../components/hero/Heroes";
import { layout, spacing, theme } from "../../theme";
import { GlobalHeader } from "../../components/GlobalHeader";

export default function HomeScreen() {
  const Hero = resolveHero(layout.hero);

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <GlobalHeader />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: spacing.xl }}
      >
        <Hero config={restaurantConfig} />
        <View style={{ height: spacing.md }} />
      </ScrollView>
    </View>
  );
}
