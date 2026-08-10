"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

/** Poll locally often; only call the API when a refresh is actually due. */
const CHECK_INTERVAL_MS = 60 * 1000;
const REFRESH_AHEAD_MS = 5 * 60 * 1000;

function getAccessExpiresAt(): number | null {
  const match = document.cookie.match(/(?:^|; )access_expires_at=([^;]*)/);
  if (!match) return null;

  const value = Number(decodeURIComponent(match[1]));
  return Number.isFinite(value) ? value : null;
}

export default function SessionKeepAlive({ enabled }: { enabled: boolean }) {
  const router = useRouter();
  const inFlight = useRef(false);
  const bootstrappedExpiry = useRef(false);

  useEffect(() => {
    if (!enabled) return;

    function shouldRefreshAccessToken(): boolean {
      const expiresAt = getAccessExpiresAt();

      // Older sessions may lack the readable expiry cookie — keep trying until set.
      if (expiresAt === null) {
        return !bootstrappedExpiry.current;
      }

      return Date.now() >= expiresAt - REFRESH_AHEAD_MS;
    }

    async function refreshSession() {
      if (
        inFlight.current ||
        document.visibilityState === "hidden" ||
        !shouldRefreshAccessToken()
      ) {
        return;
      }

      inFlight.current = true;

      try {
        const response = await fetch("/api/auth/refresh", {
          method: "POST",
          credentials: "same-origin",
        });

        if (response.status === 401) {
          router.replace("/login");
          router.refresh();
          return;
        }

        if (response.ok && getAccessExpiresAt() !== null) {
          bootstrappedExpiry.current = true;
        }
      } catch {
        // Network blips — next check or focus will retry.
      } finally {
        inFlight.current = false;
      }
    }

    void refreshSession();

    const intervalId = window.setInterval(refreshSession, CHECK_INTERVAL_MS);

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
