import { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { restaurantConfig } from "../restaurant.config";
import { spacing, theme, typography } from "../theme";

/**
 * Global header with hamburger menu that appears on all screens.
 * Positioned at the top-left with the brand name.
 */
export function GlobalHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const modules = restaurantConfig.modules ?? {};

  const menuItems = [
    { label: "Home", route: "/" },
    { label: "Menu", route: "/menu" },
    { label: "Gallery", route: "/gallery" },
    { label: "Events", route: "/events" },
    { label: "Visit", route: "/location" },
  ];

  if (modules.reservations?.enabled) {
    menuItems.push({ label: "Reserve", route: "/reserve" });
  }
  if (modules.catering?.enabled) {
    menuItems.push({ label: "Catering", route: "/catering" });
  }

  const contactItems = [
    { label: "Call", action: () => Linking.openURL(`tel:${restaurantConfig.contact.phone}`) },
    { label: "Email", action: () => Linking.openURL(`mailto:${restaurantConfig.contact.email}`) },
    { label: "Directions", action: () => Linking.openURL(restaurantConfig.contact.mapsUrl) },
  ];

  if (restaurantConfig.contact.social?.instagram) {
    contactItems.push({
      label: "Instagram",
      action: () => Linking.openURL(`https://instagram.com/${restaurantConfig.contact.social!.instagram!.replace("@", "")}`),
    });
  }

  return (
    <>
      {/* Header bar */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm,
          backgroundColor: theme.background,
          borderBottomWidth: 1,
          borderBottomColor: theme.muted + "22",
        }}
      >
        {/* Hamburger button */}
        <Pressable
          onPress={() => setMenuOpen(true)}
          hitSlop={8}
          style={{
            width: 40,
            height: 40,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View style={{ gap: 5 }}>
            <View style={{ width: 24, height: 2, backgroundColor: theme.text }} />
            <View style={{ width: 24, height: 2, backgroundColor: theme.text }} />
            <View style={{ width: 24, height: 2, backgroundColor: theme.text }} />
          </View>
        </Pressable>

        {/* Brand name */}
        <Text
          style={{
            ...typography.heading,
            fontSize: 18,
            color: theme.text,
            fontWeight: "700",
            letterSpacing: 1,
          }}
        >
          {restaurantConfig.name.toUpperCase()}
        </Text>

        {/* Spacer to balance layout */}
        <View style={{ width: 40 }} />
      </View>

      {/* Full-screen menu modal */}
      <Modal
        visible={menuOpen}
        animationType="slide"
        onRequestClose={() => setMenuOpen(false)}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={["top", "bottom"]}>
          {/* Close button */}
          <Pressable
            onPress={() => setMenuOpen(false)}
            hitSlop={8}
            style={{
              position: "absolute",
              top: 16,
              right: 16,
              width: 40,
              height: 40,
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10,
            }}
          >
            <Text style={{ fontSize: 32, color: theme.text, fontWeight: "300" }}>
              ✕
            </Text>
          </Pressable>

          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{
              paddingTop: 120,
              paddingHorizontal: spacing.lg,
              paddingBottom: spacing.xl,
            }}
          >
            {/* Menu title */}
            <Text
              style={{
                ...typography.heading,
                fontSize: 14,
                color: theme.muted,
                fontWeight: "700",
                letterSpacing: 2,
                marginBottom: spacing.lg,
              }}
            >
              MORE
            </Text>

            {/* Navigation items */}
            {menuItems.map((item) => (
              <Pressable
                key={item.route}
                onPress={() => {
                  setMenuOpen(false);
                  router.push(item.route as any);
                }}
                style={{
                  paddingVertical: spacing.md,
                  borderBottomWidth: 1,
                  borderBottomColor: theme.muted + "22",
                }}
              >
                <Text
                  style={{
                    ...typography.heading,
                    fontSize: 28,
                    color: theme.text,
                    fontWeight: "700",
                  }}
                >
                  {item.label}
                </Text>
              </Pressable>
            ))}

            {/* Contact section */}
            <Text
              style={{
                ...typography.heading,
                fontSize: 14,
                color: theme.muted,
                fontWeight: "700",
                letterSpacing: 2,
                marginTop: spacing.xl,
                marginBottom: spacing.md,
              }}
            >
              CONTACT
            </Text>

            {contactItems.map((item) => (
              <Pressable
                key={item.label}
                onPress={() => {
                  setMenuOpen(false);
                  item.action();
                }}
                style={{
                  paddingVertical: spacing.sm,
                }}
              >
                <Text
                  style={{
                    ...typography.body,
                    fontSize: 16,
                    color: theme.accent,
                    fontWeight: "600",
                  }}
                >
                  {item.label}
                </Text>
              </Pressable>
            ))}

            {/* Footer info */}
            <View style={{ marginTop: spacing.xl }}>
              <Text style={{ ...typography.caption, color: theme.muted }}>
                {restaurantConfig.contact.address}
              </Text>
              <Text style={{ ...typography.caption, color: theme.muted, marginTop: spacing.xs }}>
                {restaurantConfig.contact.phone}
              </Text>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </>
  );
}
