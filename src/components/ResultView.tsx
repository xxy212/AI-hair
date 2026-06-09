"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle, ArrowLeft, BadgeCheck, Sparkles } from "lucide-react";
import { FeedbackPanel } from "@/components/FeedbackPanel";
import { FlowSteps } from "@/components/FlowSteps";
import { ProductCard } from "@/components/ProductCard";
import { TutorialStep } from "@/components/TutorialStep";
import { trackEvent } from "@/lib/tracking/trackEvent";
import type { AiResult } from "@/lib/types";

export function ResultView({ sessionId }: { sessionId: string }) {
  const [result, setResult] = useState<AiResult | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setImagePreview(window.localStorage.getItem("haircare:imagePreview"));
      const cached = window.localStorage.getItem(`haircare:result:${sessionId}`);
      if (cached) {
        setResult(JSON.parse(cached) as AiResult);
        await trackEvent("result_page_viewed", { source: "local_cache" }, sessionId);
        return;
      }

      const response = await fetch(`/api/result/${sessionId}`);
      if (!response.ok) {
        setNotFound(true);
        return;
      }
      const data = (await response.json()) as AiResult;
      setResult(data);
      window.localStorage.setItem(`haircare:result:${sessionId}`, JSON.stringify(data));
    }

    const timer = window.setTimeout(() => {
      load();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [sessionId]);

  if (notFound) {
    return (
      <main className="page-shell">
        <div className="compact-card mt-8 p-6">
          <AlertCircle className="text-coral" aria-hidden />
          <h1 className="mt-4 text-2xl font-bold text-ink">没有找到这次分析结果</h1>
          <Link href="/" className="focus-ring mt-4 inline-flex items-center gap-2 rounded-lg bg-moss px-4 py-2 font-semibold text-white">
            <ArrowLeft size={17} aria-hidden />
            回到首页
          </Link>
        </div>
      </main>
    );
  }

  if (!result) {
    return (
      <main className="page-shell">
        <FlowSteps current={3} />
        <div className="compact-card mt-8 p-6 text-muted">正在读取结果...</div>
      </main>
    );
  }

  return (
    <main className="page-shell">
      <FlowSteps current={3} />
      <section className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="compact-card overflow-hidden">
          {imagePreview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imagePreview} alt="用户上传的头发照片预览" className="h-80 w-full object-cover" />
          ) : (
            <div className="hair-visual h-80 w-full" />
          )}
          <div className="p-5">
            <p className="text-sm font-semibold text-coral">发质画像</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink">{result.hair_profile.profile_title}</h1>
            <p className="mt-3 leading-7 text-muted">{result.hair_profile.hair_summary}</p>
          </div>
        </div>

        <div className="grid gap-4">
          <section className="compact-card p-5">
            <div className="flex items-center gap-2">
              <Sparkles className="text-moss" size={20} aria-hidden />
              <h2 className="text-xl font-bold text-ink">初步判断</h2>
            </div>
            <dl className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg bg-paper p-3">
                <dt className="text-xs font-semibold text-muted">卷度</dt>
                <dd className="mt-1 font-medium text-ink">{result.photo_analysis.curl_pattern_guess}</dd>
              </div>
              <div className="rounded-lg bg-paper p-3">
                <dt className="text-xs font-semibold text-muted">毛躁</dt>
                <dd className="mt-1 font-medium text-ink">{result.photo_analysis.frizz_level}</dd>
              </div>
              <div className="rounded-lg bg-paper p-3">
                <dt className="text-xs font-semibold text-muted">发量</dt>
                <dd className="mt-1 font-medium text-ink">{result.photo_analysis.volume_level}</dd>
              </div>
              <div className="rounded-lg bg-paper p-3">
                <dt className="text-xs font-semibold text-muted">发尾</dt>
                <dd className="mt-1 font-medium text-ink">{result.photo_analysis.dryness_guess}</dd>
              </div>
            </dl>
          </section>

          <section className="compact-card p-5">
            <h2 className="text-xl font-bold text-ink">当前护理策略</h2>
            <p className="mt-3 leading-7 text-muted">{result.hair_profile.care_strategy}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {result.hair_profile.main_concerns.map((concern) => (
                <span key={concern} className="rounded-lg bg-sky px-3 py-1 text-sm font-medium text-ink">
                  {concern}
                </span>
              ))}
            </div>
          </section>
        </div>
      </section>

      <section className="section-band">
        <h2 className="text-2xl font-bold text-ink">产品类型建议</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {result.recommendations.recommended_categories.map((category) => (
            <article key={category.category} className="compact-card p-5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-semibold text-ink">{category.category}</h3>
                <span className="rounded-lg bg-moss px-2 py-1 text-xs font-semibold text-white">{category.priority}</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-muted">{category.why_needed}</p>
              <p className="mt-3 text-sm font-medium text-ink">{category.how_to_choose}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-band !pt-0">
        <h2 className="text-2xl font-bold text-ink">示例产品</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {result.recommendations.example_products.map((product) => (
            <ProductCard key={product.id} product={product} sessionId={sessionId} />
          ))}
        </div>
      </section>

      <section className="section-band !pt-0">
        <h2 className="text-2xl font-bold text-ink">护理教程</h2>
        <div className="mt-4 grid gap-3">
          {result.tutorial.wash_day_tutorial.map((item) => (
            <TutorialStep key={item.step} item={item} />
          ))}
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <article className="compact-card p-5">
            <h3 className="font-semibold text-ink">第二天 refresh</h3>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-muted">
              {result.tutorial.refresh_tutorial.map((tip) => (
                <li key={tip} className="flex gap-2">
                  <BadgeCheck className="mt-0.5 shrink-0 text-moss" size={16} aria-hidden />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </article>
          <article className="compact-card p-5">
            <h3 className="font-semibold text-ink">新手避坑</h3>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-muted">
              {result.tutorial.beginner_tips.map((tip) => (
                <li key={tip} className="flex gap-2">
                  <BadgeCheck className="mt-0.5 shrink-0 text-moss" size={16} aria-hidden />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className="section-band !pt-0">
        <FeedbackPanel sessionId={sessionId} />
      </section>
    </main>
  );
}
