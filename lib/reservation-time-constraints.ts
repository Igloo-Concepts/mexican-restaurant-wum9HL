/**
 * Opening hours from the tenant API are plain HH:mm strings per weekday.
 * All logic uses the device local calendar so it matches DateTimePicker output.
 */

export type OpeningSession = { open: string; close: string };
export type BookingOverride = {
  /** Local calendar date in YYYY-MM-DD format. */
  date: string;
  /** If true, no bookings are allowed on this date. */
  closedAllDay?: boolean;
  /** Optional blocked windows on this date. */
  closedWindows?: OpeningSession[];
};

const WEEKDAY_ORDER = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
] as const;

export type WeekdayKey = (typeof WEEKDAY_ORDER)[number];

export type WeeklyHoursMap = Partial<Record<WeekdayKey, OpeningSession[]>>;
const ISO_LOCAL_DATE = /^\d{4}-\d{2}-\d{2}$/;

function weekdayKey(d: Date): WeekdayKey {
  return WEEKDAY_ORDER[d.getDay()];
}

function parseHm(s: string): number | null {
  let t = String(s).trim();
  const dot = t.indexOf(".");
  if (dot >= 0) t = t.slice(0, dot);
  // Accept HH:mm or HH:mm:ss (HTML time, Safari, some JSON encoders).
  const m = t.match(/^(\d{1,2}):(\d{2})(?::\d{1,2})?/);
  if (!m) return null;
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (!Number.isFinite(h) || !Number.isFinite(min)) return null;
  if (h < 0 || h > 23 || min < 0 || min > 59) return null;
  return h * 60 + min;
}

function setDateToTotalMinutes(calDay: Date, totalMins: number): Date {
  const out = new Date(
    calDay.getFullYear(),
    calDay.getMonth(),
    calDay.getDate(),
    Math.floor(totalMins / 60),
    totalMins % 60,
    0,
    0
  );
  return out;
}

function sortedSessions(day: OpeningSession[] | undefined): OpeningSession[] {
  if (!day?.length) return [];
  return [...day].sort((a, b) => {
    const ao = parseHm(a.open) ?? 0;
    const bo = parseHm(b.open) ?? 0;
    return ao - bo;
  });
}

function normalizeSessionsArray(raw: unknown): OpeningSession[] {
  if (!Array.isArray(raw)) return [];
  const sessions: OpeningSession[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const o = item as Record<string, unknown>;
    const openRaw =
      o.open ?? o.Open ?? o.OPEN ?? o.start ?? o.Start ?? o.from ?? o.From;
    const closeRaw =
      o.close ?? o.Close ?? o.CLOSE ?? o.end ?? o.End ?? o.to ?? o.To;
    const open = String(openRaw ?? "").trim();
    const close = String(closeRaw ?? "").trim();
    if (parseHm(open) === null || parseHm(close) === null) continue;
    sessions.push({ open, close });
  }
  return sessions;
}

/** Valid same-day window: open < close (minutes). */
function normalizedSession(s: OpeningSession): { open: number; close: number } | null {
  const o = parseHm(s.open);
  const c = parseHm(s.close);
  if (o === null || c === null) return null;
  if (c <= o) return null;
  return { open: o, close: c };
}

function sessionsForCalendarDay(calMidnight: Date, wh: WeeklyHoursMap) {
  const key = weekdayKey(calMidnight);
  return sortedSessions(wh[key])
    .map(normalizedSession)
    .filter((x): x is { open: number; close: number } => x !== null);
}

/** Start of local calendar day (00:00) for `d`. */
export function startOfLocalDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
}

/**
 * Normalise API keys (`Sunday` / `SUNDAY` / `sunday`) and loose session shapes
 * so lookups match {@link weekdayKey}.
 */
export function normalizeWeeklyHoursFromApi(
  raw: Record<string, unknown> | null | undefined
): WeeklyHoursMap {
  const out: Partial<Record<WeekdayKey, OpeningSession[]>> = {};
  if (!raw || typeof raw !== "object") return out as WeeklyHoursMap;
  for (const [rawKey, val] of Object.entries(raw)) {
    const key = rawKey.toLowerCase().trim() as WeekdayKey;
    if (!WEEKDAY_ORDER.includes(key)) continue;
    const sessions = normalizeSessionsArray(val);
    if (sessions.length) out[key] = sessions;
  }
  return out as WeeklyHoursMap;
}

/** Normalise booking overrides from API/config into predictable shapes. */
export function normalizeBookingOverridesFromApi(raw: unknown): BookingOverride[] {
  if (!Array.isArray(raw)) return [];
  const out: BookingOverride[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const rec = item as Record<string, unknown>;
    const date = String(rec.date ?? "").trim();
    if (!ISO_LOCAL_DATE.test(date)) continue;
    const closedAllDay = rec.closedAllDay === true;
    const closedWindows = closedAllDay ? [] : normalizeSessionsArray(rec.closedWindows);
    if (!closedAllDay && closedWindows.length === 0) continue;
    out.push({
      date,
      closedAllDay,
      closedWindows,
    });
  }
  const deduped = new Map<string, BookingOverride>();
  for (const item of out) deduped.set(item.date, item);
  return [...deduped.values()].sort((a, b) => a.date.localeCompare(b.date));
}

/** Prefer server overrides; fall back to embedded config if server has none. */
export function mergeBookingOverridesPreferApi(
  fromApi: BookingOverride[],
  embedded: BookingOverride[]
): BookingOverride[] {
  return fromApi.length > 0 ? fromApi : embedded;
}

/**
 * Bookable instants on `calDay` (local), every `stepMinutes` inside opening
 * sessions, optionally excluding times before `notBefore`.
 */
export function generateBookableSlotDates(
  calDay: Date,
  wh: WeeklyHoursMap,
  opts?: {
    stepMinutes?: number;
    notBefore?: Date;
    bookingOverrides?: BookingOverride[];
  }
): Date[] {
  const step = Math.max(5, Math.min(60, opts?.stepMinutes ?? 15));
  const notBefore = opts?.notBefore;
  const cal = startOfLocalDay(calDay);
  const sessions = sessionsForCalendarDay(cal, wh);
  const slots: Date[] = [];
  for (const sess of sessions) {
    for (let m = sess.open; m <= sess.close; m += step) {
      const dt = setDateToTotalMinutes(cal, m);
      if (notBefore && dt.getTime() < notBefore.getTime()) continue;
      if (isSlotBlockedByOverrides(dt, opts?.bookingOverrides)) continue;
      slots.push(dt);
    }
  }
  return slots;
}

/** Calendar midnights (next `maxScanDays`) that have at least one bookable slot after `notBefore`. */
export function upcomingBookableDayStarts(
  wh: WeeklyHoursMap,
  maxScanDays: number,
  notBefore: Date,
  opts?: { stepMinutes?: number; bookingOverrides?: BookingOverride[] }
): Date[] {
  const out: Date[] = [];
  const start = startOfLocalDay(notBefore);
  for (let i = 0; i < maxScanDays; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const slots = generateBookableSlotDates(d, wh, {
      notBefore,
      stepMinutes: opts?.stepMinutes,
      bookingOverrides: opts?.bookingOverrides,
    });
    if (slots.length > 0) out.push(startOfLocalDay(d));
  }
  return out;
}

export function hasConfiguredWeeklyHours(wh: WeeklyHoursMap | null | undefined): boolean {
  if (!wh) return false;
  for (const k of WEEKDAY_ORDER) {
    const arr = wh[k];
    if (arr && arr.length > 0) return true;
  }
  return false;
}

/** Per weekday: use API sessions when present, otherwise embedded (e.g. `restaurant.config`). */
export function mergeWeeklyHoursPreferApi(
  fromApi: WeeklyHoursMap,
  embedded: WeeklyHoursMap
): WeeklyHoursMap {
  const out: Partial<Record<WeekdayKey, OpeningSession[]>> = {};
  for (const k of WEEKDAY_ORDER) {
    const a = fromApi[k];
    const e = embedded[k];
    if (a && a.length > 0) out[k] = a;
    else if (e && e.length > 0) out[k] = e;
  }
  return out as WeeklyHoursMap;
}

/**
 * Earliest allowed instant on or after `from` (inclusive), using sessions only.
 * If nothing is configured in the next two weeks, returns `from` unchanged.
 */
export function nextAvailableSlot(from: Date, wh: WeeklyHoursMap): Date {
  if (!hasConfiguredWeeklyHours(wh)) return from;

  const anchor = new Date(from.getTime());
  anchor.setSeconds(0, 0);

  for (let dayOffset = 0; dayOffset < 14; dayOffset++) {
    const cal = new Date(
      anchor.getFullYear(),
      anchor.getMonth(),
      anchor.getDate() + dayOffset,
      0,
      0,
      0,
      0
    );
    const sessions = sessionsForCalendarDay(cal, wh);
    if (sessions.length === 0) continue;

    const effectiveFrom = dayOffset === 0 ? anchor : cal;

    for (const sess of sessions) {
      const openAt = setDateToTotalMinutes(cal, sess.open);
      const closeAt = setDateToTotalMinutes(cal, sess.close);
      if (effectiveFrom.getTime() <= closeAt.getTime()) {
        if (effectiveFrom.getTime() < openAt.getTime()) {
          return openAt;
        }
        return new Date(effectiveFrom.getTime());
      }
    }
  }
  return from;
}

/**
 * Snap a user-chosen local instant into an allowed session on that calendar day,
 * the next session later the same day, or the next opening day.
 */
export function clampToWeeklyHours(value: Date, wh: WeeklyHoursMap): Date {
  if (!hasConfiguredWeeklyHours(wh)) return value;

  const v = new Date(value.getTime());
  v.setSeconds(0, 0);

  const cal = new Date(v.getFullYear(), v.getMonth(), v.getDate(), 0, 0, 0, 0);
  const sessions = sessionsForCalendarDay(cal, wh);

  if (sessions.length === 0) {
    const nextCal = new Date(cal.getTime());
    nextCal.setDate(nextCal.getDate() + 1);
    return nextAvailableSlot(nextCal, wh);
  }

  const t = v.getHours() * 60 + v.getMinutes();

  for (const sess of sessions) {
    if (t < sess.open) {
      return setDateToTotalMinutes(cal, sess.open);
    }
    if (t <= sess.close) {
      return setDateToTotalMinutes(cal, t);
    }
  }

  const nextCal = new Date(cal.getTime());
  nextCal.setDate(nextCal.getDate() + 1);
  return nextAvailableSlot(nextCal, wh);
}

function dateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function normalizedOverrideSession(
  s: OpeningSession
): { open: number; close: number } | null {
  return normalizedSession(s);
}

/**
 * True when a slot lands in a fully-closed day or a blocked window for that
 * date.
 */
export function isSlotBlockedByOverrides(
  slot: Date,
  overrides: BookingOverride[] | undefined
): boolean {
  if (!overrides || overrides.length === 0) return false;
  const key = dateKey(slot);
  const hit = overrides.find((o) => o.date === key);
  if (!hit) return false;
  if (hit.closedAllDay) return true;
  const minute = slot.getHours() * 60 + slot.getMinutes();
  const windows = hit.closedWindows ?? [];
  for (const w of windows) {
    const parsed = normalizedOverrideSession(w);
    if (!parsed) continue;
    if (minute >= parsed.open && minute <= parsed.close) return true;
  }
  return false;
}
