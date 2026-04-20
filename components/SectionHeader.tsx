import { Text, View } from "react-native";
import { layout, spacing, theme, typography } from "../theme";

/**
 * A section header with an optional eyebrow + decorative rule. The rule style
 * (underline, divider, dotted, serif, ornament, none) is driven by
 * `layout.decor` so two apps never finish their headings the same way.
 */
export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
}) {
  const alignment = align === "center" ? "center" : "flex-start";
  return (
    <View style={{ alignItems: alignment, gap: spacing.xs }}>
      {eyebrow ? (
        <Text style={[typography.eyebrow, { color: theme.accent }]}>{eyebrow}</Text>
      ) : null}
      <Text style={[typography.h2, { color: theme.text, textAlign: align }]}>{title}</Text>
      {subtitle ? (
        <Text style={[typography.body, { color: theme.muted, textAlign: align }]}>
          {subtitle}
        </Text>
      ) : null}
      <DecorRule align={align} />
    </View>
  );
}

export function DecorRule({ align = "left" }: { align?: "left" | "center" }) {
  const d = layout.decor;
  if (d === "none") return null;
  if (d === "underline") {
    return (
      <View
        style={{
          height: 3,
          width: 40,
          backgroundColor: theme.accent,
          marginTop: spacing.xs,
          alignSelf: align === "center" ? "center" : "flex-start",
        }}
      />
    );
  }
  if (d === "dividers") {
    return (
      <View
        style={{
          height: 1,
          alignSelf: "stretch",
          backgroundColor: theme.muted,
          opacity: 0.2,
          marginTop: spacing.sm,
        }}
      />
    );
  }
  if (d === "dottedRule") {
    return (
      <View
        style={{
          flexDirection: "row",
          gap: 4,
          marginTop: spacing.sm,
          justifyContent: align === "center" ? "center" : "flex-start",
        }}
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <View
            key={i}
            style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: theme.accent }}
          />
        ))}
      </View>
    );
  }
  if (d === "serifRule") {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: spacing.sm,
          marginTop: spacing.sm,
          alignSelf: align === "center" ? "center" : "flex-start",
        }}
      >
        <View style={{ width: 24, height: 1, backgroundColor: theme.accent }} />
        <Text style={{ color: theme.accent, fontSize: 14 }}>◆</Text>
        <View style={{ width: 24, height: 1, backgroundColor: theme.accent }} />
      </View>
    );
  }
  if (d === "ornament") {
    return (
      <Text
        style={{
          color: theme.accent,
          fontSize: 14,
          marginTop: spacing.xs,
          alignSelf: align === "center" ? "center" : "flex-start",
        }}
      >
        ❦
      </Text>
    );
  }
  return null;
}
