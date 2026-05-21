export type Service = {
  title: string;
  description: string;
  tags: string[];
};

export type WorkItem = {
  title: string;
  description: string;
  metric: string;
};

export type ProcessStep = {
  title: string;
  description: string;
};

export type ContactRequest = {
  name: string;
  email?: string;
  phone?: string;
  message: string;
  channel?: "site" | "telegram" | "manual";
};

export type SiteContent = {
  brand: {
    name: string;
    tagline: string;
    description: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    primaryCta: string;
    secondaryCta: string;
  };
  services: Service[];
  work: WorkItem[];
  process: ProcessStep[];
  stats: { label: string; value: string }[];
};

export const siteContent: SiteContent = {
  brand: {
    name: "MyFond",
    tagline: "Digital foundation for ambitious projects",
    description:
      "MyFond помогает запускать современные цифровые продукты: сайты, backend-сервисы, автоматизацию и ботов."
  },
  hero: {
    eyebrow: "Сайт • Backend • Автоматизация • Telegram",
    title: "Строим цифровую основу для проектов, которые должны выглядеть уверенно и работать быстро.",
    subtitle:
      "Мы собрали архитектуру так, чтобы сайт, сервер и будущий Telegram-бот использовали общий контент, единый API и могли развиваться без хаоса.",
    primaryCta: "Обсудить проект",
    secondaryCta: "Посмотреть работы"
  },
  services: [
    {
      title: "Инновационные сайты",
      description:
        "Лендинги и корпоративные сайты с сильной обложкой, плавными анимациями, адаптивной версткой и понятной структурой.",
      tags: ["React", "Vite", "Motion", "Responsive"]
    },
    {
      title: "Backend и API",
      description:
        "Серверная часть для заявок, контента, интеграций, админки и будущих мобильных или Telegram-интерфейсов.",
      tags: ["Fastify", "TypeScript", "REST", "Scalable"]
    },
    {
      title: "Автоматизация процессов",
      description:
        "Сбор заявок, уведомления, связка сайта с ботом, CRM, таблицами и внутренними рабочими процессами.",
      tags: ["Workflows", "CRM", "Notifications"]
    },
    {
      title: "Telegram-экосистема",
      description:
        "Архитектура уже готова к боту: он сможет брать данные из общего ядра и общаться с API сайта.",
      tags: ["Telegraf", "Bot", "Shared data"]
    }
  ],
  work: [
    {
      title: "Презентация бренда",
      description:
        "Сильный первый экран, четкое позиционирование, визуальная глубина и быстрый путь к заявке.",
      metric: "Hero-first"
    },
    {
      title: "Система заявок",
      description:
        "Форма на сайте отправляет данные на backend. Позже сюда можно подключить Telegram, email или CRM.",
      metric: "API-ready"
    },
    {
      title: "Единый контент",
      description:
        "Сайт, сервер и будущий бот используют общий пакет shared, поэтому данные не придется копировать вручную.",
      metric: "No duplication"
    }
  ],
  process: [
    {
      title: "01. Упаковка смысла",
      description:
        "Формируем структуру: кто вы, что делаете, почему вам доверять и что должен сделать посетитель."
    },
    {
      title: "02. Дизайн и движение",
      description:
        "Делаем обложку, визуальную систему, анимации и адаптивные секции под телефон и desktop."
    },
    {
      title: "03. Сервер и интеграции",
      description:
        "Подключаем API, обработку заявок и точки расширения под Telegram-бота, CRM и админку."
    },
    {
      title: "04. Запуск и развитие",
      description:
        "Проект готов к деплою и дальнейшему росту: новые страницы, бот, аналитика, админ-панель."
    }
  ],
  stats: [
    { label: "Архитектура", value: "Monorepo" },
    { label: "Frontend", value: "React" },
    { label: "Backend", value: "Fastify" },
    { label: "Bot-ready", value: "Yes" }
  ]
};
