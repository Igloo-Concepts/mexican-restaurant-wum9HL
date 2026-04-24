/**
 * Tiny client SDK the generated app uses to talk to the Plate platform
 * backend at `/api/tenant/{projectId}/...`. Intentionally dependency-free
 * (no React Query, no Firebase client) so it drops cleanly into Expo Snack.
 *
 * Only called from module screens that are registered conditionally based
 * on `config.modules.*.enabled`. If the tenant config is missing (e.g. an
 * old project that pre-dates Phase-2 provisioning), every method becomes
 * a no-op that resolves to `null` so screens can render a friendly fallback
 * without crashing.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { LogBox } from "react-native";
import { restaurantConfig, type ModulesConfig, type TenantConfig } from "../restaurant.config";

// Silence a handful of non-actionable deprecation warnings that Expo SDK 54
// + React Navigation 7 still emit but which we've already migrated away from
// in the template itself. They come from third-party dependencies and only
// add visual noise to the Snack preview — they do not signal broken code.
LogBox.ignoreLogs([
  "SafeAreaView has been deprecated",
]);

const DEFAULT_API_BASE =
  (restaurantConfig.tenant?.apiBase ?? "").replace(/\/$/, "") || null;

export function getTenantConfig(): TenantConfig | null {
  const t = restaurantConfig.tenant;
  if (!t || !t.projectId || !t.apiKey) return null;
  return t;
}

export function getModulesConfig(): ModulesConfig {
  return restaurantConfig.modules ?? {};
}

export function isModuleEnabled<K extends keyof ModulesConfig>(key: K): boolean {
  const m = restaurantConfig.modules?.[key];
  return !!m && (m as { enabled?: boolean }).enabled === true;
}

export class TenantSdkError extends Error {
  readonly status: number;
  readonly code: string;
  constructor(message: string, opts: { status: number; code: string }) {
    super(message);
    this.status = opts.status;
    this.code = opts.code;
  }
}

async function tenantFetch<T>(
  path: string,
  init: { method: "GET" | "POST"; body?: unknown }
): Promise<T> {
  const tenant = getTenantConfig();
  if (!tenant) {
    throw new TenantSdkError("Platform backend not configured for this app.", {
      status: 0,
      code: "not_configured",
    });
  }
  const base = DEFAULT_API_BASE ?? tenant.apiBase.replace(/\/$/, "");
  if (!base) {
    throw new TenantSdkError("Platform backend not configured for this app.", {
      status: 0,
      code: "not_configured",
    });
  }
  const url = `${base}/api/tenant/${encodeURIComponent(tenant.projectId)}/${path}`;
  const res = await fetch(url, {
    method: init.method,
    headers: {
      "content-type": "application/json",
      "x-plate-tenant-key": tenant.apiKey,
    },
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
  });
  const text = await res.text();
  const data = text ? safeParse(text) : null;
  if (!res.ok) {
    const code =
      (data as { error?: string } | null)?.error ??
      (res.status === 409 ? "module_disabled" : "request_failed");
    throw new TenantSdkError(code, { status: res.status, code });
  }
  return data as T;
}

function safeParse(s: string): unknown {
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
}

/* -------------------------------------------------------------------------- */
/* Resource helpers                                                            */
/* -------------------------------------------------------------------------- */

export interface ReservationRequest {
  name: string;
  partySize: number;
  requestedFor: number;
  phone?: string;
  email?: string;
  notes?: string;
  locationId?: string;
  customerId?: string;
}

export async function submitReservation(input: ReservationRequest) {
  return tenantFetch<{ status: string; reservation: Record<string, unknown> }>(
    "reservations",
    { method: "POST", body: input }
  );
}

/** Weekly opening sessions from Manage → Reservations (GET `reservation-hours`). */
export interface ReservationHoursApiResponse {
  weeklyHours: Record<
    string,
    Array<{ open: string; close: string }>
  >;
  /** Step between bookable time slots inside each session (15, 30, or 60). */
  slotIntervalMinutes?: number;
  /** Optional date-specific closures from admin (full day or blocked windows). */
  bookingOverrides?: Array<{
    date: string;
    closedAllDay?: boolean;
    closedWindows?: Array<{ open: string; close: string }>;
  }>;
}

export async function fetchReservationHours(): Promise<ReservationHoursApiResponse | null> {
  // Fetch whenever tenant credentials exist — not `modules.reservations.enabled`,
  // which is often stale in Snack while the server already has reservations + hours.
  if (!getTenantConfig()) return null;
  try {
    return await tenantFetch<ReservationHoursApiResponse>("reservation-hours", {
      method: "GET",
    });
  } catch {
    return null;
  }
}

export function useReservationHours() {
  return useFetched<ReservationHoursApiResponse>(
    getTenantConfig() ? "reservation-hours" : null
  );
}

export interface LeadRequest {
  kind: "catering" | "jobs";
  name: string;
  message: string;
  email?: string;
  phone?: string;
  meta?: Record<string, unknown>;
}

export async function submitLead(input: LeadRequest) {
  return tenantFetch<{ status: string; lead: Record<string, unknown> }>(
    "leads",
    { method: "POST", body: input }
  );
}

export interface CustomerProfile {
  deviceId: string;
  name?: string;
  email?: string;
  phone?: string;
  dietaryPrefs?: string[];
  favouriteItemIds?: string[];
  birthday?: string;
}

export async function upsertCustomer(input: CustomerProfile) {
  return tenantFetch<{ status: string; customer: Record<string, unknown> }>(
    "customers",
    { method: "POST", body: input }
  );
}

export async function registerPushToken(input: {
  expoPushToken: string;
  customerId?: string;
  platform?: string;
}) {
  return tenantFetch<{ status: string; id?: string; deduped?: boolean }>(
    "push-tokens",
    { method: "POST", body: input }
  );
}

export async function submitPhoto(input: {
  url: string;
  thumbnailUrl?: string;
  caption?: string;
  customerId?: string;
  submitterName?: string;
}) {
  return tenantFetch<{ status: string; photo: Record<string, unknown> }>(
    "photos",
    { method: "POST", body: input }
  );
}

/* -------------------------------------------------------------------------- */
/* Hooks for fetchable resources                                               */
/* -------------------------------------------------------------------------- */

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: TenantSdkError | null;
}

function useFetched<T>(path: string | null): FetchState<T> & { refresh: () => void } {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: !!path,
    error: null,
  });
  const aliveRef = useRef(true);
  useEffect(() => {
    aliveRef.current = true;
    return () => {
      aliveRef.current = false;
    };
  }, []);
  const load = useCallback(() => {
    if (!path) {
      setState({ data: null, loading: false, error: null });
      return;
    }
    setState((s) => ({ ...s, loading: true, error: null }));
    tenantFetch<T>(path, { method: "GET" })
      .then((data) => {
        if (!aliveRef.current) return;
        setState({ data, loading: false, error: null });
      })
      .catch((err: TenantSdkError) => {
        if (!aliveRef.current) return;
        setState({
          data: null,
          loading: false,
          error:
            err instanceof TenantSdkError
              ? err
              : new TenantSdkError(String(err), { status: 0, code: "unknown" }),
        });
      });
  }, [path]);
  useEffect(load, [load]);
  return { ...state, refresh: load };
}

export interface MenuApiResponse {
  items: Array<{
    id: string;
    name: string;
    description: string;
    price: string;
    category: string;
    image?: string | null;
    tags?: string[];
    eightySixed?: boolean;
  }>;
}
export function useMenu() {
  return useFetched<MenuApiResponse>(isModuleEnabled("menuCms") ? "menu" : null);
}

export interface PhotosApiResponse {
  photos: Array<{
    id: string;
    url: string;
    thumbnailUrl?: string | null;
    caption?: string;
    submitterName?: string;
    createdAt: number;
  }>;
}
export function usePhotos() {
  return useFetched<PhotosApiResponse>(
    isModuleEnabled("photoWall") ? "photos" : null
  );
}

export interface LocationsApiResponse {
  locations: Array<{
    id: string;
    name: string;
    address: string;
    phone?: string;
    mapsUrl?: string;
    hours?: { day: string; hours: string }[];
    primary?: boolean;
    heroImage?: string | null;
  }>;
}
export function useLocations() {
  return useFetched<LocationsApiResponse>(
    isModuleEnabled("multiLocation") ? "locations" : null
  );
}

/* -------------------------------------------------------------------------- */
/* Device id — used for customer accounts + push dedupe                        */
/* -------------------------------------------------------------------------- */

/**
 * Pseudo-random per-device id, persisted across app launches via
 * AsyncStorage. Having a stable id lets the `customers` collection look
 * the same user up every time they open the app, which is the foundation
 * loyalty + favourites are built on. If AsyncStorage fails (web, unusual
 * simulator state), we fall back to an in-memory id so the app still
 * works — it just won't remember them next launch.
 */
const DEVICE_ID_KEY = "plate.deviceId";
let cachedDeviceId: string | null = null;
let hydrationPromise: Promise<string> | null = null;

function freshDeviceId(): string {
  const rand = Math.random().toString(36).slice(2, 10);
  const stamp = Date.now().toString(36);
  return `d_${stamp}_${rand}`;
}

export function getDeviceId(): string {
  if (cachedDeviceId) return cachedDeviceId;
  cachedDeviceId = freshDeviceId();
  // Kick off an async hydration to promote a previously-stored id over
  // our freshly-minted one. Re-run the hydration only once per process.
  void hydrateDeviceId();
  return cachedDeviceId;
}

/**
 * Explicit hook-compatible hydration — returns the *persisted* device id,
 * upgrading the in-memory cache so subsequent `getDeviceId()` calls are
 * stable. Safe to call many times.
 */
export async function hydrateDeviceId(): Promise<string> {
  if (hydrationPromise) return hydrationPromise;
  hydrationPromise = (async () => {
    try {
      const AsyncStorage = (
        await import("@react-native-async-storage/async-storage")
      ).default;
      const existing = await AsyncStorage.getItem(DEVICE_ID_KEY);
      if (existing && existing.startsWith("d_")) {
        cachedDeviceId = existing;
        return existing;
      }
      const next = cachedDeviceId ?? freshDeviceId();
      cachedDeviceId = next;
      await AsyncStorage.setItem(DEVICE_ID_KEY, next);
      return next;
    } catch {
      cachedDeviceId = cachedDeviceId ?? freshDeviceId();
      return cachedDeviceId;
    }
  })();
  return hydrationPromise;
}

/** Hook wrapping {@link hydrateDeviceId} for convenience inside screens. */
export function useDeviceId(): { deviceId: string | null; loading: boolean } {
  const [state, setState] = useState<{ deviceId: string | null; loading: boolean }>(
    { deviceId: cachedDeviceId, loading: !cachedDeviceId }
  );
  useEffect(() => {
    let alive = true;
    void hydrateDeviceId().then((id) => {
      if (!alive) return;
      setState({ deviceId: id, loading: false });
    });
    return () => {
      alive = false;
    };
  }, []);
  return state;
}
