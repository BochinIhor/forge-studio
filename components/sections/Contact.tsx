"use client";
import { useTranslations } from "next-intl";
import { RevealSection } from "@/components/ui/RevealSection";

export function Contact() {
  const t = useTranslations("contact");

  return (
    <section id="contact" className="py-24 bg-surface">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          {/* Left */}
          <RevealSection>
            <div>
              <p className="text-gold text-xs tracking-[0.35em] uppercase mb-4">
                {t("label")}
              </p>
              <h2
                className="font-heading text-forge-text leading-[0.92] mb-6"
                style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.8rem)" }}
              >
                {t("headline")}
              </h2>
              <p className="text-muted leading-relaxed mb-10">
                {t("description")}
              </p>

              <div className="flex flex-col gap-5">
                <div>
                  <p className="text-muted text-xs uppercase tracking-widest mb-1">
                    {t("email_label")}
                  </p>
                  <a
                    href={`mailto:${t("email_value")}`}
                    className="text-forge-text hover:text-gold transition-colors duration-200"
                  >
                    {t("email_value")}
                  </a>
                </div>
                <div>
                  <p className="text-muted text-xs uppercase tracking-widest mb-1">
                    {t("telegram_label")}
                  </p>
                  <a
                    href="#"
                    className="text-forge-text hover:text-gold transition-colors duration-200"
                  >
                    {t("telegram_value")}
                  </a>
                </div>
              </div>
            </div>
          </RevealSection>

          {/* Right — form */}
          <RevealSection delay={150}>
            <form
              name="contact"
              method="POST"
              data-netlify="true"
              className="flex flex-col gap-5"
            >
              <input type="hidden" name="form-name" value="contact" />

              <div>
                <label className="text-muted text-xs uppercase tracking-widest block mb-2">
                  {t("name_label")}
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder={t("name_placeholder")}
                  required
                  className="w-full bg-surface2 border border-[var(--border)] text-forge-text placeholder:text-muted/40 px-4 py-3 text-sm focus:outline-none focus:border-gold/50 transition-colors duration-200"
                />
              </div>

              <div>
                <label className="text-muted text-xs uppercase tracking-widest block mb-2">
                  {t("contact_label")}
                </label>
                <input
                  type="text"
                  name="contact"
                  placeholder={t("contact_placeholder")}
                  required
                  className="w-full bg-surface2 border border-[var(--border)] text-forge-text placeholder:text-muted/40 px-4 py-3 text-sm focus:outline-none focus:border-gold/50 transition-colors duration-200"
                />
              </div>

              <div>
                <label className="text-muted text-xs uppercase tracking-widest block mb-2">
                  {t("message_label")}
                </label>
                <textarea
                  name="message"
                  placeholder={t("message_placeholder")}
                  required
                  rows={5}
                  className="w-full bg-surface2 border border-[var(--border)] text-forge-text placeholder:text-muted/40 px-4 py-3 text-sm focus:outline-none focus:border-gold/50 transition-colors duration-200 resize-none"
                />
              </div>

              <button
                type="submit"
                className="bg-gold text-forge-black font-medium py-3 tracking-widest text-sm hover:bg-gold-light transition-colors duration-200"
              >
                {t("submit")}
              </button>
            </form>
          </RevealSection>
        </div>
      </div>
    </section>
  );
}
