import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { memoryStore } from "@/lib/db/memoryStore";
import { insertIfConfigured } from "@/lib/db/supabase";
import { trackServerEvent } from "@/lib/tracking/serverTrack";
import type { UserSession } from "@/lib/types";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const source = typeof body.source === "string" ? body.source : "home";
  const session: UserSession = {
    id: randomUUID(),
    created_at: new Date().toISOString(),
    source,
    status: "started",
    current_step: "upload",
    completed_at: null
  };

  memoryStore.sessions.set(session.id, session);
  await insertIfConfigured("user_sessions", session);
  await trackServerEvent("click_start_test", { source }, session.id);

  return NextResponse.json({ session_id: session.id });
}
