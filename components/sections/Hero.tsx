"use client";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

export function Hero() {
  const t = useTranslations("hero");
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = lineRef.current;
    if (!el) return;
    let pos = 0;
    let dir = 1;
    let rafId: number;

    const animate = () => {
      pos += 0.4 * dir;
      if (pos >= 20 || pos <= 0) dir *= -1;
      el.style.transform = `translateY(${-pos}px)`;
      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-16">
      {/* Decorative giant "F" */}
      <div
        className="absolute inset-0 flex items-center justify-end pointer-events-none select-none overflow-hidden"
        aria-hidden="true"
      >
        <span
          className="font-heading leading-none translate-x-[8%]"
          style={{
            fontSize: "clamp(300px, 50vw, 700px)",
            color: "rgba(245,237,214,0.025)",
            userSelect: "none",
          }}
        >
          F
        </span>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        {/* Tag */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-gold text-xs tracking-[0.35em] uppercase mb-6"
        >
          {t("tag")}
        </motion.p>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-heading uppercase text-forge-text leading-[0.9] mb-8"
          style={{ fontSize: "clamp(3.5rem, 11vw, 9rem)" }}
        >
          {t("headline")}
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-muted text-lg max-w-xl leading-relaxed mb-10"
        >
          {t("description")}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="flex flex-wrap gap-4"
        >
          <a
            href="#contact"
            className="bg-gold text-forge-black font-medium px-8 py-3 tracking-wide hover:bg-gold-light transition-colors duration-200"
          >
            {t("cta_primary")}
          </a>
          <a
            href="#cases"
            className="border border-[var(--border)] text-forge-text px-8 py-3 hover:border-gold hover:text-gold transition-all duration-200"
          >
            {t("cta_secondary")}
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
        <span className="text-muted text-[10px] tracking-[0.3em] uppercase">
          {t("scroll")}
        </span>
        <div className="w-px h-12 bg-[var(--border)] overflow-hidden relative">
          <div
            ref={lineRef}
            className="absolute inset-x-0 top-0 h-6 bg-gold"
          />
        </div>
      </div>
    </section>
  );
}
