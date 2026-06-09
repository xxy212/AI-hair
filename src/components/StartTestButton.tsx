"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";
import { trackEvent } from "@/lib/tracking/trackEvent";

export function StartTestButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function start() {
    setIsLoading(true);
    await trackEvent("click_start_test", { source: "home_cta" });
    const response = await fetch("/api/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ source: "home" })
    });
    const data = (await response.json()) as { session_id: string };
    window.localStorage.setItem("haircare:sessionId", data.session_id);
    router.push("/upload");
  }

  return (
    <button
      type="button"
      onClick={start}
      disabled={isLoading}
      className="focus-ring inline-flex min-h-12 items-center gap-2 rounded-lg bg-moss px-5 py-3 font-semibold text-white transition hover:bg-ink disabled:cursor-not-allowed disabled:opacity-70"
    >
      {isLoading ? <Loader2 size={18} className="animate-spin" aria-hidden /> : <ArrowRight size={18} aria-hidden />}
      开始发质测试
    </button>
  );
}
