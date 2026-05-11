import { getTranslations } from "next-intl/server";
import { RevealSection } from "@/components/ui/RevealSection";
import { ServiceCard } from "@/components/ui/ServiceCard";

export async function Services() {
  const t = await getTranslations("services");

  const services = [
    {
      number: t("s1_number"),
      name: t("s1_name"),
      description: t("s1_description"),
      tags: t("s1_tags").split(","),
    },
    {
      number: t("s2_number"),
      name: t("s2_name"),
      description: t("s2_description"),
      tags: t("s2_tags").split(","),
    },
    {
      number: t("s3_number"),
      name: t("s3_name"),
      description: t("s3_description"),
      tags: t("s3_tags").split(","),
    },
    {
      number: t("s4_number"),
      name: t("s4_name"),
      description: t("s4_description"),
      tags: t("s4_tags").split(","),
    },
    {
      number: t("s5_number"),
      name: t("s5_name"),
      description: t("s5_description"),
      tags: t("s5_tags").split(","),
    },
    {
      number: t("s6_number"),
      name: t("s6_name"),
      description: t("s6_description"),
      tags: t("s6_tags").split(","),
    },
  ];

  return (
    <section id="services" className="py-24 bg-surface">
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

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((s, i) => (
            <RevealSection key={s.number} delay={i * 70}>
              <ServiceCard {...s} />
            </RevealSection>
          ))}
        </div>
      </div>
    </section>
  );
}
