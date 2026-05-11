const iconMap: Record<string, string> = {
  "01": "⚡",
  "02": "📈",
  "03": "🤖",
  "04": "✦",
  "05": "🔍",
  "06": "🛠",
};

interface ServiceCardProps {
  number: string;
  name: string;
  description: string;
  tags: string[];
}

export function ServiceCard({
  number,
  name,
  description,
  tags,
}: ServiceCardProps) {
  return (
    <div className="group border border-[var(--border)] rounded-sm p-6 bg-surface hover:bg-surface2 transition-all duration-300 hover:border-gold/30 flex flex-col gap-4 h-full">
      <div className="flex items-start justify-between">
        <span className="text-gold/60 font-heading text-lg">{number}</span>
        <span className="text-xl opacity-60 group-hover:opacity-100 transition-opacity">
          {iconMap[number] ?? "◆"}
        </span>
      </div>
      <div className="flex-1">
        <h3 className="font-heading text-2xl text-forge-text mb-2 tracking-wide">
          {name}
        </h3>
        <p className="text-muted text-sm leading-relaxed">{description}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="text-xs px-2 py-1 border border-[var(--border)] text-muted rounded-sm"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
