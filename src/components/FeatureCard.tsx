import type { LucideIcon } from "lucide-react";

type FeatureCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <article className="compact-card p-5">
      <div className="mb-4 grid h-10 w-10 place-items-center rounded-lg bg-moss text-white">
        <Icon size={19} aria-hidden />
      </div>
      <h3 className="mb-2 font-semibold text-ink">{title}</h3>
      <p className="text-sm leading-6 text-muted">{description}</p>
    </article>
  );
}
