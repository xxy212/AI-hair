type CaseCardProps = {
  title: string;
  description: string;
  tags: string[];
};

export function CaseCard({ title, description, tags }: CaseCardProps) {
  return (
    <article className="compact-card p-5">
      <div className="mb-4 flex items-center gap-3">
        <div className="hair-visual h-14 w-14 rounded-lg border border-line" />
        <div>
          <p className="text-xs font-semibold text-coral">示例案例</p>
          <h3 className="font-semibold text-ink">{title}</h3>
        </div>
      </div>
      <p className="text-sm leading-6 text-muted">{description}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span key={tag} className="rounded-lg bg-sky px-2.5 py-1 text-xs font-medium text-ink">
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
}
