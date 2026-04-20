import { restaurantConfig } from "../../restaurant.config";
import { resolveEvents } from "../../components/events/Events";
import { layout } from "../../theme";

export default function EventsScreen() {
  const Events = resolveEvents(layout.events);
  return <Events config={restaurantConfig} />;
}
