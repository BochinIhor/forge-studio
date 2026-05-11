interface TeamCardProps {
  name: string;
  role: string;
  bio: string;
}

export function TeamCard({ name, role, bio }: TeamCardProps) {
  return (
    <div className="team-card p-5 rounded-sm bg-surface">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-surface2 border border-[var(--border)] flex items-center justify-center text-gold font-heading text-lg flex-shrink-0">
          {name.charAt(0)}
        </div>
        <div>
          <p className="text-forge-text font-medium text-sm">{name}</p>
          <p className="text-gold text-xs">{role}</p>
        </div>
      </div>
      <p className="text-muted text-sm leading-relaxed">{bio}</p>
    </div>
  );
}
