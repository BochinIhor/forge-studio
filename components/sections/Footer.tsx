import { getTranslations } from "next-intl/server";

export async function Footer() {
  const t = await getTranslations("footer");

  return (
    <footer className="border-t border-[var(--border)] py-8">
      <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-muted text-sm">{t("copyright")}</p>
        <span className="font-heading text-xl text-forge-text tracking-[0.2em]">
          FORGE
        </span>
        <p className="text-muted text-sm">{t("tagline")}</p>
      </div>
    </footer>
  );
}
