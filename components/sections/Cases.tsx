import { getTranslations, getLocale } from "next-intl/server";
import { RevealSection } from "@/components/ui/RevealSection";
import { CaseCard } from "@/components/ui/CaseCard";
import { cases } from "@/lib/cases";

export async function Cases() {
  const t = await getTranslations("cases");
  const locale = await getLocale();

  return (
    <section id="cases" className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <RevealSection>
          <div className="mb-14">
            <p className="text-gold text-xs tracking-[0.35em] uppercase mb-3">
              {t("label")}
            </p>
            <h2
              className="font-heading text-forge-text leading-[0.92]"
              style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.8rem)" }}
            >
              {t("headline")}
            </h2>
          </div>
        </RevealSection>

        <div className="grid sm:grid-cols-2 gap-4">
          {cases.map((item, i) => (
            <RevealSection key={item.id} delay={i * 100}>
              <CaseCard item={item} locale={locale} viewLabel={t("view")} />
            </RevealSection>
          ))}

          {/* Placeholder "+" card */}
          <RevealSection delay={cases.length * 100}>
            <div
              className="rounded-sm border-2 border-dashed border-[var(--border)] flex flex-col items-center justify-center gap-3 hover:border-gold/40 transition-colors duration-300 group"
              style={{ aspectRatio: "4/3" }}
            >
              <span className="text-4xl text-muted group-hover:text-gold transition-colors duration-300 leading-none">
                +
              </span>
              <p className="text-muted text-sm">{t("placeholder_title")}</p>
              <p className="text-muted/50 text-xs">{t("placeholder_desc")}</p>
            </div>
          </RevealSection>
        </div>
      </div>
    </section>
  );
}
