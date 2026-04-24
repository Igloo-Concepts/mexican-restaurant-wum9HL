import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { useFocusEffect } from "expo-router";
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { restaurantConfig } from "../../restaurant.config";
import { ActionButton } from "../../components/ActionButton";
import { SectionHeader } from "../../components/SectionHeader";
import { SafeFormScroll } from "../../components/layout/SafeFormScroll";
import {
  getTenantConfig,
  submitReservation,
  useReservationHours,
} from "../../lib/platform";
import {
  clampToWeeklyHours,
  generateBookableSlotDates,
  hasConfiguredWeeklyHours,
  mergeWeeklyHoursPreferApi,
  nextAvailableSlot,
  normalizeWeeklyHoursFromApi,
  startOfLocalDay,
  upcomingBookableDayStarts,
  type WeeklyHoursMap,
} from "../../lib/reservation-time-constraints";
import { spacing, theme, typography, radiusFor } from "../../theme";

type SlotIntervalMinutes = 15 | 30 | 60;
const DEFAULT_SLOT_INTERVAL: SlotIntervalMinutes = 15;
const ALLOWED_SLOT_INTERVALS: readonly SlotIntervalMinutes[] = [
  15, 30, 60,
] as const;

function coerceSlotInterval(value: unknown): SlotIntervalMinutes {
  const n =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number(value)
        : NaN;
  return (ALLOWED_SLOT_INTERVALS as readonly number[]).includes(n)
    ? (n as SlotIntervalMinutes)
    : DEFAULT_SLOT_INTERVAL;
}

export default function ReserveScreen() {
  const options = restaurantConfig.modules?.reservations ?? { enabled: false };
  const maxParty = options.partySizeMax ?? 12;

  const {
    data: hoursData,
    loading: hoursLoading,
    error: hoursError,
    refresh: refreshHours,
  } = useReservationHours();

  useFocusEffect(
    useCallback(() => {
      if (getTenantConfig()) refreshHours();
    }, [refreshHours])
  );

  const weeklyHoursFromApi = useMemo(
    () =>
      normalizeWeeklyHoursFromApi(
        hoursData?.weeklyHours as Record<string, unknown> | undefined
      ),
    [hoursData]
  );

  const embeddedReservations = restaurantConfig.modules?.reservations as
    | {
        weeklyHours?: Record<string, unknown>;
        slotIntervalMinutes?: unknown;
      }
    | undefined;

  const weeklyHoursEmbedded = useMemo(
    () => normalizeWeeklyHoursFromApi(embeddedReservations?.weeklyHours),
    [embeddedReservations]
  );

  const weeklyHoursMerged = useMemo(
    () => mergeWeeklyHoursPreferApi(weeklyHoursFromApi, weeklyHoursEmbedded),
    [weeklyHoursFromApi, weeklyHoursEmbedded]
  );

  const slotIntervalMinutes: SlotIntervalMinutes = useMemo(() => {
    if (hoursData?.slotIntervalMinutes !== undefined) {
      return coerceSlotInterval(hoursData.slotIntervalMinutes);
    }
    if (embeddedReservations?.slotIntervalMinutes !== undefined) {
      return coerceSlotInterval(embeddedReservations.slotIntervalMinutes);
    }
    return DEFAULT_SLOT_INTERVAL;
  }, [hoursData, embeddedReservations]);

  const hoursConfigured = hasConfiguredWeeklyHours(weeklyHoursMerged);

  const [name, setName] = useState("");
  const [partySize, setPartySize] = useState("2");
  const [requestedAt, setRequestedAt] = useState<Date | null>(null);
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (hoursLoading) return;
    if (!hoursConfigured) return;
    setRequestedAt((prev: Date | null) => {
      const base = prev ?? nextAvailableSlot(new Date(), weeklyHoursMerged);
      return clampToWeeklyHours(base, weeklyHoursMerged);
    });
  }, [hoursLoading, hoursConfigured, weeklyHoursMerged]);

  async function send() {
    setError(null);
    setMessage(null);
    const size = Math.max(1, Math.min(maxParty, parseInt(partySize, 10) || 0));
    if (!name.trim()) {
      setError("Please fill in your name.");
      return;
    }
    if (!hoursConfigured) {
      setError(
        "No bookable times are set yet. Please call the restaurant or try again later."
      );
      return;
    }
    if (!requestedAt) {
      setError("Please choose a time.");
      return;
    }
    const clamped = clampToWeeklyHours(requestedAt, weeklyHoursMerged);
    setSubmitting(true);
    try {
      await submitReservation({
        name: name.trim(),
        partySize: size,
        requestedFor: clamped.getTime(),
        phone: phone.trim() || undefined,
        notes: notes.trim() || undefined,
      });
      setMessage(
        "Thanks — we've received your reservation request. The restaurant will be in touch shortly."
      );
      setName("");
      setPartySize("2");
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
    <SafeFormScroll>
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
      {hoursError && getTenantConfig() ? (
        <View style={{ marginBottom: spacing.sm }}>
          <Text style={{ ...typography.caption, color: "#c0392b" }}>
            Could not load opening hours from the server ({hoursError.code}).
            Times below use any copy baked into the app, or tap Retry.
          </Text>
          <Pressable
            onPress={() => refreshHours()}
            style={{
              marginTop: spacing.xs,
              alignSelf: "flex-start",
              paddingVertical: spacing.xs,
              paddingHorizontal: spacing.md,
              borderRadius: radiusFor(theme.radius),
              borderWidth: 1,
              borderColor: theme.muted,
            }}
          >
            <Text style={{ ...typography.caption, color: theme.accent }}>
              Retry
            </Text>
          </Pressable>
        </View>
      ) : null}
      {!hoursLoading && hoursConfigured ? (
        <Text
          style={{
            ...typography.caption,
            color: theme.muted,
            marginBottom: spacing.sm,
          }}
        >
          Only times inside the restaurant's sessions are shown.
        </Text>
      ) : null}

      <Field label="Your name" value={name} onChange={setName} placeholder="Full name" />
      <Field
        label={`Party size (up to ${maxParty})`}
        value={partySize}
        onChange={setPartySize}
        placeholder="2"
        keyboardType="number-pad"
      />

      {hoursLoading ? (
        <NoticeBox>
          Loading the restaurant's booking windows…
        </NoticeBox>
      ) : hoursConfigured ? (
        <OpeningHoursInlinePicker
          weeklyHours={weeklyHoursMerged}
          stepMinutes={slotIntervalMinutes}
          value={requestedAt}
          onSelect={(slot) => setRequestedAt(slot)}
        />
      ) : (
        <NoticeBox>
          No bookable times have been set yet. Please check back soon or
          contact the restaurant directly.
        </NoticeBox>
      )}

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
    </SafeFormScroll>
  );
}

function formatPickerDayLabel(d: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(d);
}

function formatPickerTimeLabel(slot: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(slot);
}

function OpeningHoursInlinePicker({
  weeklyHours,
  stepMinutes,
  value,
  onSelect,
}: {
  weeklyHours: WeeklyHoursMap;
  stepMinutes: SlotIntervalMinutes;
  value: Date | null;
  onSelect: (d: Date) => void;
}) {
  const [dayStarts, setDayStarts] = useState<Date[]>([]);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  useEffect(() => {
    const now = new Date();
    const days = upcomingBookableDayStarts(weeklyHours, 28, now);
    setDayStarts(days);
    if (!days.length) {
      setSelectedDay(null);
      return;
    }
    if (value) {
      const cur = startOfLocalDay(value);
      const match = days.find((d) => d.getTime() === cur.getTime());
      setSelectedDay(match ?? days[0]!);
    } else {
      setSelectedDay(days[0]!);
    }
  }, [weeklyHours, value]);

  const slots = selectedDay
    ? generateBookableSlotDates(selectedDay, weeklyHours, {
        notBefore: new Date(),
        stepMinutes,
      })
    : [];

  return (
    <View
      style={{
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: theme.muted,
        borderRadius: radiusFor(theme.radius),
        padding: spacing.md,
        backgroundColor: theme.surface,
      }}
    >
      <Text
        style={{
          ...typography.caption,
          color: theme.muted,
          marginBottom: spacing.xs,
        }}
      >
        Preferred date & time
      </Text>
      <Text
        style={{
          ...typography.body,
          fontWeight: "600",
          color: theme.text,
          marginBottom: spacing.xs,
        }}
      >
        Day
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingVertical: spacing.xs,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        {dayStarts.map((d) => {
          const active =
            selectedDay != null && d.getTime() === selectedDay.getTime();
          return (
            <Pressable
              key={d.getTime()}
              onPress={() => setSelectedDay(d)}
              style={{
                marginRight: spacing.sm,
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.sm,
                borderRadius: radiusFor(theme.radius),
                borderWidth: 1,
                borderColor: active ? theme.accent : theme.muted,
                backgroundColor: active ? `${theme.accent}25` : "transparent",
              }}
            >
              <Text
                style={{
                  ...typography.caption,
                  color: active ? theme.accent : theme.text,
                  fontWeight: active ? "600" : "400",
                }}
              >
                {formatPickerDayLabel(d)}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <Text
        style={{
          ...typography.body,
          fontWeight: "600",
          color: theme.text,
          marginTop: spacing.sm,
          marginBottom: spacing.xs,
        }}
      >
        Time
      </Text>
      {dayStarts.length === 0 ? (
        <Text style={{ ...typography.caption, color: theme.muted }}>
          No seating hours in the next few weeks.
        </Text>
      ) : slots.length === 0 ? (
        <Text style={{ ...typography.caption, color: theme.muted }}>
          No more times that day — choose another day above.
        </Text>
      ) : (
        <ScrollView
          style={{ maxHeight: 260 }}
          contentContainerStyle={{
            flexDirection: "row",
            flexWrap: "wrap",
            paddingTop: spacing.xs,
          }}
        >
          {slots.map((slot) => {
            const selected =
              value != null && slot.getTime() === value.getTime();
            return (
              <Pressable
                key={slot.getTime()}
                onPress={() => onSelect(slot)}
                style={{
                  marginRight: spacing.sm,
                  marginBottom: spacing.sm,
                  paddingHorizontal: spacing.md,
                  paddingVertical: spacing.sm,
                  borderRadius: radiusFor(theme.radius),
                  borderWidth: 1,
                  borderColor: selected ? theme.accent : theme.muted,
                  backgroundColor: selected ? `${theme.accent}20` : theme.background,
                }}
              >
                <Text style={{ ...typography.body, color: theme.text }}>
                  {formatPickerTimeLabel(slot)}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

function NoticeBox({ children }: { children: ReactNode }) {
  return (
    <View
      style={{
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: theme.muted,
        borderRadius: radiusFor(theme.radius),
        padding: spacing.md,
        backgroundColor: theme.surface,
      }}
    >
      <Text style={{ ...typography.body, color: theme.muted }}>{children}</Text>
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
