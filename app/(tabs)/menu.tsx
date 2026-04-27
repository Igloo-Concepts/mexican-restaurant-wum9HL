import { View } from "react-native";
import { restaurantConfig } from "../../restaurant.config";
import { resolveMenu } from "../../components/menu/Menus";
import { layout, theme } from "../../theme";
import { GlobalHeader } from "../../components/GlobalHeader";

export default function MenuScreen() {
  const Menu = resolveMenu(layout.menu);

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <GlobalHeader />
      <Menu config={restaurantConfig} />
    </View>
  );
}
