import { View } from "react-native";
import { restaurantConfig } from "../../restaurant.config";
import { resolveEvents } from "../../components/events/Events";
import { layout, theme } from "../../theme";
import { GlobalHeader } from "../../components/GlobalHeader";

export default function EventsScreen() {
  const Events = resolveEvents(layout.events);

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <GlobalHeader />
      <Events config={restaurantConfig} />
    </View>
  );
}
