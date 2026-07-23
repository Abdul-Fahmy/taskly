"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function RecoveryHashRedirect() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const hash = window.location.hash.substring(1);
    if (!hash) return;

    const params = new URLSearchParams(hash);
    if (params.get("type") !== "recovery") return;

    const accessToken = params.get("access_token");
    if (!accessToken) return;

    if (pathname.startsWith("/reset-password")) {
      if (!window.location.search.includes("access_token")) {
        router.replace(`/reset-password?${hash}`);
      }
      return;
    }

    router.replace(`/reset-password?${hash}`);
  }, [pathname, router]);

  return null;
}
