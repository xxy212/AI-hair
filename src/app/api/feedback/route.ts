import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { memoryStore } from "@/lib/db/memoryStore";
import { insertIfConfigured } from "@/lib/db/supabase";
import { trackServerEvent } from "@/lib/tracking/serverTrack";
import type { UserFeedback } from "@/lib/types";

const schema = z.object({
  session_id: z.string().min(1),
  feedback_type: z.enum(["helpful", "inaccurate", "too_complex", "too_expensive"]),
  feedback_text: z.string().optional().default("")
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  const feedback: UserFeedback = {
    id: randomUUID(),
    session_id: parsed.data.session_id,
    feedback_type: parsed.data.feedback_type,
    feedback_text: parsed.data.feedback_text,
    created_at: new Date().toISOString()
  };

  memoryStore.feedback.push(feedback);
  await insertIfConfigured("user_feedback", feedback);
  await trackServerEvent("feedback_submitted", { feedback_type: feedback.feedback_type }, feedback.session_id);

  return NextResponse.json({ success: true });
}
