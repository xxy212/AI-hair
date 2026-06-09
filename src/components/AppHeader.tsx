import Link from "next/link";
import { Sparkles } from "lucide-react";

export function AppHeader() {
  return (
    <header className="page-shell flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2 font-semibold text-ink">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-moss text-white">
          <Sparkles size={17} aria-hidden />
        </span>
        AI 自然卷护理助手
      </Link>
      <span className="hidden text-sm text-muted sm:block">护理参考建议，非专业诊断</span>
    </header>
  );
}
