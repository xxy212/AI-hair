const steps = ["上传照片", "填写问卷", "AI 分析", "查看方案"];

export function FlowSteps({ current }: { current: number }) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {steps.map((step, index) => {
        const active = index <= current;
        return (
          <div key={step} className="min-w-0">
            <div className={`h-2 rounded-full ${active ? "bg-moss" : "bg-line"}`} />
            <p className={`mt-2 truncate text-xs ${active ? "font-semibold text-ink" : "text-muted"}`}>{step}</p>
          </div>
        );
      })}
    </div>
  );
}
