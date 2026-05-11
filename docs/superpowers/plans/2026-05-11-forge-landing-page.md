# FORGE Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a dark premium multilingual (EN/UK/RU) single-page landing for digital agency "FORGE" with 8 sections, custom cursor, smooth scroll, and Framer Motion animations.

**Architecture:** Next.js 16 App Router with `[locale]` dynamic segment; next-intl for i18n (server dictionaries + client hooks via `createNavigation`); server components for static sections, "use client" only for interactive ones. No root `app/layout.tsx` — locale layout provides `<html>/<body>`.

**Tech Stack:** Next.js 16.2.6, React 19, TypeScript, Tailwind CSS v4, next-intl, framer-motion, lenis

> **CRITICAL Next.js 16 differences from v14:**
> - Middleware file is **`proxy.ts`**, export named **`proxy`** (not `middleware`)
> - `params` prop is **async**: always `const { locale } = await params`
> - **`PageProps<'/[locale]'>`** and **`LayoutProps<'/[locale]'>`** are globally available TS helpers (no import)
> - Tailwind v4: **no `tailwind.config.js`**, use `@theme` in CSS; `@import 'tailwindcss'`
> - `@tailwindcss/postcss` is already configured in `postcss.config.mjs`

---

## File Map

| File | Purpose |
|------|---------|
| `proxy.ts` | next-intl locale detection + redirect (Next.js 16 middleware) |
| `i18n.ts` | next-intl server config — `getRequestConfig`, locales, defaultLocale |
| `navigation.ts` | `createNavigation` → exports `useRouter`, `usePathname`, `Link` |
| `next.config.ts` | Add `withNextIntl` plugin |
| `app/globals.css` | Tailwind v4 import + CSS vars + `@theme` design tokens |
| `app/[locale]/layout.tsx` | Root layout with html/body, fonts, Lenis, Framer, NextIntlClientProvider |
| `app/[locale]/page.tsx` | Page assembling all sections |
| `app/layout.tsx` | **DELETE** — replaced by `[locale]/layout.tsx` |
| `app/page.tsx` | **DELETE** — replaced by `[locale]/page.tsx` |
| `messages/en.json` | English translations |
| `messages/uk.json` | Ukrainian translations |
| `messages/ru.json` | Russian translations |
| `lib/cases.ts` | CaseItem interface + typed case data |
| `components/ui/MagneticCursor.tsx` | Custom cursor with lag ring ("use client") |
| `components/ui/LangSwitcher.tsx` | EN/UK/RU buttons, active = gold ("use client") |
| `components/ui/ServiceCard.tsx` | Service card (server) |
| `components/ui/TeamCard.tsx` | Team card with gold hover border (server, CSS hover) |
| `components/ui/CaseCard.tsx` | Case card with hover overlay ("use client") |
| `components/ui/LenisProvider.tsx` | Lenis smooth scroll init ("use client") |
| `components/ui/PageTransition.tsx` | Framer Motion entry animation ("use client") |
| `components/ui/RevealSection.tsx` | IntersectionObserver fade+translateY wrapper ("use client") |
| `components/sections/Navbar.tsx` | Fixed navbar with scroll blur ("use client") |
| `components/sections/Hero.tsx` | Full-viewport hero ("use client" for scroll indicator) |
| `components/sections/Stats.tsx` | Counter animation ("use client") |
| `components/sections/About.tsx` | 2-column with team cards (server) |
| `components/sections/Services.tsx` | 3×2 service grid (server) |
| `components/sections/Cases.tsx` | 2×2 case grid (server outer, client cards) |
| `components/sections/Contact.tsx` | Contact form ("use client") |
| `components/sections/Footer.tsx` | Footer (server) |

---

## Task 1: Install dependencies

**Files:**
- Modify: `package.json` (via npm install)
- Modify: `next.config.ts`

- [ ] **Step 1: Install packages**

```bash
cd D:\Project\forge-studio
npm install next-intl framer-motion lenis
```

Expected output: packages added, no errors

- [ ] **Step 2: Update next.config.ts**

Replace `D:\Project\forge-studio\next.config.ts` with:

```ts
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n.ts");

const nextConfig: NextConfig = {};

export default withNextIntl(nextConfig);
```

- [ ] **Step 3: Verify build compiles**

```bash
npm run build 2>&1 | head -20
```

Expected: no import errors (may show page errors since we haven't restructured yet — that's OK)

---

## Task 2: i18n config, proxy, and navigation

**Files:**
- Create: `i18n.ts`
- Create: `proxy.ts`
- Create: `navigation.ts`

- [ ] **Step 1: Create `i18n.ts`**

```ts
// i18n.ts
import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";

export const locales = ["en", "uk", "ru"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale;
  if (!hasLocale(locales, locale)) notFound();
  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
```

- [ ] **Step 2: Create `proxy.ts`** (Next.js 16 middleware — named `proxy.ts`, export `proxy`)

```ts
// proxy.ts
import createMiddleware from "next-intl/middleware";
import { locales, defaultLocale } from "./i18n";

export const proxy = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "always",
});

export const config = {
  matcher: ["/((?!_next|_vercel|favicon\\.ico|.*\\..*).*)"],
};
```

- [ ] **Step 3: Create `navigation.ts`**

```ts
// navigation.ts
import { createNavigation } from "next-intl/navigation";
import { locales } from "./i18n";

export const { Link, redirect, usePathname, useRouter } = createNavigation({
  locales,
});
```

---

## Task 3: Translation files

**Files:**
- Create: `messages/en.json`
- Create: `messages/uk.json`
- Create: `messages/ru.json`

- [ ] **Step 1: Create `messages/en.json`**

```json
{
  "nav": {
    "about": "About",
    "services": "Services",
    "cases": "Cases",
    "contact": "Contact",
    "cta": "Start a project"
  },
  "hero": {
    "tag": "Digital Production Studio",
    "headline": "We forge digital products",
    "description": "We build high-performance digital products — from strategy to launch. Web, marketing, AI automation.",
    "cta_primary": "Start a project",
    "cta_secondary": "View cases",
    "scroll": "Scroll"
  },
  "stats": {
    "projects_value": "24",
    "projects_label": "Projects completed",
    "clients_value": "18",
    "clients_label": "Happy clients",
    "years_value": "3",
    "years_label": "Years in market",
    "return_value": "98",
    "return_label": "Return rate"
  },
  "about": {
    "label": "About us",
    "headline": "We don't just build — we forge.",
    "description": "FORGE is a boutique digital production studio that brings together development, performance marketing and design thinking under one roof.",
    "team_formula": "Dev + Mkt + Design",
    "team_label": "Our team",
    "member_1_name": "Alex Kovalenko",
    "member_1_role": "Tech Lead",
    "member_1_bio": "Full-stack engineer with 8+ years building products users love.",
    "member_2_name": "Maria Bondar",
    "member_2_role": "Performance Marketing",
    "member_2_bio": "Growth strategist. Scales brands with paid social and data-driven funnels.",
    "member_3_name": "Dima Sereda",
    "member_3_role": "Brand & UI",
    "member_3_bio": "Visual architect. Crafts identities that cut through the noise."
  },
  "services": {
    "label": "Services",
    "headline": "What we do",
    "s1_number": "01",
    "s1_name": "Web Development",
    "s1_description": "High-performance websites and web apps built with modern tech.",
    "s1_tags": "Next.js,React,TypeScript,Node.js",
    "s2_number": "02",
    "s2_name": "Performance Marketing",
    "s2_description": "Paid ads, analytics, and funnel optimization that drives real growth.",
    "s2_tags": "Google Ads,Meta Ads,Analytics,CRO",
    "s3_number": "03",
    "s3_name": "AI Automation",
    "s3_description": "Intelligent workflows and AI-powered tools to scale operations.",
    "s3_tags": "GPT,Automation,Zapier,n8n",
    "s4_number": "04",
    "s4_name": "Branding & UI",
    "s4_description": "Visual identity and interface design that converts and inspires.",
    "s4_tags": "Figma,Brand,UI/UX,Motion",
    "s5_number": "05",
    "s5_name": "SEO",
    "s5_description": "Technical and content SEO strategies that grow organic traffic.",
    "s5_tags": "Technical SEO,Content,Link Building",
    "s6_number": "06",
    "s6_name": "Support & Growth",
    "s6_description": "Ongoing technical support, monitoring, and iterative improvement.",
    "s6_tags": "Maintenance,Speed,Monitoring"
  },
  "cases": {
    "label": "Cases",
    "headline": "Selected work",
    "view": "View",
    "more": "More projects",
    "placeholder_title": "Your project",
    "placeholder_desc": "Let's build something great"
  },
  "contact": {
    "label": "Contact",
    "headline": "Let's forge something great",
    "description": "Tell us about your project and we'll get back to you within 24 hours.",
    "email_label": "Email",
    "email_value": "hello@forge.studio",
    "telegram_label": "Telegram",
    "telegram_value": "@forge_studio",
    "name_label": "Your name",
    "name_placeholder": "Alex Kovalenko",
    "contact_label": "Email or Telegram",
    "contact_placeholder": "hello@company.com",
    "message_label": "About your project",
    "message_placeholder": "Describe your project, goals, timeline...",
    "submit": "Send message"
  },
  "footer": {
    "copyright": "© 2024 FORGE Studio",
    "tagline": "Forging digital futures"
  }
}
```

- [ ] **Step 2: Create `messages/uk.json`**

```json
{
  "nav": {
    "about": "Про нас",
    "services": "Послуги",
    "cases": "Кейси",
    "contact": "Контакт",
    "cta": "Почати проєкт"
  },
  "hero": {
    "tag": "Студія цифрового виробництва",
    "headline": "Ми куємо цифрові продукти",
    "description": "Ми створюємо високоефективні цифрові продукти — від стратегії до запуску. Веб, маркетинг, AI-автоматизація.",
    "cta_primary": "Почати проєкт",
    "cta_secondary": "Переглянути кейси",
    "scroll": "Гортати"
  },
  "stats": {
    "projects_value": "24",
    "projects_label": "Завершених проєктів",
    "clients_value": "18",
    "clients_label": "Задоволених клієнтів",
    "years_value": "3",
    "years_label": "Роки на ринку",
    "return_value": "98",
    "return_label": "Повернення клієнтів"
  },
  "about": {
    "label": "Про нас",
    "headline": "Ми не просто будуємо — ми куємо.",
    "description": "FORGE — це бутикова студія цифрового виробництва, що об'єднує розробку, перфоманс-маркетинг та дизайн-мислення під одним дахом.",
    "team_formula": "Dev + Mkt + Design",
    "team_label": "Наша команда",
    "member_1_name": "Алекс Коваленко",
    "member_1_role": "Тех. директор",
    "member_1_bio": "Full-stack розробник з 8+ роками досвіду створення продуктів.",
    "member_2_name": "Марія Бондар",
    "member_2_role": "Перфоманс-маркетинг",
    "member_2_bio": "Стратег зростання. Масштабує бренди через платний трафік і воронки.",
    "member_3_name": "Діма Середа",
    "member_3_role": "Бренд & UI",
    "member_3_bio": "Візуальний архітектор. Створює ідентичності, що виділяються."
  },
  "services": {
    "label": "Послуги",
    "headline": "Що ми робимо",
    "s1_number": "01",
    "s1_name": "Веб-розробка",
    "s1_description": "Високопродуктивні сайти та веб-застосунки на сучасному стеку.",
    "s1_tags": "Next.js,React,TypeScript,Node.js",
    "s2_number": "02",
    "s2_name": "Перфоманс-маркетинг",
    "s2_description": "Платна реклама, аналітика та оптимізація воронки для реального зростання.",
    "s2_tags": "Google Ads,Meta Ads,Аналітика,CRO",
    "s3_number": "03",
    "s3_name": "AI-автоматизація",
    "s3_description": "Інтелектуальні воркфлоу та AI-інструменти для масштабування операцій.",
    "s3_tags": "GPT,Автоматизація,Zapier,n8n",
    "s4_number": "04",
    "s4_name": "Брендинг & UI",
    "s4_description": "Візуальна ідентичність та дизайн інтерфейсів, що конвертує та надихає.",
    "s4_tags": "Figma,Бренд,UI/UX,Motion",
    "s5_number": "05",
    "s5_name": "SEO",
    "s5_description": "Технічні та контентні SEO-стратегії для зростання органічного трафіку.",
    "s5_tags": "Технічне SEO,Контент,Посилання",
    "s6_number": "06",
    "s6_name": "Підтримка & Зростання",
    "s6_description": "Постійна технічна підтримка, моніторинг та ітеративне покращення.",
    "s6_tags": "Підтримка,Швидкість,Моніторинг"
  },
  "cases": {
    "label": "Кейси",
    "headline": "Вибрані роботи",
    "view": "Переглянути",
    "more": "Більше проєктів",
    "placeholder_title": "Ваш проєкт",
    "placeholder_desc": "Давайте створимо щось велике"
  },
  "contact": {
    "label": "Контакт",
    "headline": "Давайте скуємо щось велике",
    "description": "Розкажіть про свій проєкт, і ми відповімо протягом 24 годин.",
    "email_label": "Email",
    "email_value": "hello@forge.studio",
    "telegram_label": "Telegram",
    "telegram_value": "@forge_studio",
    "name_label": "Ваше ім'я",
    "name_placeholder": "Алекс Коваленко",
    "contact_label": "Email або Telegram",
    "contact_placeholder": "hello@company.com",
    "message_label": "Про ваш проєкт",
    "message_placeholder": "Опишіть проєкт, цілі, часові рамки...",
    "submit": "Надіслати повідомлення"
  },
  "footer": {
    "copyright": "© 2024 FORGE Studio",
    "tagline": "Куємо цифрове майбутнє"
  }
}
```

- [ ] **Step 3: Create `messages/ru.json`**

```json
{
  "nav": {
    "about": "О нас",
    "services": "Услуги",
    "cases": "Кейсы",
    "contact": "Контакт",
    "cta": "Начать проект"
  },
  "hero": {
    "tag": "Студия цифрового производства",
    "headline": "Мы куём цифровые продукты",
    "description": "Мы создаём высокоэффективные цифровые продукты — от стратегии до запуска. Веб, маркетинг, AI-автоматизация.",
    "cta_primary": "Начать проект",
    "cta_secondary": "Смотреть кейсы",
    "scroll": "Листать"
  },
  "stats": {
    "projects_value": "24",
    "projects_label": "Завершённых проектов",
    "clients_value": "18",
    "clients_label": "Довольных клиентов",
    "years_value": "3",
    "years_label": "Года на рынке",
    "return_value": "98",
    "return_label": "Возврат клиентов"
  },
  "about": {
    "label": "О нас",
    "headline": "Мы не просто строим — мы куём.",
    "description": "FORGE — бутиковая студия цифрового производства, объединяющая разработку, перфоманс-маркетинг и дизайн-мышление под одной крышей.",
    "team_formula": "Dev + Mkt + Design",
    "team_label": "Наша команда",
    "member_1_name": "Алекс Коваленко",
    "member_1_role": "Тех. директор",
    "member_1_bio": "Full-stack разработчик с 8+ годами опыта создания продуктов.",
    "member_2_name": "Мария Бондарь",
    "member_2_role": "Перфоманс-маркетинг",
    "member_2_bio": "Стратег роста. Масштабирует бренды через платный трафик и воронки.",
    "member_3_name": "Дима Середа",
    "member_3_role": "Бренд & UI",
    "member_3_bio": "Визуальный архитектор. Создаёт идентичности, которые выделяются."
  },
  "services": {
    "label": "Услуги",
    "headline": "Что мы делаем",
    "s1_number": "01",
    "s1_name": "Веб-разработка",
    "s1_description": "Высокопроизводительные сайты и веб-приложения на современном стеке.",
    "s1_tags": "Next.js,React,TypeScript,Node.js",
    "s2_number": "02",
    "s2_name": "Перфоманс-маркетинг",
    "s2_description": "Платная реклама, аналитика и оптимизация воронки для реального роста.",
    "s2_tags": "Google Ads,Meta Ads,Аналитика,CRO",
    "s3_number": "03",
    "s3_name": "AI-автоматизация",
    "s3_description": "Интеллектуальные воркфлоу и AI-инструменты для масштабирования операций.",
    "s3_tags": "GPT,Автоматизация,Zapier,n8n",
    "s4_number": "04",
    "s4_name": "Брендинг & UI",
    "s4_description": "Визуальная идентичность и дизайн интерфейсов, которые конвертируют.",
    "s4_tags": "Figma,Бренд,UI/UX,Motion",
    "s5_number": "05",
    "s5_name": "SEO",
    "s5_description": "Технические и контентные SEO-стратегии для роста органического трафика.",
    "s5_tags": "Технич. SEO,Контент,Ссылки",
    "s6_number": "06",
    "s6_name": "Поддержка & Рост",
    "s6_description": "Постоянная техническая поддержка, мониторинг и итеративное улучшение.",
    "s6_tags": "Поддержка,Скорость,Мониторинг"
  },
  "cases": {
    "label": "Кейсы",
    "headline": "Избранные работы",
    "view": "Смотреть",
    "more": "Больше проектов",
    "placeholder_title": "Ваш проект",
    "placeholder_desc": "Давайте создадим что-то великое"
  },
  "contact": {
    "label": "Контакт",
    "headline": "Давайте скуём что-то великое",
    "description": "Расскажите о своём проекте, и мы ответим в течение 24 часов.",
    "email_label": "Email",
    "email_value": "hello@forge.studio",
    "telegram_label": "Telegram",
    "telegram_value": "@forge_studio",
    "name_label": "Ваше имя",
    "name_placeholder": "Алекс Коваленко",
    "contact_label": "Email или Telegram",
    "contact_placeholder": "hello@company.com",
    "message_label": "О вашем проекте",
    "message_placeholder": "Опишите проект, цели, сроки...",
    "submit": "Отправить сообщение"
  },
  "footer": {
    "copyright": "© 2024 FORGE Studio",
    "tagline": "Куём цифровое будущее"
  }
}
```

---

## Task 4: Global CSS with design tokens

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Replace `app/globals.css`**

```css
@import "tailwindcss";

:root {
  --gold: #C9A84C;
  --gold-light: #E8C96A;
  --black: #0A0906;
  --surface: #121009;
  --surface2: #1C180F;
  --text: #F5EDD6;
  --muted: #7A7060;
  --border: rgba(201, 168, 76, 0.15);
}

@theme inline {
  --color-gold: var(--gold);
  --color-gold-light: var(--gold-light);
  --color-forge-black: var(--black);
  --color-surface: var(--surface);
  --color-surface2: var(--surface2);
  --color-forge-text: var(--text);
  --color-muted: var(--muted);
  --font-heading: var(--font-bebas-neue);
  --font-body: var(--font-dm-sans);
}

* {
  cursor: none;
}

html {
  background-color: var(--black);
  color: var(--text);
}

body {
  font-family: var(--font-dm-sans), sans-serif;
  background-color: var(--black);
}

/* Scroll reveal */
.reveal-section {
  opacity: 0;
  transform: translateY(40px);
  transition: opacity 0.7s ease, transform 0.7s ease;
}

.reveal-section.revealed {
  opacity: 1;
  transform: translateY(0);
}

/* Gold border reveal on hover */
.team-card {
  border-left: 2px solid transparent;
  transition: border-color 0.3s ease, background-color 0.3s ease;
}

.team-card:hover {
  border-left-color: var(--gold);
  background-color: var(--surface2);
}

/* Case card overlay */
.case-card-overlay {
  opacity: 0;
  transition: opacity 0.3s ease;
}

.case-card:hover .case-card-overlay {
  opacity: 1;
}
```

---

## Task 5: App route structure

**Files:**
- Delete: `app/layout.tsx`
- Delete: `app/page.tsx`
- Create: `app/[locale]/layout.tsx`
- Create: `app/[locale]/page.tsx`
- Create: `components/ui/LenisProvider.tsx`
- Create: `components/ui/PageTransition.tsx`

- [ ] **Step 1: Delete old root files**

Delete `app/layout.tsx` and `app/page.tsx` (the locale layout will provide `<html>/<body>`).

- [ ] **Step 2: Create `components/ui/LenisProvider.tsx`**

```tsx
"use client";
import { useEffect } from "react";
import Lenis from "lenis";

export function LenisProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    const handle = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(handle);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
```

- [ ] **Step 3: Create `components/ui/PageTransition.tsx`**

```tsx
"use client";
import { motion } from "framer-motion";

export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 4: Create `app/[locale]/layout.tsx`**

```tsx
import type { Metadata } from "next";
import { Bebas_Neue, DM_Sans } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, hasLocale } from "next-intl/server";
import { locales } from "@/i18n";
import { LenisProvider } from "@/components/ui/LenisProvider";
import { PageTransition } from "@/components/ui/PageTransition";
import "../../app/globals.css";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas-neue",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
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
      <body className="bg-forge-black text-forge-text">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <LenisProvider>
            <PageTransition>{children}</PageTransition>
          </LenisProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

> **Note on globals.css import:** use path `"../../app/globals.css"` OR move globals.css to the project root and import as `"../globals.css"`. If the file stays at `app/globals.css`, import path is relative to the layout file at `app/[locale]/layout.tsx`, so it's `"../globals.css"`.

- [ ] **Step 5: Fix globals.css import path in layout**

The layout file is at `app/[locale]/layout.tsx`. The globals.css is at `app/globals.css`. The correct import is:

```tsx
import "../globals.css";
```

- [ ] **Step 6: Create `app/[locale]/page.tsx`** (stub — will be filled in Task 20)

```tsx
export default async function Home() {
  return (
    <main>
      <p style={{ color: "white", padding: "2rem" }}>FORGE — coming soon</p>
    </main>
  );
}
```

- [ ] **Step 7: Verify dev server starts**

```bash
npm run dev
```

Navigate to `http://localhost:3000` — should redirect to `/en` and show "FORGE — coming soon" in white text on black background.

---

## Task 6: Case data library

**Files:**
- Create: `lib/cases.ts`

- [ ] **Step 1: Create `lib/cases.ts`**

```ts
export interface CaseMetrics {
  conversion: string;
  roas: string;
  timeline: string;
}

export interface CaseItem {
  id: string;
  title: { en: string; uk: string; ru: string };
  description: { en: string; uk: string; ru: string };
  category: { en: string; uk: string; ru: string };
  metrics: CaseMetrics;
  gradient: string;
}

export const cases: CaseItem[] = [
  {
    id: "ecommerce-relaunch",
    title: {
      en: "E-commerce Relaunch",
      uk: "Перезапуск e-commerce",
      ru: "Перезапуск e-commerce",
    },
    description: {
      en: "Full rebuild of an online store with performance marketing integration.",
      uk: "Повне перебудування інтернет-магазину з інтеграцією перфоманс-маркетингу.",
      ru: "Полное перестроение интернет-магазина с интеграцией перфоманс-маркетинга.",
    },
    category: {
      en: "Web Dev + Marketing",
      uk: "Веб + Маркетинг",
      ru: "Веб + Маркетинг",
    },
    metrics: { conversion: "+145%", roas: "4.2×", timeline: "6w" },
    gradient: "from-[#1C180F] to-[#2A2010]",
  },
  {
    id: "fintech-dashboard",
    title: {
      en: "FinTech Dashboard",
      uk: "FinTech Дашборд",
      ru: "FinTech Дашборд",
    },
    description: {
      en: "Real-time analytics dashboard with AI-powered insights.",
      uk: "Дашборд аналітики в реальному часі з AI-функціями.",
      ru: "Дашборд аналитики в реальном времени с AI-возможностями.",
    },
    category: { en: "Web Dev + AI", uk: "Веб + AI", ru: "Веб + AI" },
    metrics: { conversion: "+89%", roas: "—", timeline: "8w" },
    gradient: "from-[#0F1A1C] to-[#102020]",
  },
  {
    id: "growth-sprint",
    title: {
      en: "Growth Sprint",
      uk: "Growth Sprint",
      ru: "Growth Sprint",
    },
    description: {
      en: "Performance marketing sprint that 3× the ROAS in 4 weeks.",
      uk: "Перфоманс-маркетинговий спринт, що потроїв ROAS за 4 тижні.",
      ru: "Перфоманс-маркетинговый спринт, утроивший ROAS за 4 недели.",
    },
    category: {
      en: "Performance Marketing",
      uk: "Перфоманс-маркетинг",
      ru: "Перфоманс-маркетинг",
    },
    metrics: { conversion: "+210%", roas: "6.1×", timeline: "4w" },
    gradient: "from-[#1A0F0F] to-[#201010]",
  },
];
```

---

## Task 7: RevealSection wrapper

**Files:**
- Create: `components/ui/RevealSection.tsx`

- [ ] **Step 1: Create `components/ui/RevealSection.tsx`**

```tsx
"use client";
import { useEffect, useRef } from "react";

interface RevealSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function RevealSection({
  children,
  className = "",
  delay = 0,
}: RevealSectionProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => el.classList.add("revealed"), delay);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className={`reveal-section ${className}`}>
      {children}
    </div>
  );
}
```

---

## Task 8: MagneticCursor component

**Files:**
- Create: `components/ui/MagneticCursor.tsx`

- [ ] **Step 1: Create `components/ui/MagneticCursor.tsx`**

```tsx
"use client";
import { useEffect, useRef } from "react";

export function MagneticCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let ringX = 0;
    let ringY = 0;
    let mouseX = 0;
    let mouseY = 0;
    let rafId: number;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    };

    const animate = () => {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      rafId = requestAnimationFrame(animate);
    };

    const onEnter = () => {
      dot.style.opacity = "1";
      ring.style.opacity = "1";
    };

    const onLeave = () => {
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    };

    const onLinkEnter = () => {
      ring.style.width = "48px";
      ring.style.height = "48px";
      ring.style.borderColor = "var(--gold)";
    };

    const onLinkLeave = () => {
      ring.style.width = "32px";
      ring.style.height = "32px";
      ring.style.borderColor = "rgba(201,168,76,0.5)";
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseenter", onEnter);
    document.addEventListener("mouseleave", onLeave);

    const links = document.querySelectorAll("a, button");
    links.forEach((el) => {
      el.addEventListener("mouseenter", onLinkEnter);
      el.addEventListener("mouseleave", onLinkLeave);
    });

    rafId = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseenter", onEnter);
      document.removeEventListener("mouseleave", onLeave);
      links.forEach((el) => {
        el.removeEventListener("mouseenter", onLinkEnter);
        el.removeEventListener("mouseleave", onLinkLeave);
      });
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[9999] w-2 h-2 rounded-full bg-gold pointer-events-none opacity-0 transition-opacity duration-200"
        style={{ willChange: "transform" }}
      />
      <div
        ref={ringRef}
        className="fixed top-0 left-0 z-[9998] w-8 h-8 rounded-full border border-gold/50 pointer-events-none opacity-0 transition-[width,height,border-color,opacity] duration-200"
        style={{ willChange: "transform" }}
      />
    </>
  );
}
```

---

## Task 9: LangSwitcher component

**Files:**
- Create: `components/ui/LangSwitcher.tsx`

- [ ] **Step 1: Create `components/ui/LangSwitcher.tsx`**

```tsx
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
            className={`text-xs font-medium uppercase tracking-wider transition-colors duration-200 px-1 py-0.5 ${
              locale === l
                ? "text-gold"
                : "text-muted hover:text-forge-text"
            }`}
          >
            {l.toUpperCase()}
          </button>
          {i < locales.length - 1 && (
            <span className="text-muted text-xs">/</span>
          )}
        </span>
      ))}
    </div>
  );
}
```

---

## Task 10: ServiceCard component

**Files:**
- Create: `components/ui/ServiceCard.tsx`

- [ ] **Step 1: Create `components/ui/ServiceCard.tsx`**

```tsx
interface ServiceCardProps {
  number: string;
  icon: string;
  name: string;
  description: string;
  tags: string[];
}

const iconMap: Record<string, string> = {
  "01": "⚡",
  "02": "📈",
  "03": "🤖",
  "04": "✦",
  "05": "🔍",
  "06": "🛠",
};

export function ServiceCard({
  number,
  icon,
  name,
  description,
  tags,
}: ServiceCardProps) {
  return (
    <div className="group border border-border rounded-sm p-6 bg-surface hover:bg-surface2 transition-all duration-300 hover:border-gold/30 flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <span className="text-gold/60 font-heading text-lg">{number}</span>
        <span className="text-2xl">{iconMap[number] ?? icon}</span>
      </div>
      <div>
        <h3 className="font-heading text-2xl text-forge-text mb-2">{name}</h3>
        <p className="text-muted text-sm leading-relaxed">{description}</p>
      </div>
      <div className="flex flex-wrap gap-2 mt-auto">
        {tags.map((tag) => (
          <span
            key={tag}
            className="text-xs px-2 py-1 border border-border text-muted rounded-sm"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
```

---

## Task 11: TeamCard component

**Files:**
- Create: `components/ui/TeamCard.tsx`

- [ ] **Step 1: Create `components/ui/TeamCard.tsx`**

```tsx
interface TeamCardProps {
  name: string;
  role: string;
  bio: string;
  index: number;
}

export function TeamCard({ name, role, bio, index }: TeamCardProps) {
  return (
    <div className="team-card p-5 rounded-sm bg-surface cursor-default">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-surface2 border border-border flex items-center justify-center text-gold font-heading text-lg">
          {name.charAt(0)}
        </div>
        <div>
          <p className="text-forge-text font-medium text-sm">{name}</p>
          <p className="text-gold text-xs">{role}</p>
        </div>
      </div>
      <p className="text-muted text-sm leading-relaxed">{bio}</p>
    </div>
  );
}
```

---

## Task 12: CaseCard component

**Files:**
- Create: `components/ui/CaseCard.tsx`

- [ ] **Step 1: Create `components/ui/CaseCard.tsx`**

```tsx
"use client";
import type { CaseItem } from "@/lib/cases";

interface CaseCardProps {
  item: CaseItem;
  locale: string;
  viewLabel: string;
}

export function CaseCard({ item, locale, viewLabel }: CaseCardProps) {
  const loc = locale as keyof typeof item.title;
  return (
    <div className={`case-card relative overflow-hidden rounded-sm bg-gradient-to-br ${item.gradient} border border-border group aspect-[4/3]`}>
      {/* SVG placeholder */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10">
        <svg viewBox="0 0 200 150" className="w-3/4 h-3/4" fill="none">
          <rect x="20" y="20" width="160" height="110" rx="4" stroke="currentColor" strokeWidth="1" />
          <circle cx="60" cy="65" r="20" stroke="currentColor" strokeWidth="1" />
          <line x1="20" y1="95" x2="180" y2="95" stroke="currentColor" strokeWidth="1" />
          <rect x="90" y="45" width="70" height="8" rx="2" fill="currentColor" opacity="0.5" />
          <rect x="90" y="60" width="50" height="6" rx="2" fill="currentColor" opacity="0.3" />
        </svg>
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <p className="text-muted text-xs mb-1">{item.category[loc]}</p>
        <h3 className="font-heading text-2xl text-forge-text">{item.title[loc]}</h3>
        <div className="flex gap-4 mt-2">
          <span className="text-gold text-xs">↑ {item.metrics.conversion}</span>
          {item.metrics.roas !== "—" && (
            <span className="text-gold text-xs">ROAS {item.metrics.roas}</span>
          )}
          <span className="text-muted text-xs">{item.metrics.timeline}</span>
        </div>
      </div>

      {/* Hover overlay */}
      <div className="case-card-overlay absolute inset-0 bg-black/60 flex items-center justify-center">
        <button className="border border-gold text-gold font-heading text-lg px-6 py-2 hover:bg-gold hover:text-black transition-colors duration-200">
          {viewLabel}
        </button>
      </div>
    </div>
  );
}
```

---

## Task 13: Navbar section

**Files:**
- Create: `components/sections/Navbar.tsx`

- [ ] **Step 1: Create `components/sections/Navbar.tsx`**

```tsx
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

  const navLinks = [
    { href: "#about", label: t("about") },
    { href: "#services", label: t("services") },
    { href: "#cases", label: t("cases") },
    { href: "#contact", label: t("contact") },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "backdrop-blur-md bg-forge-black/80 border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="font-heading text-2xl text-forge-text tracking-widest hover:text-gold transition-colors">
          FORGE
        </a>

        {/* Nav links */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-muted text-sm hover:text-forge-text transition-colors duration-200 tracking-wide"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Right side: lang switcher + CTA */}
        <div className="flex items-center gap-4">
          <LangSwitcher />
          <a
            href="#contact"
            className="hidden sm:flex items-center gap-2 border border-gold text-gold text-sm font-medium px-4 py-1.5 hover:bg-gold hover:text-black transition-all duration-200"
          >
            {t("cta")}
          </a>
        </div>
      </div>
    </nav>
  );
}
```

---

## Task 14: Hero section

**Files:**
- Create: `components/sections/Hero.tsx`

- [ ] **Step 1: Create `components/sections/Hero.tsx`**

```tsx
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
    let dir = 1;
    let pos = 0;
    let raf: number;
    const animate = () => {
      pos += 0.5 * dir;
      if (pos >= 24 || pos <= 0) dir *= -1;
      el.style.transform = `scaleY(${1 + pos / 48})`;
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-16">
      {/* Decorative "F" background */}
      <div
        className="absolute inset-0 flex items-center justify-end pointer-events-none select-none overflow-hidden"
        aria-hidden="true"
      >
        <span
          className="font-heading text-[40vw] leading-none text-forge-text/[0.03] translate-x-[10%]"
          style={{ userSelect: "none" }}
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
          className="text-gold text-sm tracking-[0.3em] uppercase mb-6"
        >
          {t("tag")}
        </motion.p>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-heading text-[clamp(4rem,12vw,10rem)] leading-[0.9] text-forge-text uppercase mb-8 max-w-5xl"
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
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-wrap gap-4"
        >
          <a
            href="#contact"
            className="bg-gold text-black font-medium px-8 py-3 hover:bg-gold-light transition-colors duration-200"
          >
            {t("cta_primary")}
          </a>
          <a
            href="#cases"
            className="border border-border text-forge-text px-8 py-3 hover:border-gold hover:text-gold transition-all duration-200"
          >
            {t("cta_secondary")}
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-muted text-xs tracking-widest uppercase">{t("scroll")}</span>
        <div className="w-px h-12 bg-border overflow-hidden">
          <div
            ref={lineRef}
            className="w-full h-full bg-gold origin-top"
            style={{ transformOrigin: "top" }}
          />
        </div>
      </div>
    </section>
  );
}
```

---

## Task 15: Stats section

**Files:**
- Create: `components/sections/Stats.tsx`

- [ ] **Step 1: Create `components/sections/Stats.tsx`**

```tsx
"use client";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { RevealSection } from "@/components/ui/RevealSection";

function useCounter(target: number, duration = 1800) {
  const [count, setCount] = useState(0);
  const started = useRef(false);

  const start = () => {
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
  };

  return { count, start };
}

interface StatItemProps {
  valueStr: string;
  label: string;
  suffix?: string;
}

function StatItem({ valueStr, label, suffix = "" }: StatItemProps) {
  const numericTarget = parseInt(valueStr.replace(/\D/g, ""), 10) || 0;
  const { count, start } = useCounter(numericTarget);
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
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [start]);

  return (
    <div ref={ref} className="flex flex-col items-center text-center gap-2">
      <span className="font-heading text-[clamp(3rem,7vw,5rem)] text-gold leading-none">
        {count}{suffix}
      </span>
      <span className="text-muted text-sm tracking-wide uppercase">{label}</span>
    </div>
  );
}

export function Stats() {
  const t = useTranslations("stats");

  const stats = [
    { value: t("projects_value"), label: t("projects_label"), suffix: "+" },
    { value: t("clients_value"), label: t("clients_label"), suffix: "+" },
    { value: t("years_value"), label: t("years_label"), suffix: "+" },
    { value: t("return_value"), label: t("return_label"), suffix: "%" },
  ];

  return (
    <section className="py-24 border-y border-border">
      <RevealSection>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {stats.map((s) => (
              <StatItem key={s.label} valueStr={s.value} label={s.label} suffix={s.suffix} />
            ))}
          </div>
        </div>
      </RevealSection>
    </section>
  );
}
```

---

## Task 16: About section

**Files:**
- Create: `components/sections/About.tsx`

- [ ] **Step 1: Create `components/sections/About.tsx`**

```tsx
import { getTranslations } from "next-intl/server";
import { RevealSection } from "@/components/ui/RevealSection";
import { TeamCard } from "@/components/ui/TeamCard";

export async function About() {
  const t = await getTranslations("about");

  const members = [
    { name: t("member_1_name"), role: t("member_1_role"), bio: t("member_1_bio") },
    { name: t("member_2_name"), role: t("member_2_role"), bio: t("member_2_bio") },
    { name: t("member_3_name"), role: t("member_3_role"), bio: t("member_3_bio") },
  ];

  return (
    <section id="about" className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <RevealSection>
          <p className="text-gold text-xs tracking-[0.3em] uppercase mb-4">{t("label")}</p>
        </RevealSection>
        <div className="grid md:grid-cols-2 gap-16 items-start">
          {/* Left column */}
          <RevealSection delay={100}>
            <div>
              <h2 className="font-heading text-[clamp(2.5rem,5vw,4rem)] text-forge-text leading-[0.95] mb-6">
                {t("headline")}
              </h2>
              <p className="text-muted leading-relaxed mb-8">{t("description")}</p>
              <div className="flex items-center gap-3 text-forge-text">
                {t("team_formula").split("+").map((part, i, arr) => (
                  <span key={i} className="flex items-center gap-3">
                    <span className="font-heading text-xl text-gold">{part.trim()}</span>
                    {i < arr.length - 1 && <span className="text-gold/40 text-lg">+</span>}
                  </span>
                ))}
              </div>
            </div>
          </RevealSection>

          {/* Right column — team cards */}
          <RevealSection delay={200}>
            <div className="flex flex-col gap-3">
              <p className="text-muted text-xs tracking-[0.2em] uppercase mb-2">{t("team_label")}</p>
              {members.map((m, i) => (
                <TeamCard key={m.name} {...m} index={i} />
              ))}
            </div>
          </RevealSection>
        </div>
      </div>
    </section>
  );
}
```

---

## Task 17: Services section

**Files:**
- Create: `components/sections/Services.tsx`

- [ ] **Step 1: Create `components/sections/Services.tsx`**

```tsx
import { getTranslations } from "next-intl/server";
import { RevealSection } from "@/components/ui/RevealSection";
import { ServiceCard } from "@/components/ui/ServiceCard";

export async function Services() {
  const t = await getTranslations("services");

  const services = Array.from({ length: 6 }, (_, i) => {
    const n = String(i + 1).padStart(2, "0") as "01"|"02"|"03"|"04"|"05"|"06";
    return {
      number: t(`s${i + 1}_number` as Parameters<typeof t>[0]),
      name: t(`s${i + 1}_name` as Parameters<typeof t>[0]),
      description: t(`s${i + 1}_description` as Parameters<typeof t>[0]),
      tags: (t(`s${i + 1}_tags` as Parameters<typeof t>[0]) as string).split(","),
    };
  });

  return (
    <section id="services" className="py-24 bg-surface">
      <div className="max-w-7xl mx-auto px-6">
        <RevealSection>
          <div className="mb-12">
            <p className="text-gold text-xs tracking-[0.3em] uppercase mb-3">{t("label")}</p>
            <h2 className="font-heading text-[clamp(2.5rem,5vw,4rem)] text-forge-text leading-[0.95]">
              {t("headline")}
            </h2>
          </div>
        </RevealSection>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((s, i) => (
            <RevealSection key={s.number} delay={i * 80}>
              <ServiceCard {...s} icon="" />
            </RevealSection>
          ))}
        </div>
      </div>
    </section>
  );
}
```

---

## Task 18: Cases section

**Files:**
- Create: `components/sections/Cases.tsx`

- [ ] **Step 1: Create `components/sections/Cases.tsx`**

```tsx
import { getTranslations } from "next-intl/server";
import { getLocale } from "next-intl/server";
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
          <div className="mb-12">
            <p className="text-gold text-xs tracking-[0.3em] uppercase mb-3">{t("label")}</p>
            <h2 className="font-heading text-[clamp(2.5rem,5vw,4rem)] text-forge-text leading-[0.95]">
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
          {/* Placeholder card */}
          <RevealSection delay={cases.length * 100}>
            <div className="rounded-sm border-2 border-dashed border-border aspect-[4/3] flex flex-col items-center justify-center gap-3 hover:border-gold/40 transition-colors duration-300 group">
              <span className="text-4xl text-muted group-hover:text-gold transition-colors">+</span>
              <p className="text-muted text-sm">{t("placeholder_title")}</p>
              <p className="text-muted/60 text-xs">{t("placeholder_desc")}</p>
            </div>
          </RevealSection>
        </div>
      </div>
    </section>
  );
}
```

---

## Task 19: Contact section

**Files:**
- Create: `components/sections/Contact.tsx`

- [ ] **Step 1: Create `components/sections/Contact.tsx`**

```tsx
"use client";
import { useTranslations } from "next-intl";
import { RevealSection } from "@/components/ui/RevealSection";

export function Contact() {
  const t = useTranslations("contact");

  return (
    <section id="contact" className="py-24 bg-surface">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16">
          {/* Left */}
          <RevealSection>
            <div>
              <p className="text-gold text-xs tracking-[0.3em] uppercase mb-4">{t("label")}</p>
              <h2 className="font-heading text-[clamp(2.5rem,5vw,4rem)] text-forge-text leading-[0.95] mb-6">
                {t("headline")}
              </h2>
              <p className="text-muted leading-relaxed mb-8">{t("description")}</p>
              <div className="flex flex-col gap-3">
                <div>
                  <p className="text-muted text-xs uppercase tracking-wider mb-1">{t("email_label")}</p>
                  <a href={`mailto:${t("email_value")}`} className="text-forge-text hover:text-gold transition-colors">
                    {t("email_value")}
                  </a>
                </div>
                <div>
                  <p className="text-muted text-xs uppercase tracking-wider mb-1">{t("telegram_label")}</p>
                  <a href="#" className="text-forge-text hover:text-gold transition-colors">
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
              className="flex flex-col gap-4"
            >
              <input type="hidden" name="form-name" value="contact" />

              <div>
                <label className="text-muted text-xs uppercase tracking-wider block mb-1.5">
                  {t("name_label")}
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder={t("name_placeholder")}
                  required
                  className="w-full bg-surface2 border border-border text-forge-text placeholder:text-muted/50 px-4 py-3 text-sm focus:outline-none focus:border-gold/50 transition-colors"
                />
              </div>

              <div>
                <label className="text-muted text-xs uppercase tracking-wider block mb-1.5">
                  {t("contact_label")}
                </label>
                <input
                  type="text"
                  name="contact"
                  placeholder={t("contact_placeholder")}
                  required
                  className="w-full bg-surface2 border border-border text-forge-text placeholder:text-muted/50 px-4 py-3 text-sm focus:outline-none focus:border-gold/50 transition-colors"
                />
              </div>

              <div>
                <label className="text-muted text-xs uppercase tracking-wider block mb-1.5">
                  {t("message_label")}
                </label>
                <textarea
                  name="message"
                  placeholder={t("message_placeholder")}
                  required
                  rows={5}
                  className="w-full bg-surface2 border border-border text-forge-text placeholder:text-muted/50 px-4 py-3 text-sm focus:outline-none focus:border-gold/50 transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                className="bg-gold text-black font-medium py-3 hover:bg-gold-light transition-colors duration-200 tracking-wide"
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
```

---

## Task 20: Footer section

**Files:**
- Create: `components/sections/Footer.tsx`

- [ ] **Step 1: Create `components/sections/Footer.tsx`**

```tsx
import { getTranslations } from "next-intl/server";

export async function Footer() {
  const t = await getTranslations("footer");

  return (
    <footer className="border-t border-border py-8">
      <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-muted text-sm">{t("copyright")}</p>
        <span className="font-heading text-xl text-forge-text tracking-widest">FORGE</span>
        <p className="text-muted text-sm">{t("tagline")}</p>
      </div>
    </footer>
  );
}
```

---

## Task 21: Assemble page.tsx and add MagneticCursor

**Files:**
- Modify: `app/[locale]/page.tsx`

- [ ] **Step 1: Update `app/[locale]/page.tsx`**

```tsx
import { Navbar } from "@/components/sections/Navbar";
import { Hero } from "@/components/sections/Hero";
import { Stats } from "@/components/sections/Stats";
import { About } from "@/components/sections/About";
import { Services } from "@/components/sections/Services";
import { Cases } from "@/components/sections/Cases";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";
import { MagneticCursor } from "@/components/ui/MagneticCursor";

export default async function Home() {
  return (
    <>
      <MagneticCursor />
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <About />
        <Services />
        <Cases />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Add tsconfig path alias**

Ensure `tsconfig.json` has the `@/` path alias (should already be there from create-next-app, but verify):

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

- [ ] **Step 3: Run dev server and verify**

```bash
npm run dev
```

Open `http://localhost:3000` — should redirect to `/en`, show the full landing page with:
- Black background
- Gold accents
- Navbar with EN/UK/RU switcher
- Hero section with large "FORGE" headline
- All sections visible on scroll
- Custom cursor visible

- [ ] **Step 4: Test language switching**

Navigate to `/uk` and `/ru` — all text should switch to Ukrainian/Russian respectively.

- [ ] **Step 5: Run build check**

```bash
npm run build
```

Expected: build succeeds with no TypeScript errors.

---

## Spec Coverage Checklist

| Requirement | Task |
|-------------|------|
| Next.js App Router + [locale] | Task 5 |
| next-intl i18n with 3 languages | Tasks 2, 3 |
| proxy.ts middleware (Next.js 16) | Task 2 |
| i18n.ts config | Task 2 |
| navigation.ts (useRouter, usePathname) | Task 2 |
| Bebas Neue + DM Sans fonts | Task 5 |
| CSS variables (--gold, --black, etc.) | Task 4 |
| Tailwind v4 @theme tokens | Task 4 |
| Magnetic cursor | Task 8 |
| Lenis smooth scroll | Task 5 |
| Framer Motion transitions | Task 5 |
| Scroll reveal IntersectionObserver | Task 7 |
| Fixed navbar with scroll blur | Task 13 |
| LangSwitcher (gold active) | Task 9 |
| Hero section with big F bg | Task 14 |
| Counter animation on scroll | Task 15 |
| Stats 4-column grid | Task 15 |
| About 2-column with team cards | Task 16 |
| Team card gold border hover | Task 4 (CSS) + Task 11 |
| Services 3x2 grid | Task 17 |
| Cases 2x2 grid + placeholder | Task 18 |
| CaseCard with hover overlay | Task 12 |
| Case metrics display | Task 6, 12 |
| Contact form (Netlify) | Task 19 |
| Footer | Task 20 |
| /lib/cases.ts with CaseItem | Task 6 |
| messages/{en,uk,ru}.json | Task 3 |
| All text translated | Task 3 |
| TypeScript interfaces | All tasks |
| "use client" only where needed | Architecture |
