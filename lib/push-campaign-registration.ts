import { useEffect } from "react";
import { Platform } from "react-native";
import { getTenantConfig, registerPushToken } from "./platform";
import { registerForPushNotificationsAsync } from "./notifications";
import { restaurantConfig } from "../restaurant.config";

/**
 * Registers the device with the Plate backend when push campaigns are enabled.
 * Safe to call on every app launch; backend dedupes by Expo push token.
 */
export function usePushCampaignRegistration(): void {
  useEffect(() => {
    if (Platform.OS === "web") return;
    if (!restaurantConfig.modules?.pushCampaigns?.enabled) return;
    if (!getTenantConfig()) return;

    let cancelled = false;

    async function run() {
      try {
        const expoPushToken = await registerForPushNotificationsAsync();
        if (!expoPushToken || cancelled) {
          console.warn("[push] Token unavailable. Check notification permission/project id.");
          return;
        }
        await registerPushToken({
          expoPushToken,
          platform: Platform.OS,
        });
      } catch (err) {
        if (cancelled) return;
        const message = err instanceof Error ? err.message : String(err);
        console.warn(`[push] Registration failed: ${message}`);
      }
    }

    void run();
    return () => {
      cancelled = true;
    };
  }, []);
}
