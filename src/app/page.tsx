import { Camera, ClipboardList, PackageCheck, Scissors, ShieldCheck } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { CaseCard } from "@/components/CaseCard";
import { FeatureCard } from "@/components/FeatureCard";
import { HomeTracker } from "@/components/HomeTracker";
import { StartTestButton } from "@/components/StartTestButton";

export default function HomePage() {
  return (
    <>
      <HomeTracker />
      <AppHeader />
      <main className="page-shell">
        <section className="grid items-center gap-8 py-8 lg:grid-cols-[1.05fr_0.95fr] lg:py-14">
          <div>
            <p className="text-sm font-semibold text-coral">AI 自然卷护理助手</p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-ink sm:text-6xl">
              为自然卷新手生成一套可执行护理方案
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">
              上传头发照片并完成基础问卷，获得发质画像、产品类型建议、示例产品和洗头日教程。
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <StartTestButton />
              <span className="inline-flex items-center gap-2 text-sm text-muted">
                <ShieldCheck size={17} className="text-moss" aria-hidden />
                照片仅用于生成护理参考建议
              </span>
            </div>
          </div>
          <div className="compact-card overflow-hidden">
            <div className="hair-visual h-96 w-full" />
            <div className="grid gap-3 p-5">
              <div className="rounded-lg bg-paper p-4">
                <p className="text-xs font-semibold text-coral">今日方案</p>
                <p className="mt-1 font-semibold text-ink">轻中度自然卷新手 routine</p>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center text-sm font-medium text-ink">
                <span className="rounded-lg bg-sky p-3">保湿</span>
                <span className="rounded-lg bg-[#dfead8] p-3">定型</span>
                <span className="rounded-lg bg-[#f3d9d2] p-3">避坑</span>
              </div>
            </div>
          </div>
        </section>

        <section className="section-band">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-coral">示例案例</p>
              <h2 className="mt-2 text-3xl font-bold text-ink">首版先用模拟案例验证体验</h2>
            </div>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <CaseCard
              title="建立基础 routine"
              description="从不知道每次洗头该做什么，变成洗发、护发、湿发造型三步固定。"
              tags={["新手", "低预算", "基础护理"]}
            />
            <CaseCard
              title="处理毛躁和打结"
              description="优先补足发中到发尾保湿，再减少毛巾摩擦和高温直吹。"
              tags={["毛躁", "干枯", "发尾"]}
            />
            <CaseCard
              title="减少产品选择焦虑"
              description="先推荐产品类型和使用顺序，再给少量示例产品作为参考。"
              tags={["产品建议", "教程", "反馈"]}
            />
          </div>
        </section>

        <section className="section-band !pt-0">
          <p className="text-sm font-semibold text-coral">P0 功能</p>
          <h2 className="mt-2 text-3xl font-bold text-ink">跑通从照片到结果的完整闭环</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <FeatureCard icon={Camera} title="上传照片辅助分析" description="记录上传行为，生成可展示的本地预览。" />
            <FeatureCard icon={ClipboardList} title="问卷生成发质画像" description="收集头皮、发量、预算、目标和已有产品。" />
            <FeatureCard icon={PackageCheck} title="产品类型和示例产品" description="优先给产品类型，再匹配少量种子产品。" />
            <FeatureCard icon={Scissors} title="洗头日护理教程" description="输出固定结构的步骤、refresh 和新手避坑。" />
          </div>
        </section>
      </main>
    </>
  );
}
