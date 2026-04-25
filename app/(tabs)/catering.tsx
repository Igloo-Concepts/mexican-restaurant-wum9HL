import { useState } from "react";
import { Text, TextInput, View } from "react-native";
import { restaurantConfig } from "../../restaurant.config";
import { ActionButton } from "../../components/ActionButton";
import { SafeFormScroll } from "../../components/layout/SafeFormScroll";
import { SectionHeader } from "../../components/SectionHeader";
import { submitLead } from "../../lib/platform";
import { radiusFor, spacing, theme, typography } from "../../theme";

export default function CateringScreen() {
  const options = restaurantConfig.modules?.catering ?? { enabled: false };
  const minGuests = options.minGuests ?? 10;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [guests, setGuests] = useState("");
  const [budget, setBudget] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  async function send() {
    setError(null);
    setOk(null);
    if (!name.trim() || !message.trim()) {
      setError("Please share your name and a brief message.");
      return;
    }
    setSubmitting(true);
    try {
      await submitLead({
        kind: "catering",
        name: name.trim(),
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
        message: message.trim(),
        meta: {
          eventDate: eventDate.trim() || undefined,
          guests: guests.trim() || undefined,
          budget: budget.trim() || undefined,
        },
      });
      setOk("Thanks — we'll get back to you within 24 hours.");
      setName("");
      setEmail("");
      setPhone("");
      setEventDate("");
      setGuests("");
      setBudget("");
      setMessage("");
    } catch (e: any) {
      setError(
        e?.code === "not_configured"
          ? "Catering enquiries aren't connected yet."
          : "Couldn't send your enquiry. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SafeFormScroll>
      <SectionHeader title="Catering & private dining" />
      <Text
        style={{
          ...typography.body,
          color: theme.muted,
          marginBottom: spacing.md,
        }}
      >
        Events from {minGuests} guests upwards. Tell us a little about what
        you're planning and we'll send over options.
      </Text>

      <Field label="Your name" value={name} onChange={setName} />
      <Field label="Email" value={email} onChange={setEmail} keyboardType="email-address" />
      <Field label="Phone" value={phone} onChange={setPhone} keyboardType="phone-pad" />
      <Field label="Event date" value={eventDate} onChange={setEventDate} placeholder="2026-09-12" />
      <Field label="Guest count" value={guests} onChange={setGuests} keyboardType="number-pad" />
      <Field label="Approx. budget" value={budget} onChange={setBudget} placeholder="£2,500" />
      <Field
        label="Tell us about your event"
        value={message}
        onChange={setMessage}
        multiline
        placeholder="Format, dietary needs, venue, timings…"
      />

      {error && <Text style={{ color: "#c0392b", marginBottom: spacing.sm }}>{error}</Text>}
      {ok && <Text style={{ color: theme.accent, marginBottom: spacing.sm }}>{ok}</Text>}

      <ActionButton
        label={submitting ? "Sending…" : "Send enquiry"}
        onPress={submitting ? undefined : send}
        style={{ marginTop: spacing.md }}
      />
    </SafeFormScroll>
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
      <Text style={{ ...typography.caption, color: theme.muted, marginBottom: spacing.xs }}>
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
          minHeight: multiline ? 96 : undefined,
          textAlignVertical: multiline ? "top" : "auto",
          ...typography.body,
        }}
      />
    </View>
  );
}
