import { View } from "react-native";
import { restaurantConfig } from "../../restaurant.config";
import { resolveGallery } from "../../components/gallery/Galleries";
import { layout, theme } from "../../theme";
import { GlobalHeader } from "../../components/GlobalHeader";

export default function GalleryScreen() {
  const Gallery = resolveGallery(layout.gallery);

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <GlobalHeader />
      <Gallery config={restaurantConfig} />
    </View>
  );
}
