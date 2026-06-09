"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { FlowSteps } from "@/components/FlowSteps";
import { trackEvent } from "@/lib/tracking/trackEvent";
import type { AiResult, QuizAnswers } from "@/lib/types";

export function AnalyzeRunner() {
  const router = useRouter();
  const [statusIndex, setStatusIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const messages = useMemo(
    () => [
      "正在分析你的卷度和毛躁情况",
      "正在结合问卷生成发质画像",
      "正在匹配适合新手的产品类型",
      "正在生成洗头日护理教程"
    ],
    []
  );

  useEffect(() => {
    const timer = window.setInterval(() => {
      setStatusIndex((current) => (current + 1) % messages.length);
    }, 900);
    return () => window.clearInterval(timer);
  }, [messages.length]);

  useEffect(() => {
    async function run() {
      const sessionId = window.localStorage.getItem("haircare:sessionId");
      const rawAnswers = window.localStorage.getItem("haircare:quizAnswers");
      const imageUrl = window.localStorage.getItem("haircare:imageUrl") ?? "";
      if (!sessionId || !rawAnswers) {
        setError("缺少测试数据，请从首页重新开始。");
        return;
      }

      try {
        await trackEvent("ai_analysis_started", {}, sessionId);
        const quizAnswers = JSON.parse(rawAnswers) as QuizAnswers;
        const response = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            session_id: sessionId,
            image_url: imageUrl,
            quiz_answers: quizAnswers
          })
        });
        if (!response.ok) throw new Error("analysis_failed");
        const result = (await response.json()) as AiResult;
        window.localStorage.setItem(`haircare:result:${sessionId}`, JSON.stringify(result));
        router.replace(`/result/${sessionId}`);
      } catch {
        setError("AI 分析暂时失败，请返回问卷页重新提交。");
      }
    }

    run();
  }, [router]);

  return (
    <main className="page-shell">
      <FlowSteps current={2} />
      <section className="mt-8 grid min-h-[520px] place-items-center">
        <div className="compact-card w-full max-w-2xl p-7 text-center">
          <div className="hair-visual mx-auto h-32 w-32 rounded-lg border border-line" />
          <Loader2 className="mx-auto mt-6 animate-spin text-moss" size={30} aria-hidden />
          <h1 className="mt-5 text-2xl font-bold text-ink">{error ?? messages[statusIndex]}</h1>
          <div className="mt-6 grid gap-3 text-left">
            {messages.map((message, index) => (
              <div key={message} className={`compact-card p-3 ${index === statusIndex ? "pulse-step" : ""}`}>
                <span className="text-sm font-medium text-muted">{message}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
