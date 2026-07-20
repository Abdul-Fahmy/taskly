"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const hash = window.location.hash.substring(1);
    if (hash) {
      const params = new URLSearchParams(hash);
      if (params.get("type") === "recovery" && params.get("access_token")) {
        router.replace(`/reset-password?${hash}`);
        return;
      }
    }

    fetch("/api/user")
      .then((res) => {
        router.replace(res.ok ? "/project" : "/login");
      })
      .catch(() => {
        router.replace("/login");
      });
  }, [router]);

  return null;
}
