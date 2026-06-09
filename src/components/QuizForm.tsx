"use client";

import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2, ImagePlus } from "lucide-react";
import { FlowSteps } from "@/components/FlowSteps";
import { trackEvent } from "@/lib/tracking/trackEvent";
import type { QuizAnswers } from "@/lib/types";

const concernOptions = [
  "毛躁、蓬、炸，控制不住",
  "卷度不清晰，看起来只是乱不是卷",
  "效果持久度差，撑不了一天甚至睡一觉就散了",
  "全头卷度不一致，有的地方卷有的地方不卷",
  "其他"
];

const cgmOptions = [
  "没有，完全不知道从哪里开始",
  "了解过一些，但还没有系统尝试",
  "尝试过但坚持不下来，太麻烦或效果不明显",
  "有自己的护理流程，在坚持"
];

const cgmDurationOptions = ["半年以内", "半年到一年", "一年到两年", "两年以上"];

const cgmRoutineOptions = [
  "用无硅油洗发水",
  "洗发时会用发膜或护发素",
  "洗发后会用免洗护发素",
  "有用造型产品（弹力素 / 卷发霜 / 啫喱 / 摩丝）",
  "会分区用造型梳或手指造型",
  "会用「咕叽咕叽」手法让护发素或造型产品充分吸收",
  "用微纤维毛巾或散水帽控水",
  "会用烘干罩烘干头发",
  "会用精油或护发油收尾"
];

const chemicalOptions = [
  "没有，保持原生发质",
  "染过色（包括挑染）",
  "烫过（离子烫拉直 / 热烫卷）",
  "染和烫都做过"
];

const porosityOptions = [
  {
    label: "很难打湿，水像滑过去一样",
    sub: "低孔隙度，产品不易吸收"
  },
  {
    label: "正常，几秒就湿透",
    sub: "中等孔隙度"
  },
  {
    label: "很快就湿透，几乎瞬间吸水",
    sub: "高孔隙度，容易吸收也容易流失水分"
  }
];

const regionOptions = [
  { label: "华南", sub: "广东 广西 海南 福建" },
  { label: "华东", sub: "上海 江苏 浙江 安徽" },
  { label: "华中", sub: "湖南 湖北 江西 河南" },
  { label: "华北 / 东北", sub: "北京 天津 河北 东三省" },
  { label: "西南", sub: "四川 云南 贵州 重庆" },
  { label: "西北", sub: "陕西 新疆 甘肃 宁夏" }
];

const budgetOptions = ["50 元以内", "50 - 150 元", "150 - 300 元", "300 元以上"];

const productStatusOptions = [
  "已上传产品照片",
  "现在不方便拍照，手动输入产品名",
  "先跳过，之后在聊天里补充"
];

const defaultAnswers: QuizAnswers = {
  main_concerns: [],
  cgm_experience: "",
  cgm_duration: "",
  cgm_routine: [],
  chemical_history: "",
  porosity: "",
  region: "",
  budget: "",
  current_products_status: "",
  current_product_names: "",
  product_photo_count: 0
};

function toggleValue(values: string[], option: string) {
  return values.includes(option)
    ? values.filter((item) => item !== option)
    : [...values, option];
}

export function QuizForm() {
  const router = useRouter();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<QuizAnswers>(defaultAnswers);
  const [productFileLabel, setProductFileLabel] = useState("支持多张，拍产品背面成分表更佳");
  const startedAt = useRef(0);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const id = window.localStorage.getItem("haircare:sessionId");
      setSessionId(id);
      startedAt.current = Date.now();
      trackEvent("quiz_started", {}, id);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const completed =
    answers.main_concerns.length > 0 &&
    Boolean(answers.cgm_experience) &&
    Boolean(answers.chemical_history) &&
    Boolean(answers.porosity) &&
    Boolean(answers.region) &&
    Boolean(answers.budget) &&
    Boolean(answers.current_products_status);

  function selectSingle(key: keyof QuizAnswers, option: string) {
    setAnswers((current) => ({ ...current, [key]: option }));
  }

  function selectMulti(key: "main_concerns" | "cgm_routine", option: string) {
    setAnswers((current) => ({
      ...current,
      [key]: toggleValue(current[key] ?? [], option)
    }));
  }

  function onProductFiles(event: ChangeEvent<HTMLInputElement>) {
    const count = event.target.files?.length ?? 0;
    if (!count) return;
    setProductFileLabel(`已选择 ${count} 张产品照片`);
    setAnswers((current) => ({
      ...current,
      current_products_status: "已上传产品照片",
      product_photo_count: count
    }));
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!completed || !sessionId) return;
    window.localStorage.setItem("haircare:quizAnswers", JSON.stringify(answers));
    await trackEvent("quiz_completed", { duration_ms: Date.now() - startedAt.current }, sessionId);
    router.push("/analyzing");
  }

  return (
    <main className="page-shell">
      <FlowSteps current={1} />
      <form onSubmit={submit} className="mt-8 grid gap-5">
        <div>
          <p className="text-sm font-semibold text-coral">自然卷护理问卷</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl">先确认你的护理状态</h1>
          <p className="mt-3 max-w-2xl text-muted">
            新问卷会综合烦恼、CGM 经验、染烫、孔隙度、地区气候、预算和现有产品来生成方案。
          </p>
        </div>

        <QuestionCard eyebrow="问题 01" title="你现在头发最让你烦恼的是什么？" hint="可多选，选完后继续">
          <ChoiceGrid>
            {concernOptions.map((option) => (
              <ChoiceButton
                key={option}
                selected={answers.main_concerns.includes(option)}
                onClick={() => selectMulti("main_concerns", option)}
              >
                {option}
                {option === "其他" ? <span className="block text-xs text-muted">选完后可在聊天里补充说明</span> : null}
              </ChoiceButton>
            ))}
          </ChoiceGrid>
        </QuestionCard>

        <QuestionCard eyebrow="问题 02" title="你有尝试过 CGM（自然卷护理法）吗？" hint="CGM 即 Curly Girl Method，专门针对自然卷的护理体系">
          <ChoiceGrid>
            {cgmOptions.map((option) => (
              <ChoiceButton
                key={option}
                selected={answers.cgm_experience === option}
                onClick={() => selectSingle("cgm_experience", option)}
              >
                {option}
              </ChoiceButton>
            ))}
          </ChoiceGrid>

          {answers.cgm_experience === "有自己的护理流程，在坚持" ? (
            <div className="mt-4 rounded-lg border border-line bg-paper p-4">
              <p className="font-semibold text-ink">你的护理流程坚持多久了？</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {cgmDurationOptions.map((option) => (
                  <ChoiceButton
                    key={option}
                    selected={answers.cgm_duration === option}
                    onClick={() => selectSingle("cgm_duration", option)}
                    center
                  >
                    {option}
                  </ChoiceButton>
                ))}
              </div>

              <p className="mt-5 font-semibold text-ink">你现在的护理流程大概是怎样的？</p>
              <div className="mt-3 grid gap-2">
                {cgmRoutineOptions.map((option) => (
                  <ChoiceButton
                    key={option}
                    selected={(answers.cgm_routine ?? []).includes(option)}
                    onClick={() => selectMulti("cgm_routine", option)}
                  >
                    {option}
                  </ChoiceButton>
                ))}
              </div>
            </div>
          ) : null}
        </QuestionCard>

        <QuestionCard eyebrow="问题 03" title="你的头发有染或烫过吗？" hint="这会影响发质健康度和适合的产品成分">
          <ChoiceGrid>
            {chemicalOptions.map((option) => (
              <ChoiceButton
                key={option}
                selected={answers.chemical_history === option}
                onClick={() => selectSingle("chemical_history", option)}
              >
                {option}
              </ChoiceButton>
            ))}
          </ChoiceGrid>
        </QuestionCard>

        <QuestionCard eyebrow="问题 04" title="洗头的时候，头发容不容易打湿？" hint="这帮助我们判断你的发质孔隙度，影响产品吸收方式">
          <ChoiceGrid>
            {porosityOptions.map((option) => (
              <ChoiceButton
                key={option.label}
                selected={answers.porosity === option.label}
                onClick={() => selectSingle("porosity", option.label)}
              >
                {option.label}
                <span className="block text-xs text-muted">{option.sub}</span>
              </ChoiceButton>
            ))}
          </ChoiceGrid>
        </QuestionCard>

        <QuestionCard eyebrow="问题 05" title="你主要生活在哪个地区？" hint="气候会影响产品选择，南方湿热和北方干燥的方案很不一样">
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {regionOptions.map((option) => (
              <ChoiceButton
                key={option.label}
                selected={answers.region === option.label}
                onClick={() => selectSingle("region", option.label)}
                center
              >
                <span className="font-semibold">{option.label}</span>
                <span className="block text-xs text-muted">{option.sub}</span>
              </ChoiceButton>
            ))}
          </div>
        </QuestionCard>

        <QuestionCard eyebrow="问题 06" title="你对单品的预算大概是多少？" hint="以 250ml 容量为参考">
          <div className="grid gap-2 sm:grid-cols-2">
            {budgetOptions.map((option) => (
              <ChoiceButton
                key={option}
                selected={answers.budget === option}
                onClick={() => selectSingle("budget", option)}
                center
              >
                {option}
              </ChoiceButton>
            ))}
          </div>
        </QuestionCard>

        <QuestionCard eyebrow="问题 07" title="你现在在用什么护理产品？" hint="上传照片，或先选择跳过方式，后续也可以在反馈里补充。">
          <label className="block rounded-lg border-2 border-dashed border-line bg-white p-6 text-center transition hover:border-moss">
            <input type="file" multiple accept="image/*" className="sr-only" onChange={onProductFiles} />
            <ImagePlus className="mx-auto text-moss" size={30} aria-hidden />
            <p className="mt-3 font-semibold text-ink">点击上传产品照片</p>
            <p className="mt-1 text-sm text-muted">{productFileLabel}</p>
          </label>

          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {productStatusOptions.slice(1).map((option) => (
              <ChoiceButton
                key={option}
                selected={answers.current_products_status === option}
                onClick={() => selectSingle("current_products_status", option)}
                center
              >
                {option}
              </ChoiceButton>
            ))}
          </div>

          {answers.current_products_status === "现在不方便拍照，手动输入产品名" ? (
            <textarea
              value={answers.current_product_names ?? ""}
              onChange={(event) => selectSingle("current_product_names", event.target.value)}
              className="focus-ring mt-3 min-h-24 w-full rounded-lg border border-line bg-white p-3 text-sm text-ink"
              placeholder="例如：某某洗发水、某某护发素、弹力素..."
            />
          ) : null}
        </QuestionCard>

        <button
          type="submit"
          disabled={!completed}
          className="focus-ring inline-flex min-h-12 w-fit items-center gap-2 rounded-lg bg-moss px-5 py-3 font-semibold text-white transition hover:bg-ink disabled:cursor-not-allowed disabled:opacity-60"
        >
          <ArrowRight size={18} aria-hidden />
          生成我的护理方案
        </button>
      </form>
    </main>
  );
}

function QuestionCard({
  eyebrow,
  title,
  hint,
  children
}: {
  eyebrow: string;
  title: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="compact-card p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-coral">{eyebrow}</p>
      <legend className="mt-2 text-xl font-bold text-ink">{title}</legend>
      <p className="mt-2 text-sm text-muted">{hint}</p>
      <div className="mt-5">{children}</div>
    </fieldset>
  );
}

function ChoiceGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-2">{children}</div>;
}

function ChoiceButton({
  selected,
  onClick,
  center = false,
  children
}: {
  selected: boolean;
  onClick: () => void;
  center?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`focus-ring relative min-h-12 rounded-lg border px-4 py-3 text-sm font-medium transition ${
        center ? "text-center" : "text-left"
      } ${
        selected
          ? "border-moss bg-[#e3ecdf] text-ink"
          : "border-line bg-white text-ink hover:border-moss"
      }`}
    >
      {selected ? <CheckCircle2 className="absolute right-3 top-3 text-moss" size={16} aria-hidden /> : null}
      <span className="block pr-6">{children}</span>
    </button>
  );
}
