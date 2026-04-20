import { restaurantConfig } from "../../restaurant.config";
import { resolveLocation } from "../../components/location/Locations";
import { layout } from "../../theme";

export default function LocationScreen() {
  const Location = resolveLocation(layout.location);
  return <Location config={restaurantConfig} />;
}
