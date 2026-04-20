import { restaurantConfig } from "../../restaurant.config";
import { resolveGallery } from "../../components/gallery/Galleries";
import { layout } from "../../theme";

export default function GalleryScreen() {
  const Gallery = resolveGallery(layout.gallery);
  return <Gallery config={restaurantConfig} />;
}
