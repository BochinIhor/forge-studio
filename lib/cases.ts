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
