import { View } from "react-native";
import { restaurantConfig } from "../../restaurant.config";
import { resolveLocation } from "../../components/location/Locations";
import { layout, theme } from "../../theme";
import { GlobalHeader } from "../../components/GlobalHeader";

export default function LocationScreen() {
  const Location = resolveLocation(layout.location);

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <GlobalHeader />
      <Location config={restaurantConfig} />
    </View>
  );
}
