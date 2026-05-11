"use client";
import type { CaseItem } from "@/lib/cases";

interface CaseCardProps {
  item: CaseItem;
  locale: string;
  viewLabel: string;
}

export function CaseCard({ item, locale, viewLabel }: CaseCardProps) {
  const loc = (locale in item.title ? locale : "en") as keyof typeof item.title;

  return (
    <div
      className={`case-card relative overflow-hidden rounded-sm bg-gradient-to-br ${item.gradient} border border-[var(--border)] group`}
      style={{ aspectRatio: "4/3" }}
    >
      {/* SVG decorative placeholder */}
      <div
        className="absolute inset-0 flex items-center justify-center opacity-[0.06] pointer-events-none"
        aria-hidden="true"
      >
        <svg viewBox="0 0 200 150" className="w-3/4 h-3/4" fill="none">
          <rect
            x="20"
            y="20"
            width="160"
            height="110"
            rx="4"
            stroke="currentColor"
            strokeWidth="1"
          />
          <circle cx="60" cy="65" r="20" stroke="currentColor" strokeWidth="1" />
          <line
            x1="20"
            y1="95"
            x2="180"
            y2="95"
            stroke="currentColor"
            strokeWidth="1"
          />
          <rect
            x="90"
            y="45"
            width="70"
            height="8"
            rx="2"
            fill="currentColor"
            opacity="0.5"
          />
          <rect
            x="90"
            y="60"
            width="50"
            height="6"
            rx="2"
            fill="currentColor"
            opacity="0.3"
          />
        </svg>
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
        <p className="text-muted text-xs mb-1">{item.category[loc]}</p>
        <h3 className="font-heading text-2xl text-forge-text">
          {item.title[loc]}
        </h3>
        <div className="flex gap-4 mt-2">
          <span className="text-gold text-xs">↑ {item.metrics.conversion}</span>
          {item.metrics.roas !== "—" && (
            <span className="text-gold text-xs">ROAS {item.metrics.roas}</span>
          )}
          <span className="text-muted text-xs">{item.metrics.timeline}</span>
        </div>
      </div>

      {/* Hover overlay */}
      <div className="case-card-overlay absolute inset-0 bg-forge-black/70 flex items-center justify-center z-20">
        <span className="border border-gold text-gold font-heading text-lg px-6 py-2 hover:bg-gold hover:text-forge-black transition-colors duration-200">
          {viewLabel}
        </span>
      </div>
    </div>
  );
}
