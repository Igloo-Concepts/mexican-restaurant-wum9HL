import { useState } from "react";
import DateTimePicker, {
  type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import {
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
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
  const [dateInput, setDateInput] = useState("");
  const [requestedAt, setRequestedAt] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function send() {
    setError(null);
    setMessage(null);
    const size = Math.max(1, Math.min(maxParty, parseInt(partySize, 10) || 0));
    const parsedDate = requestedAt?.getTime() ?? Date.parse(dateInput);
    if (!name.trim() || !Number.isFinite(parsedDate)) {
      setError("Please fill in your name and a date.");
      return;
    }
    setSubmitting(true);
    try {
      await submitReservation({
        name: name.trim(),
        partySize: size,
        requestedFor: parsedDate,
        phone: phone.trim() || undefined,
        notes: notes.trim() || undefined,
      });
      setMessage(
        "Thanks — we've received your reservation request. The restaurant will be in touch shortly."
      );
      setName("");
      setPartySize("2");
      setDateInput("");
      setRequestedAt(null);
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
      {Platform.OS === "web" ? (
        <Field
          label="Preferred date & time"
          value={dateInput}
          onChange={setDateInput}
          placeholder="2026-06-15 19:30"
        />
      ) : (
        <DateField
          label="Preferred date & time"
          value={dateInput}
          onPress={() => setShowDatePicker(true)}
        />
      )}
      {showDatePicker && Platform.OS !== "web" ? (
        <DateTimePicker
          value={requestedAt ?? new Date()}
          mode="datetime"
          minimumDate={new Date()}
          onChange={(event, selectedDate) => {
            handleDateChange(event, selectedDate, (nextDate) => {
              setRequestedAt(nextDate);
              setDateInput(formatReservationDate(nextDate));
            });
            setShowDatePicker(false);
          }}
        />
      ) : null}
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

function handleDateChange(
  event: DateTimePickerEvent,
  selectedDate: Date | undefined,
  onSelect: (value: Date) => void
) {
  if (event.type === "set" && selectedDate) {
    onSelect(selectedDate);
  }
}

function formatReservationDate(value: Date) {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  const hours = String(value.getHours()).padStart(2, "0");
  const minutes = String(value.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

function DateField({
  label,
  value,
  onPress,
}: {
  label: string;
  value: string;
  onPress: () => void;
}) {
  return (
    <View style={{ marginBottom: spacing.md }}>
      <Text
        style={{ ...typography.caption, color: theme.muted, marginBottom: spacing.xs }}
      >
        {label}
      </Text>
      <Pressable
        onPress={onPress}
        style={{
          borderWidth: 1,
          borderColor: theme.muted,
          borderRadius: radiusFor(theme.radius),
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm,
          backgroundColor: theme.surface,
          minHeight: 48,
          justifyContent: "center",
        }}
      >
        <Text style={{ ...typography.body, color: value ? theme.text : theme.muted }}>
          {value || "Tap to pick date & time"}
        </Text>
      </Pressable>
    </View>
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
