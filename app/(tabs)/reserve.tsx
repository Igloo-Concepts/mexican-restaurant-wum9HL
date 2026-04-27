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
import { GlobalHeader } from "../../components/GlobalHeader";
import {
  getTenantConfig,
  submitReservation,
  useReservationHours,
} from "../../lib/platform";
import {
  generateBookableSlotDates,
  hasConfiguredWeeklyHours,
  mergeBookingOverridesPreferApi,
  mergeWeeklyHoursPreferApi,
  normalizeBookingOverridesFromApi,
  normalizeWeeklyHoursFromApi,
  startOfLocalDay,
  upcomingBookableDayStarts,
  type BookingOverride,
  type WeeklyHoursMap,
} from "../../lib/reservation-time-constraints";
import { spacing, theme, typography, radiusFor } from "../../theme";

const DEFAULT_SLOT_INTERVAL = 15;
const ALLOWED_SLOT_INTERVALS: readonly number[] = [15, 30, 60];

function coerceSlotInterval(value: unknown): number {
  const n =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number(value)
        : NaN;
  return ALLOWED_SLOT_INTERVALS.includes(n) ? n : DEFAULT_SLOT_INTERVAL;
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
        bookingOverrides?: unknown;
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

  const bookingOverridesFromApi = useMemo(
    () => normalizeBookingOverridesFromApi(hoursData?.bookingOverrides),
    [hoursData]
  );

  const bookingOverridesEmbedded = useMemo(
    () => normalizeBookingOverridesFromApi(embeddedReservations?.bookingOverrides),
    [embeddedReservations]
  );

  const bookingOverrides = useMemo(
    () =>
      mergeBookingOverridesPreferApi(
        bookingOverridesFromApi,
        bookingOverridesEmbedded
      ),
    [bookingOverridesFromApi, bookingOverridesEmbedded]
  );

  const slotIntervalMinutes = useMemo(() => {
    if (hoursData?.slotIntervalMinutes !== undefined) {
      return coerceSlotInterval(hoursData.slotIntervalMinutes);
    }
    if (embeddedReservations?.slotIntervalMinutes !== undefined) {
      return coerceSlotInterval(embeddedReservations.slotIntervalMinutes);
    }
    return DEFAULT_SLOT_INTERVAL;
  }, [hoursData, embeddedReservations]);

  const hoursConfigured = hasConfiguredWeeklyHours(weeklyHoursMerged);

  const nextBookableSlot = useCallback(
    (from: Date): Date | null => {
      const start = startOfLocalDay(from);
      for (let i = 0; i < 120; i++) {
        const day = new Date(start);
        day.setDate(start.getDate() + i);
        const slots = generateBookableSlotDates(day, weeklyHoursMerged, {
          notBefore: from,
          stepMinutes: slotIntervalMinutes,
          bookingOverrides,
        });
        if (slots.length > 0) return slots[0]!;
      }
      return null;
    },
    [weeklyHoursMerged, slotIntervalMinutes, bookingOverrides]
  );

  const isSlotSelectable = useCallback(
    (value: Date): boolean => {
      const cal = startOfLocalDay(value);
      const slots = generateBookableSlotDates(cal, weeklyHoursMerged, {
        notBefore: new Date(),
        stepMinutes: slotIntervalMinutes,
        bookingOverrides,
      });
      return slots.some((slot) => slot.getTime() === value.getTime());
    },
    [weeklyHoursMerged, slotIntervalMinutes, bookingOverrides]
  );

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
      if (prev && isSlotSelectable(prev)) return prev;
      return nextBookableSlot(new Date());
    });
  }, [hoursLoading, hoursConfigured, nextBookableSlot, isSlotSelectable]);

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
    if (!isSlotSelectable(requestedAt)) {
      const next = nextBookableSlot(new Date());
      setRequestedAt(next);
      setError(
        next
          ? "That time is no longer available. Please choose another slot."
          : "No bookable times are currently available."
      );
      return;
    }
    setSubmitting(true);
    try {
      await submitReservation({
        name: name.trim(),
        partySize: size,
        requestedFor: requestedAt.getTime(),
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
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <GlobalHeader />
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
            bookingOverrides={bookingOverrides}
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
    </View>
  );
}

function formatPickerTimeLabel(slot: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(slot);
}

function formatMonthYear(d: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    month: "long",
    year: "numeric",
  }).format(d);
}

function formatSelectedDayLabel(d: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(d);
}

const WEEKDAY_HEADINGS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0);
}

function addMonths(d: Date, n: number): Date {
  return new Date(d.getFullYear(), d.getMonth() + n, 1, 0, 0, 0, 0);
}

function sameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/**
 * Build the 6-row x 7-col grid of dates for the given month, padding with
 * the adjacent month's days so the calendar always shows a full 6-week
 * block. Grid starts on Monday to match the headings above.
 */
function buildMonthGrid(month: Date): Date[] {
  const first = startOfMonth(month);
  // Mon=0 … Sun=6. JS: getDay() → Sun=0 … Sat=6 → we shift to Mon-first.
  const firstWeekdayMondayFirst = (first.getDay() + 6) % 7;
  const gridStart = new Date(first);
  gridStart.setDate(first.getDate() - firstWeekdayMondayFirst);
  const cells: Date[] = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(gridStart);
    d.setDate(gridStart.getDate() + i);
    cells.push(d);
  }
  return cells;
}

function OpeningHoursInlinePicker({
  weeklyHours,
  stepMinutes,
  bookingOverrides,
  value,
  onSelect,
}: {
  weeklyHours: WeeklyHoursMap;
  stepMinutes: number;
  bookingOverrides: BookingOverride[];
  value: Date | null;
  onSelect: (d: Date) => void;
}) {
  const today = useMemo(() => startOfLocalDay(new Date()), []);

  // Pre-compute every bookable calendar day for the next ~120 days so the
  // calendar can enable/disable cells quickly as the user pages through
  // months. We compare by timestamp of local-midnight for exact matching.
  const bookableDayKeys = useMemo(() => {
    const now = new Date();
    const days = upcomingBookableDayStarts(weeklyHours, 120, now, {
      stepMinutes,
      bookingOverrides,
    });
    return new Set(days.map((d) => d.getTime()));
  }, [weeklyHours, stepMinutes, bookingOverrides]);

  const firstBookable = useMemo(() => {
    const now = new Date();
    const days = upcomingBookableDayStarts(weeklyHours, 120, now, {
      stepMinutes,
      bookingOverrides,
    });
    return days[0] ?? null;
  }, [weeklyHours, stepMinutes, bookingOverrides]);

  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [viewMonth, setViewMonth] = useState<Date>(() =>
    startOfMonth(value ?? firstBookable ?? today)
  );

  useEffect(() => {
    if (bookableDayKeys.size === 0) {
      setSelectedDay(null);
      return;
    }
    const candidate = value ? startOfLocalDay(value) : null;
    if (candidate && bookableDayKeys.has(candidate.getTime())) {
      setSelectedDay(candidate);
      setViewMonth((m) =>
        m.getTime() === startOfMonth(candidate).getTime()
          ? m
          : startOfMonth(candidate)
      );
      return;
    }
    if (firstBookable) {
      setSelectedDay(firstBookable);
      setViewMonth((m) =>
        m.getTime() === startOfMonth(firstBookable).getTime()
          ? m
          : startOfMonth(firstBookable)
      );
    }
  }, [bookableDayKeys, value, firstBookable]);

  const slots = selectedDay
    ? generateBookableSlotDates(selectedDay, weeklyHours, {
        notBefore: new Date(),
        stepMinutes,
        bookingOverrides,
      })
    : [];

  const cells = useMemo(() => buildMonthGrid(viewMonth), [viewMonth]);

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

      {/* Month navigator */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: spacing.sm,
        }}
      >
        <CalendarNavButton
          label="<"
          onPress={() => setViewMonth((m) => addMonths(m, -1))}
        />
        <Text
          style={{
            ...typography.body,
            fontWeight: "700",
            color: theme.text,
          }}
        >
          {formatMonthYear(viewMonth)}
        </Text>
        <CalendarNavButton
          label=">"
          onPress={() => setViewMonth((m) => addMonths(m, 1))}
        />
      </View>

      {/* Weekday headings */}
      <View style={{ flexDirection: "row", marginBottom: spacing.xs }}>
        {WEEKDAY_HEADINGS.map((w) => (
          <View key={w} style={{ flex: 1, alignItems: "center" }}>
            <Text
              style={{
                ...typography.caption,
                color: theme.muted,
                fontWeight: "600",
                letterSpacing: 0.5,
              }}
            >
              {w}
            </Text>
          </View>
        ))}
      </View>

      {/* 6-row day grid */}
      {[0, 1, 2, 3, 4, 5].map((rowIdx) => (
        <View
          key={rowIdx}
          style={{ flexDirection: "row", marginBottom: spacing.xs }}
        >
          {cells.slice(rowIdx * 7, rowIdx * 7 + 7).map((cell) => {
            const inViewMonth = cell.getMonth() === viewMonth.getMonth();
            const isToday = sameDay(cell, today);
            const isSelected =
              selectedDay != null && sameDay(cell, selectedDay);
            const isBookable =
              bookableDayKeys.has(cell.getTime()) &&
              cell.getTime() >= today.getTime();

            let textColor: string = theme.text;
            if (!inViewMonth) textColor = theme.muted;
            if (!isBookable) textColor = theme.muted;
            if (isSelected) textColor = theme.accent;

            return (
              <Pressable
                key={cell.getTime()}
                disabled={!isBookable}
                onPress={() => {
                  setSelectedDay(cell);
                }}
                style={{
                  flex: 1,
                  aspectRatio: 1,
                  marginHorizontal: 2,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: radiusFor(theme.radius),
                  borderWidth: isSelected ? 1 : 0,
                  borderColor: isSelected ? theme.accent : "transparent",
                  backgroundColor: isSelected
                    ? `${theme.accent}25`
                    : isToday && isBookable
                      ? `${theme.accent}10`
                      : "transparent",
                  opacity: isBookable ? 1 : 0.35,
                }}
              >
                <Text
                  style={{
                    ...typography.body,
                    color: textColor,
                    fontWeight: isSelected || isToday ? "700" : "400",
                  }}
                >
                  {cell.getDate()}
                </Text>
              </Pressable>
            );
          })}
        </View>
      ))}

      {/* Time slots for selected day */}
      <View style={{ marginTop: spacing.sm }}>
        <Text
          style={{
            ...typography.body,
            fontWeight: "600",
            color: theme.text,
            marginBottom: spacing.xs,
          }}
        >
          {selectedDay
            ? `Times on ${formatSelectedDayLabel(selectedDay)}`
            : "Time"}
        </Text>
        {bookableDayKeys.size === 0 ? (
          <Text style={{ ...typography.caption, color: theme.muted }}>
            No seating hours in the next few weeks.
          </Text>
        ) : !selectedDay ? (
          <Text style={{ ...typography.caption, color: theme.muted }}>
            Pick a highlighted day above.
          </Text>
        ) : slots.length === 0 ? (
          <Text style={{ ...typography.caption, color: theme.muted }}>
            No more times that day — pick another date.
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
                    backgroundColor: selected
                      ? `${theme.accent}20`
                      : theme.background,
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
    </View>
  );
}

function CalendarNavButton({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      style={{
        width: 36,
        height: 36,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: radiusFor(theme.radius),
        borderWidth: 1,
        borderColor: theme.muted,
      }}
    >
      <Text
        style={{
          ...typography.body,
          color: theme.text,
          fontWeight: "700",
        }}
      >
        {label}
      </Text>
    </Pressable>
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
