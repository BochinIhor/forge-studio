"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { RevealSection } from "@/components/ui/RevealSection";

function useCounter(target: number, duration = 1800) {
  const [count, setCount] = useState(0);
  const started = useRef(false);

  const start = useCallback(() => {
    if (started.current) return;
    started.current = true;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [target, duration]);

  return { count, start };
}

interface StatItemProps {
  valueStr: string;
  label: string;
  suffix: string;
}

function StatItem({ valueStr, label, suffix }: StatItemProps) {
  const target = parseInt(valueStr, 10) || 0;
  const { count, start } = useCounter(target);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          start();
          observer.unobserve(el);
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [start]);

  return (
    <div ref={ref} className="flex flex-col items-center text-center gap-3">
      <span
        className="font-heading text-gold leading-none"
        style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)" }}
      >
        {count}
        {suffix}
      </span>
      <span className="text-muted text-xs tracking-widest uppercase">
        {label}
      </span>
    </div>
  );
}

export function Stats() {
  const t = useTranslations("stats");

  const stats: StatItemProps[] = [
    { valueStr: t("projects_value"), label: t("projects_label"), suffix: "+" },
    { valueStr: t("clients_value"), label: t("clients_label"), suffix: "+" },
    { valueStr: t("years_value"), label: t("years_label"), suffix: "+" },
    { valueStr: t("return_value"), label: t("return_label"), suffix: "%" },
  ];

  return (
    <section className="py-20 border-y border-[var(--border)]">
      <RevealSection>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {stats.map((s) => (
              <StatItem key={s.label} {...s} />
            ))}
          </div>
        </div>
      </RevealSection>
    </section>
  );
}
