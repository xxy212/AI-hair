import { NextResponse } from "next/server";
import { z } from "zod";
import { trackServerEvent } from "@/lib/tracking/serverTrack";

const schema = z.object({
  session_id: z.string().nullable().optional(),
  event_name: z.string().min(1),
  event_payload: z.record(z.unknown()).optional().default({})
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  await trackServerEvent(
    parsed.data.event_name,
    parsed.data.event_payload,
    parsed.data.session_id
  );

  return NextResponse.json({ success: true });
}
