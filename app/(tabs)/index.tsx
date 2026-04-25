import { ScrollView, View, TouchableOpacity, Text, Modal, StyleSheet } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { restaurantConfig } from "../../restaurant.config";
import { resolveHero } from "../../components/hero/Heroes";
import { layout, spacing, theme, typography } from "../../theme";

export default function HomeScreen() {
  const Hero = resolveHero(layout.hero);
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);
  const modules = restaurantConfig.modules ?? {};

  const menuItems = [
    { label: "Gallery", route: "/gallery", icon: "◳" },
    { label: "Events", route: "/events", icon: "★" },
    ...(modules.catering?.enabled ? [{ label: "Catering", route: "/catering", icon: "⊕" }] : []),
  ];

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      {/* Hamburger menu button - top right */}
      <TouchableOpacity
        onPress={() => setMenuVisible(true)}
        style={styles.hamburger}
        activeOpacity={0.7}
      >
        <Text style={[styles.hamburgerIcon, { color: theme.text }]}>≡</Text>
      </TouchableOpacity>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: spacing.xl }}
      >
        <Hero config={restaurantConfig} />
        <View style={{ height: spacing.md }} />
      </ScrollView>

      {/* Slide-in menu modal */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setMenuVisible(false)}
        >
          <View style={[styles.menuPanel, { backgroundColor: theme.surface }]}>
            <TouchableOpacity
              onPress={() => setMenuVisible(false)}
              style={styles.closeButton}
            >
              <Text style={[styles.closeIcon, { color: theme.text }]}>✕</Text>
            </TouchableOpacity>

            <Text style={[styles.menuTitle, typography.heading, { color: theme.primary }]}>
              MORE
            </Text>

            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.route}
                style={styles.menuItem}
                onPress={() => {
                  setMenuVisible(false);
                  router.push(item.route as any);
                }}
              >
                <Text style={[styles.menuIcon, { color: theme.accent }]}>{item.icon}</Text>
                <Text style={[styles.menuLabel, typography.body, { color: theme.text }]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  hamburger: {
    position: "absolute",
    top: 60,
    right: 20,
    zIndex: 100,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  hamburgerIcon: {
    fontSize: 28,
    fontWeight: "700",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "flex-start",
  },
  menuPanel: {
    width: 280,
    height: "100%",
    paddingTop: 80,
    paddingHorizontal: 24,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  closeButton: {
    position: "absolute",
    top: 60,
    right: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  closeIcon: {
    fontSize: 28,
    fontWeight: "300",
  },
  menuTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 32,
    letterSpacing: 2,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  menuIcon: {
    fontSize: 24,
    marginRight: 16,
    width: 32,
  },
  menuLabel: {
    fontSize: 18,
    fontWeight: "600",
  },
});
