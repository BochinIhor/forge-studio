"use client";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/navigation";
import { locales, type Locale } from "@/i18n";

export function LangSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: Locale) => {
    router.push(pathname, { locale: newLocale });
  };

  return (
    <div className="flex items-center gap-1">
      {locales.map((l, i) => (
        <span key={l} className="flex items-center gap-1">
          <button
            onClick={() => switchLocale(l)}
            className={`text-xs font-medium uppercase tracking-wider px-1 py-0.5 transition-colors duration-200 ${
              locale === l
                ? "text-gold"
                : "text-muted hover:text-forge-text"
            }`}
          >
            {l.toUpperCase()}
          </button>
          {i < locales.length - 1 && (
            <span className="text-muted/40 text-xs select-none">/</span>
          )}
        </span>
      ))}
    </div>
  );
}
