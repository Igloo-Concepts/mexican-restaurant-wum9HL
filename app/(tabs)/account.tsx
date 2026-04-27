import { useState } from "react";
import { Text, TextInput, View } from "react-native";
import { ActionButton } from "../../components/ActionButton";
import { GlobalHeader } from "../../components/GlobalHeader";
import { SafeFormScroll } from "../../components/layout/SafeFormScroll";
import { SectionHeader } from "../../components/SectionHeader";
import { upsertCustomer, useDeviceId } from "../../lib/platform";
import { restaurantConfig } from "../../restaurant.config";
import { radiusFor, spacing, theme, typography } from "../../theme";

/**
 * Minimal customer account. First launch: customer enters name/email and we
 * upsert to the tenant API under a device id. On relaunch they can refresh
 * their info. The account surface is deliberately thin — richer features
 * (loyalty, order history) layer on top of this primitive.
 */
export default function AccountScreen() {
  const { deviceId } = useDeviceId();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dietary, setDietary] = useState("");
  const [birthday, setBirthday] = useState("");
  const [saving, setSaving] = useState(false);
  const [ok, setOk] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function save() {
    setErr(null);
    setOk(null);
    if (!name.trim()) {
      setErr("Your name helps us recognise you when you visit.");
      return;
    }
    if (!deviceId) {
      setErr("Setting up your device — try again in a moment.");
      return;
    }
    setSaving(true);
    try {
      await upsertCustomer({
        deviceId,
        name: name.trim(),
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
        dietaryPrefs: dietary
          ? dietary
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : undefined,
        birthday: birthday.trim() || undefined,
      });
      setOk("Profile saved.");
    } catch (e: any) {
      setErr(
        e?.code === "not_configured"
          ? "Accounts aren't connected yet."
          : "Couldn't save your profile. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }

  const topInset = restaurantConfig.layout?.previewWebTopInset ?? 59;

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <View style={{ paddingTop: topInset }}>
        <GlobalHeader />
      </View>
      <SafeFormScroll>
        <SectionHeader title="Your profile" />
        <Text
          style={{ ...typography.body, color: theme.muted, marginBottom: spacing.md }}
        >
          Optional — tell us how you like to dine and we'll remember for next time.
        </Text>

        <Field label="Name" value={name} onChange={setName} />
        <Field label="Email" value={email} onChange={setEmail} keyboardType="email-address" />
        <Field label="Phone" value={phone} onChange={setPhone} keyboardType="phone-pad" />
        <Field
          label="Dietary prefs (comma-separated)"
          value={dietary}
          onChange={setDietary}
          placeholder="vegetarian, no shellfish"
        />
        <Field label="Birthday" value={birthday} onChange={setBirthday} placeholder="YYYY-MM-DD" />

        {err && <Text style={{ color: "#c0392b", marginBottom: spacing.sm }}>{err}</Text>}
        {ok && <Text style={{ color: theme.accent, marginBottom: spacing.sm }}>{ok}</Text>}

        <ActionButton
          label={saving ? "Saving…" : "Save profile"}
          onPress={saving ? undefined : save}
          style={{ marginTop: spacing.md }}
        />
      </SafeFormScroll>
    </View>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  keyboardType,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  keyboardType?: "default" | "number-pad" | "phone-pad" | "email-address";
}) {
  return (
    <View style={{ marginBottom: spacing.md }}>
      <Text style={{ ...typography.caption, color: theme.muted, marginBottom: spacing.xs }}>
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={theme.muted}
        keyboardType={keyboardType}
        style={{
          borderWidth: 1,
          borderColor: theme.muted,
          borderRadius: radiusFor(theme.radius),
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm,
          color: theme.text,
          backgroundColor: theme.surface,
          ...typography.body,
        }}
      />
    </View>
  );
}
