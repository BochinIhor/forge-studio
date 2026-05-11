import type { Metadata } from "next";
import { Bebas_Neue, DM_Sans } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages } from "next-intl/server";
import { locales } from "@/i18n";
import { LenisProvider } from "@/components/ui/LenisProvider";
import { PageTransition } from "@/components/ui/PageTransition";
import "../globals.css";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas-neue",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FORGE — Digital Production Studio",
  description:
    "We build high-performance digital products — from strategy to launch. Web, marketing, AI automation.",
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(locales, locale)) notFound();

  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${bebasNeue.variable} ${dmSans.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-forge-black text-forge-text min-h-screen">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <LenisProvider>
            <PageTransition>{children}</PageTransition>
          </LenisProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
