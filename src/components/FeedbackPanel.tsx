"use client";

import { FormEvent, useState } from "react";
import { Send } from "lucide-react";
import type { UserFeedback } from "@/lib/types";

const feedbackOptions: Array<{ type: UserFeedback["feedback_type"]; label: string }> = [
  { type: "helpful", label: "这个结果有帮助" },
  { type: "inaccurate", label: "不太准确" },
  { type: "too_complex", label: "推荐太复杂" },
  { type: "too_expensive", label: "想要更低预算方案" }
];

export function FeedbackPanel({ sessionId }: { sessionId: string }) {
  const [feedbackType, setFeedbackType] = useState<UserFeedback["feedback_type"]>("helpful");
  const [feedbackText, setFeedbackText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        session_id: sessionId,
        feedback_type: feedbackType,
        feedback_text: feedbackText
      })
    });
    setSubmitted(true);
  }

  return (
    <form onSubmit={submit} className="compact-card p-5">
      <h2 className="text-xl font-bold text-ink">结果反馈</h2>
      <div className="mt-4 flex flex-wrap gap-2">
        {feedbackOptions.map((option) => (
          <button
            key={option.type}
            type="button"
            onClick={() => setFeedbackType(option.type)}
            className={`focus-ring rounded-lg border px-3 py-2 text-sm font-medium ${
              feedbackType === option.type
                ? "border-moss bg-moss text-white"
                : "border-line bg-white text-ink"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
      <textarea
        value={feedbackText}
        onChange={(event) => setFeedbackText(event.target.value)}
        className="focus-ring mt-4 min-h-24 w-full rounded-lg border border-line bg-white p-3 text-sm text-ink"
        placeholder="可以补充你觉得哪里不准、太复杂，或预算偏好。"
      />
      <button
        type="submit"
        className="focus-ring mt-3 inline-flex min-h-11 items-center gap-2 rounded-lg bg-moss px-4 py-2 font-semibold text-white transition hover:bg-ink"
      >
        <Send size={17} aria-hidden />
        提交反馈
      </button>
      {submitted ? <p className="mt-3 text-sm font-medium text-moss">已记录反馈。</p> : null}
    </form>
  );
}
