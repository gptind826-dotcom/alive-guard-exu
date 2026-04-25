import { useCallback, useRef } from "react";
import type { PingResult } from "@/types/api";

const NOTIFICATION_SOUND_URL = "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbsGczGSN0q9vTn1Y0HySCt+Hcm1FAJC2Bst7WlEg6JzSIvOXejks5IiuGtOLXh0M7LjmOxerbjUM0LDCFseHSfj8zLjKPx+3hg0BIMDGSwfPkAA==";

export function useNotifications(soundEnabled: boolean, notificationsEnabled: boolean) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const previousStatusRef = useRef<Map<string, string>>(new Map());

  const playAlertSound = useCallback(() => {
    if (!soundEnabled) return;
    try {
      if (!audioRef.current) {
        audioRef.current = new Audio(NOTIFICATION_SOUND_URL);
      }
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    } catch {}
  }, [soundEnabled]);

  const sendBrowserNotification = useCallback(
    (title: string, body: string) => {
      if (!notificationsEnabled) return;
      if (Notification.permission === "granted") {
        new Notification(title, { body, icon: "/favicon.ico" });
      }
    },
    [notificationsEnabled]
  );

  const requestPermission = useCallback(async () => {
    if (notificationsEnabled && Notification.permission === "default") {
      await Notification.requestPermission();
    }
  }, [notificationsEnabled]);

  const checkForOffline = useCallback(
    (results: PingResult[]) => {
      for (const r of results) {
        const prev = previousStatusRef.current.get(r.endpointId);
        if (prev === "online" && r.status !== "online") {
          playAlertSound();
          sendBrowserNotification(
            "⚠️ EXU X MAFU Alert",
            `Endpoint ${r.url} went OFFLINE!`
          );
        }
        previousStatusRef.current.set(r.endpointId, r.status);
      }
    },
    [playAlertSound, sendBrowserNotification]
  );

  return { checkForOffline, requestPermission };
}
