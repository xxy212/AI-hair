import { randomUUID } from "crypto";
import { memoryStore } from "@/lib/db/memoryStore";
import { insertIfConfigured } from "@/lib/db/supabase";

export async function trackServerEvent(
  event_name: string,
  event_payload: Record<string, unknown> = {},
  session_id?: string | null
) {
  const event = {
    id: randomUUID(),
    session_id: session_id ?? null,
    event_name,
    event_payload,
    created_at: new Date().toISOString()
  };

  memoryStore.events.push(event);
  await insertIfConfigured("user_events", event);
  return event;
}
