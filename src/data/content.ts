export interface CaseItem {
  id: string;
  title: string;
  domain: string;
  role: string;
  stack: string[];
  tasks: string[];
  result: string;
  personal: string;
}

export interface ContactLink {
  id: string;
  label: string;
  href: string;
  external?: boolean;
}

export const profile = {
  name: 'Алексей Копасов',
  role: 'Senior Fullstack Developer',
  tagline: 'Frontend-heavy · enterprise · интеграции',
  location: 'Санкт-Петербург',
  format: 'Удалённо / гибрид',
  experience: '~8 лет коммерческого опыта',
  about: [
    'Fullstack-разработчик: внутренние веб-системы, корпоративные порталы, интеграции с 1С и внешними сервисами.',
    'Закрываю задачи end-to-end — от интерфейса и адаптивной вёрстки до backend-логики и API-контрактов.',
    'Быстро погружаюсь в сложные проекты и legacy-код; соблюдаю дедлайны.',
  ],
  directions: [
    'Enterprise и internal web',
    'Корпоративные порталы',
    'Интеграции 1С / REST',
    'Бронирование и e-commerce',
    'Документооборот и автоматизация',
  ],
};

export const stack = [
  'TypeScript',
  'JavaScript',
  'React',
  'Vue',
  'Angular',
  'PHP',
  'Bitrix D7',
  'REST API',
  'MySQL',
  'Git',
  'Webpack',
  'Vite',
  'SCSS',
  'БЭМ',
  'Figma',
  'Jest',
  'Storybook',
  'CI/CD',
  'Docker',
];

export const workflow = {
  approach: [
    'Разбираю задачу и ограничения, согласую API-контракты при интеграциях.',
    'Делаю итерациями: UI → API → обработка ошибок → проверка на адаптиве и a11y.',
    'Документирую решения в README и коммитах (Conventional Commits).',
  ],
  ai: [
    'Cursor / Copilot — boilerplate, черновики README, рефакторинг.',
    'Вручную проверяю: БЭМ, безопасность форм, edge cases, доступность.',
    'В README фиксирую, что сгенерировано AI и что доработано руками.',
  ],
};

export const cases: CaseItem[] = [
  {
    id: 'case-1',
    title: 'Корпоративный портал + e-commerce',
    domain: 'Enterprise / retail',
    role: 'Senior Full-Stack',
    stack: ['Bitrix D7', 'D7 ORM', 'Highload', 'PHP', 'SCSS', 'БЭМ'],
    tasks: [
      'Кастомные модули и управление заказами',
      'Интеграция оплаты (callback, подписи, статусы)',
      'OAuth MosID, AJAX-эндпоинты без перезагрузки',
    ],
    result: 'Портал с e-commerce и платёжным контуром',
    personal: 'Модули D7, интеграции, адаптив по Figma',
  },
  {
    id: 'case-2',
    title: 'Система бронирования',
    domain: 'Образование / гостиница',
    role: 'Senior Fullstack',
    stack: ['Bitrix D7', 'REST', '1С', 'JavaScript'],
    tasks: [
      'Модуль с нуля: календарь, фильтры, расчёт стоимости',
      'Синхронизация с 1С, проверка доступности в реальном времени',
    ],
    result: 'Рабочее бронирование с актуальными данными',
    personal: 'Архитектура модуля, API-контракты с командой 1С',
  },
  {
    id: 'case-3',
    title: 'Рейтингование ППС',
    domain: 'Образование',
    role: 'Fullstack',
    stack: ['PHP', 'Bitrix', '1С', 'DOCX/PDF'],
    tasks: ['Сбор данных из 1С', 'Расчёт рейтинга по формулам', 'Автогенерация документов'],
    result: 'Срок процесса: 2 недели → 1 день',
    personal: 'Автоматизация расчёта и выгрузки документов',
  },
  {
    id: 'case-4',
    title: 'Подача заявлений на конкурс',
    domain: 'Образование',
    role: 'Fullstack',
    stack: ['REST API', 'PHP', 'Forms'],
    tasks: ['Предзаполнение анкет из API', 'Валидация, черновики', 'Пакет документов'],
    result: '2–3 дня → 20 минут',
    personal: 'Формы, интеграция API, генерация пакета',
  },
  {
    id: 'case-5',
    title: 'Веб-кабинет тестирования',
    domain: 'EdTech',
    role: 'Frontend / Fullstack',
    stack: ['JavaScript', 'SCSS', 'Charts'],
    tasks: ['Категории студентов', 'Графики и таблицы результатов', 'Адаптив'],
    result: 'Сдан за 1 месяц без критических багов',
    personal: 'UI, адаптив, доработка под роли',
  },
  {
    id: 'case-6',
    title: 'Лендинги и корпоративные сайты',
    domain: 'Агентство / promo',
    role: 'Frontend Developer',
    stack: ['HTML', 'SCSS', 'БЭМ', 'Webpack', 'Figma'],
    tasks: ['Вёрстка с нуля и доработки', 'Интеграция API форм и калькуляторов'],
    result: 'Десятки проектов в командах 2–8 человек',
    personal: 'Вёрстка, рефакторинг, интеграция с backend',
  },
];

export const contacts: ContactLink[] = [
  {
    id: 'email',
    label: 'Email',
    href: 'mailto:alesey.k1@yandex.ru',
  },
  {
    id: 'telegram',
    label: 'Telegram',
    href: 'https://t.me/aleksey_kpsv',
    external: true,
  },
  {
    id: 'github',
    label: 'GitHub',
    href: 'https://github.com/AlekseyKopasov',
    external: true,
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/aleksey-kopasov-6375b9124',
    external: true,
  },
  {
    id: 'hh',
    label: 'Резюме HH',
    href: 'https://spb.hh.ru/resume/40b071e0ff062968700039ed1f684443415636',
    external: true,
  },
];

export const levels = [
  { id: 'hero', num: '00', title: 'TITLE SCREEN' },
  { id: 'stats', num: '01', title: 'PLAYER STATS' },
  { id: 'workflow', num: '02', title: 'HOW TO PLAY' },
  { id: 'cases', num: '03', title: 'STAGES CLEARED' },
  { id: 'contact', num: '04', title: 'CONTINUE?' },
] as const;
