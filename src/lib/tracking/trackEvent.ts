"use client";

export async function trackEvent(
  event_name: string,
  event_payload: Record<string, unknown> = {},
  session_id?: string | null
) {
  try {
    await fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event_name, event_payload, session_id })
    });
  } catch {
    // Tracking must never block the user flow.
  }
}
