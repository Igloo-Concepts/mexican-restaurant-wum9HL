import type { PropsWithChildren } from "react";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { spacing, theme } from "../../theme";

const MAX_FORM_WIDTH = 520;

/**
 * Shared screen wrapper for module forms/lists.
 * Keeps content away from notches/home-indicators and constrains very wide
 * layouts so AI-generated sections stay readable.
 */
export function SafeFormScroll({ children }: PropsWithChildren) {
  const insets = useSafeAreaInsets();
  const horizontalInset = Math.max(insets.left, insets.right);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.background }}
      contentContainerStyle={{
        paddingTop: spacing.lg,
        paddingBottom: spacing.xxl + Math.max(insets.bottom, spacing.sm),
        paddingHorizontal: Math.max(spacing.lg, spacing.md + horizontalInset),
      }}
    >
      <View style={{ width: "100%", maxWidth: MAX_FORM_WIDTH, alignSelf: "center" }}>
        {children}
      </View>
    </ScrollView>
  );
}
