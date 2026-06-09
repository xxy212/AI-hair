"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/tracking/trackEvent";

export function HomeTracker() {
  useEffect(() => {
    trackEvent("page_view_home", { path: "/" });
  }, []);

  return null;
}
