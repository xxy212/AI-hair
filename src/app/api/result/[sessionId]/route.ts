import { NextResponse } from "next/server";
import { memoryStore } from "@/lib/db/memoryStore";
import { trackServerEvent } from "@/lib/tracking/serverTrack";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await params;
  const result = memoryStore.aiResults.get(sessionId);
  if (!result) {
    return NextResponse.json({ error: "result_not_found" }, { status: 404 });
  }

  await trackServerEvent("result_page_viewed", {}, sessionId);
  return NextResponse.json(result);
}
