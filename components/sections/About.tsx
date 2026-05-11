import { getTranslations } from "next-intl/server";
import { RevealSection } from "@/components/ui/RevealSection";
import { TeamCard } from "@/components/ui/TeamCard";

export async function About() {
  const t = await getTranslations("about");

  const members = [
    {
      name: t("member_1_name"),
      role: t("member_1_role"),
      bio: t("member_1_bio"),
    },
    {
      name: t("member_2_name"),
      role: t("member_2_role"),
      bio: t("member_2_bio"),
    },
    {
      name: t("member_3_name"),
      role: t("member_3_role"),
      bio: t("member_3_bio"),
    },
  ];

  const formulaParts = t("team_formula").split("+").map((p) => p.trim());

  return (
    <section id="about" className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <RevealSection>
          <p className="text-gold text-xs tracking-[0.35em] uppercase mb-12">
            {t("label")}
          </p>
        </RevealSection>

        <div className="grid md:grid-cols-2 gap-16 items-start">
          {/* Left */}
          <RevealSection delay={100}>
            <div>
              <h2
                className="font-heading text-forge-text leading-[0.92] mb-6"
                style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.8rem)" }}
              >
                {t("headline")}
              </h2>
              <p className="text-muted leading-relaxed mb-10">
                {t("description")}
              </p>

              {/* Team formula */}
              <div className="flex items-center flex-wrap gap-2">
                {formulaParts.map((part, i) => (
                  <span key={part} className="flex items-center gap-2">
                    <span className="font-heading text-xl text-gold tracking-wide">
                      {part}
                    </span>
                    {i < formulaParts.length - 1 && (
                      <span className="text-gold/40 text-lg font-light">+</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          </RevealSection>

          {/* Right — team cards */}
          <RevealSection delay={200}>
            <div className="flex flex-col gap-3">
              <p className="text-muted text-xs tracking-[0.25em] uppercase mb-2">
                {t("team_label")}
              </p>
              {members.map((m) => (
                <TeamCard key={m.name} {...m} />
              ))}
            </div>
          </RevealSection>
        </div>
      </div>
    </section>
  );
}
