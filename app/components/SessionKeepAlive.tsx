"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

/** Refresh a bit before the typical 1h Supabase access token expires. */
const REFRESH_INTERVAL_MS = 45 * 60 * 1000;

export default function SessionKeepAlive({ enabled }: { enabled: boolean }) {
  const router = useRouter();
  const inFlight = useRef(false);

  useEffect(() => {
    if (!enabled) return;

    async function refreshSession() {
      if (inFlight.current || document.visibilityState === "hidden") return;

      inFlight.current = true;
      try {
        const response = await fetch("/api/auth/refresh", {
          method: "POST",
          credentials: "same-origin",
        });

        if (response.status === 401) {
          router.replace("/login");
          router.refresh();
        }
      } catch {
        // Network blips — keep the tab open; next tick or focus will retry.
      } finally {
        inFlight.current = false;
      }
    }

    void refreshSession();

    const intervalId = window.setInterval(refreshSession, REFRESH_INTERVAL_MS);

    function onVisibilityChange() {
      if (document.visibilityState === "visible") {
        void refreshSession();
      }
    }

    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [enabled, router]);

  return null;
}
