import { Pressable, Text, ViewStyle } from "react-native";
import { layout, radiusFor, spacing, theme } from "../theme";

/**
 * One opinionated CTA that inherits the project's corner style (sharp, rounded,
 * pill) so primary actions match the app's overall silhouette.
 */
export function ActionButton({
  label,
  onPress,
  variant = "primary",
  style,
}: {
  label: string;
  onPress?: () => void;
  variant?: "primary" | "outline" | "ghost";
  style?: ViewStyle;
}) {
  const pill = layout.cornerStyle === "pill";
  const base: ViewStyle = {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: pill ? 999 : radiusFor(theme.radius),
  };
  if (variant === "primary") {
    return (
      <Pressable
        onPress={onPress}
        style={[base, { backgroundColor: theme.accent }, style]}
      >
        <Text style={{ color: "#fff", fontWeight: "700", fontSize: 15, letterSpacing: 0.3 }}>
          {label}
        </Text>
      </Pressable>
    );
  }
  if (variant === "outline") {
    return (
      <Pressable
        onPress={onPress}
        style={[
          base,
          { borderWidth: 1, borderColor: theme.text, backgroundColor: "transparent" },
          style,
        ]}
      >
        <Text style={{ color: theme.text, fontWeight: "600", fontSize: 15 }}>{label}</Text>
      </Pressable>
    );
  }
  return (
    <Pressable onPress={onPress} style={[base, { backgroundColor: "transparent" }, style]}>
      <Text style={{ color: theme.accent, fontWeight: "600", fontSize: 15 }}>{label} →</Text>
    </Pressable>
  );
}
