import { restaurantConfig } from "../../restaurant.config";
import { resolveMenu } from "../../components/menu/Menus";
import { layout } from "../../theme";

export default function MenuScreen() {
  const Menu = resolveMenu(layout.menu);
  return <Menu config={restaurantConfig} />;
}
