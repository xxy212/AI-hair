import { NextResponse } from "next/server";
import { z } from "zod";
import { generateResult } from "@/lib/ai/generateResult";
import { memoryStore } from "@/lib/db/memoryStore";
import { insertIfConfigured } from "@/lib/db/supabase";
import { trackServerEvent } from "@/lib/tracking/serverTrack";

const analyzeSchema = z.object({
  session_id: z.string().min(1),
  image_url: z.string().optional().default(""),
  quiz_answers: z.object({
    main_concerns: z.array(z.string()),
    cgm_experience: z.string().min(1),
    cgm_duration: z.string().optional().default(""),
    cgm_routine: z.array(z.string()).optional().default([]),
    chemical_history: z.string().min(1),
    porosity: z.string().min(1),
    region: z.string().min(1),
    budget: z.string().min(1),
    current_products_status: z.string().min(1),
    current_product_names: z.string().optional().default(""),
    product_photo_count: z.number().optional().default(0)
  })
});

export async function POST(request: Request) {
  const startedAt = Date.now();
  const parsed = analyzeSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_payload", details: parsed.error.flatten() }, { status: 400 });
  }

  const { session_id, quiz_answers } = parsed.data;
  await trackServerEvent("ai_analysis_started", {}, session_id);

  try {
    memoryStore.quizAnswers.set(session_id, {
      ...quiz_answers,
      session_id,
      created_at: new Date().toISOString()
    });

    await insertIfConfigured("quiz_answers", {
      session_id,
      ...quiz_answers
    });

    const result = await generateResult(session_id, quiz_answers);
    result.latency_ms = Date.now() - startedAt;
    memoryStore.aiResults.set(session_id, result);

    const session = memoryStore.sessions.get(session_id);
    if (session) {
      session.status = "completed";
      session.current_step = "result";
      session.completed_at = new Date().toISOString();
      memoryStore.sessions.set(session_id, session);
    }

    await insertIfConfigured("ai_results", {
      session_id,
      photo_analysis: result.photo_analysis,
      hair_profile: result.hair_profile,
      recommendations: result.recommendations,
      tutorial: result.tutorial,
      ai_model: result.ai_model,
      latency_ms: result.latency_ms,
      is_success: result.is_success,
      error_message: result.error_message
    });

    await trackServerEvent(
      "ai_analysis_completed",
      { latency_ms: result.latency_ms, valid_json: true, model: result.ai_model },
      session_id
    );

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown_error";
    await trackServerEvent("ai_analysis_failed", { error_message: message }, session_id);
    return NextResponse.json({ error: "analysis_failed", message }, { status: 500 });
  }
}
