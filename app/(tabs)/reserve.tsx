import { useState } from "react";
import { ScrollView, Text, TextInput, View } from "react-native";
import { restaurantConfig } from "../../restaurant.config";
import { ActionButton } from "../../components/ActionButton";
import { SectionHeader } from "../../components/SectionHeader";
import { submitReservation } from "../../lib/platform";
import { spacing, theme, typography, radiusFor } from "../../theme";

export default function ReserveScreen() {
  const options = restaurantConfig.modules?.reservations ?? { enabled: false };
  const maxParty = options.partySizeMax ?? 12;

  const [name, setName] = useState("");
  const [partySize, setPartySize] = useState("2");
  const [date, setDate] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function send() {
    setError(null);
    setMessage(null);
    const size = Math.max(1, Math.min(maxParty, parseInt(partySize, 10) || 0));
    if (!name.trim() || !date.trim()) {
      setError("Please fill in your name and a date.");
      return;
    }
    const parsedDate = Date.parse(date);
    const requestedFor = Number.isFinite(parsedDate) ? parsedDate : Date.now();
    setSubmitting(true);
    try {
      await submitReservation({
        name: name.trim(),
        partySize: size,
        requestedFor,
        phone: phone.trim() || undefined,
        notes: notes.trim() || undefined,
      });
      setMessage(
        "Thanks — we've received your reservation request. The restaurant will be in touch shortly."
      );
      setName("");
      setPartySize("2");
      setDate("");
      setPhone("");
      setNotes("");
    } catch (e: any) {
      setError(
        e?.code === "not_configured"
          ? "Reservations aren't connected yet — try again in a minute."
          : "Couldn't submit your reservation. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.background }}
      contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxl }}
    >
      <SectionHeader title="Reserve a table" />
      <Text
        style={{
          ...typography.body,
          color: theme.muted,
          marginBottom: spacing.md,
        }}
      >
        Tell us when you'd like to visit. We'll confirm by phone or email.
      </Text>

      <Field label="Your name" value={name} onChange={setName} placeholder="Full name" />
      <Field
        label={`Party size (up to ${maxParty})`}
        value={partySize}
        onChange={setPartySize}
        placeholder="2"
        keyboardType="number-pad"
      />
      <Field
        label="Preferred date & time"
        value={date}
        onChange={setDate}
        placeholder="2026-06-15 19:30"
      />
      <Field
        label="Phone (optional)"
        value={phone}
        onChange={setPhone}
        placeholder="+44 …"
        keyboardType="phone-pad"
      />
      <Field
        label="Notes (optional)"
        value={notes}
        onChange={setNotes}
        placeholder="Anniversary, dietary needs, etc."
        multiline
      />

      {error && (
        <Text style={{ color: "#c0392b", marginBottom: spacing.sm }}>{error}</Text>
      )}
      {message && (
        <Text style={{ color: theme.accent, marginBottom: spacing.sm }}>{message}</Text>
      )}

      <ActionButton
        label={submitting ? "Sending…" : "Request table"}
        onPress={submitting ? undefined : send}
        style={{ marginTop: spacing.md }}
      />
    </ScrollView>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  keyboardType,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  keyboardType?: "default" | "number-pad" | "phone-pad" | "email-address";
  multiline?: boolean;
}) {
  return (
    <View style={{ marginBottom: spacing.md }}>
      <Text
        style={{ ...typography.caption, color: theme.muted, marginBottom: spacing.xs }}
      >
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={theme.muted}
        keyboardType={keyboardType}
        multiline={multiline}
        style={{
          borderWidth: 1,
          borderColor: theme.muted,
          borderRadius: radiusFor(theme.radius),
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm,
          color: theme.text,
          backgroundColor: theme.surface,
          minHeight: multiline ? 80 : undefined,
          textAlignVertical: multiline ? "top" : "auto",
          ...typography.body,
        }}
      />
    </View>
  );
}
