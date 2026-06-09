import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { memoryStore } from "@/lib/db/memoryStore";
import { insertIfConfigured } from "@/lib/db/supabase";
import { trackServerEvent } from "@/lib/tracking/serverTrack";
import type { UploadedImage } from "@/lib/types";

export async function POST(request: Request) {
  const formData = await request.formData().catch(() => null);
  const sessionId = formData?.get("session_id");
  const file = formData?.get("file");

  if (typeof sessionId !== "string" || !(file instanceof File)) {
    return NextResponse.json({ error: "missing_session_or_file" }, { status: 400 });
  }

  const imageId = randomUUID();
  const image: UploadedImage = {
    id: imageId,
    session_id: sessionId,
    image_url: `local-preview://${imageId}`,
    storage_path: `mvp-private/${imageId}-${file.name}`,
    upload_status: "success",
    created_at: new Date().toISOString()
  };

  memoryStore.images.set(imageId, image);

  const session = memoryStore.sessions.get(sessionId);
  if (session) {
    session.current_step = "quiz";
    memoryStore.sessions.set(sessionId, session);
  }

  await insertIfConfigured("uploaded_images", image);
  await trackServerEvent(
    "upload_photo_success",
    { image_id: imageId, file_name: file.name, file_size: file.size, file_type: file.type },
    sessionId
  );

  return NextResponse.json({
    image_id: imageId,
    image_url: image.image_url
  });
}
