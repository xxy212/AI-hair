import type { TutorialStep as TutorialStepType } from "@/lib/types";

export function TutorialStep({ item }: { item: TutorialStepType }) {
  return (
    <article className="flex gap-4 rounded-lg border border-line bg-white p-4">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-moss text-sm font-bold text-white">
        {item.step}
      </span>
      <div>
        <h3 className="font-semibold text-ink">{item.title}</h3>
        <p className="mt-1 text-sm leading-6 text-muted">{item.detail}</p>
      </div>
    </article>
  );
}
