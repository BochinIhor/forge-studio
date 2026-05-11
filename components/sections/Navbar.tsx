"use client";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { LangSwitcher } from "@/components/ui/LangSwitcher";

export function Navbar() {
  const t = useTranslations("nav");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const links = [
    { href: "#about", label: t("about") },
    { href: "#services", label: t("services") },
    { href: "#cases", label: t("cases") },
    { href: "#contact", label: t("contact") },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "backdrop-blur-md bg-forge-black/80 border-b border-[var(--border)]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#"
          className="font-heading text-2xl text-forge-text tracking-[0.15em] hover:text-gold transition-colors duration-200"
        >
          FORGE
        </a>

        {/* Nav links */}
        <ul className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-muted text-sm tracking-wide hover:text-forge-text transition-colors duration-200"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Right: lang switcher + CTA */}
        <div className="flex items-center gap-5">
          <LangSwitcher />
          <a
            href="#contact"
            className="hidden sm:inline-flex items-center border border-gold text-gold text-xs font-medium px-4 py-2 tracking-wider hover:bg-gold hover:text-forge-black transition-all duration-200"
          >
            {t("cta")}
          </a>
        </div>
      </div>
    </nav>
  );
}
