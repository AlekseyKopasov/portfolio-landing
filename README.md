# Portfolio Landing — 8-bit NES Developer Presentation

Лендинг-презентация для тестового задания. Полное ТЗ: [SPEC.md](./SPEC.md).

Репозиторий: [github.com/AlekseyKopasov/portfolio-landing](https://github.com/AlekseyKopasov/portfolio-landing)

## Стек

- **Frontend:** Vite 6, TypeScript, SCSS, БЭМ
- **API:** Vercel Serverless (Node.js), Zod, Nodemailer
- **AI:** Groq / Gemini / OpenAI (`/api/ai/polish`) — по умолчанию бесплатный **Groq**
- **Деплой:** Vercel + GitHub

## Локальный запуск

```bash
npm install
cp .env.example .env   # SMTP + GROQ_API_KEY (или GEMINI_API_KEY)
npm run dev            # только фронт — http://localhost:5173
npx vercel dev         # фронт + /api/*
```

## Скрипты

| Команда | Действие |
|---------|----------|
| `npm run dev` | Dev-сервер Vite |
| `npm run build` | Production-сборка → `dist/` |
| `npm run preview` | Просмотр сборки |

## Форма обратной связи

1. Пользователь заполняет имя, телефон, email, комментарий.
2. Опционально: **AI — CLEARER TEXT** → `POST /api/ai/polish` переформулирует комментарий (редактируется вручную перед отправкой).
3. `POST /api/contact` — валидация Zod, письмо владельцу + копия пользователю.
4. UI: loading / success / error, honeypot, `aria-live`.

## Переменные окружения (Vercel)

Скопировать из `.env.example` в **Project → Settings → Environment Variables** (Production):

- `SMTP_*`, `MAIL_FROM`, `MAIL_TO` — для формы
- **AI (бесплатно, один ключ):**
  - **`GROQ_API_KEY`** — [console.groq.com/keys](https://console.groq.com/keys) (рекомендуется)
  - или **`GEMINI_API_KEY`** — [aistudio.google.com/apikey](https://aistudio.google.com/apikey)
- `OPENAI_API_KEY` — только если нужен платный OpenAI

Проверка: `https://ваш-сайт.vercel.app/api/ai/status` → `"configured": true`.

После изменения env — **Redeploy**.

### Groq за 2 минуты (бесплатно)

1. Регистрация на [console.groq.com](https://console.groq.com)
2. **API Keys** → Create API Key
3. Vercel → **Environment Variables** → `GROQ_API_KEY` = ключ → **Production**
4. **Redeploy**

## AI-инструменты в разработке

| Инструмент | Для чего |
|------------|----------|
| **Cursor** | Структура проекта, SCSS/БЭМ, API, README |
| **Groq / Gemini API** | Кнопка «AI — CLEARER TEXT» (бесплатный tier) |

### С помощью AI

- Каркас файлов, черновики `renderPage`, `contact.ts`, `polish.ts`
- Базовые стили NES и структура README

### Вручную доработано

- Контент кейсов (NDA-safe) из резюме
- Валидация формы, a11y (`skip-link`, `aria-live`, `focus`)
- Деплой Vercel (Node 20, flat root), исправление сборки
- Промпт AI: без выдуманных фактов, только переформулировка

## Деплой

См. [DEPLOY.md](./DEPLOY.md).

## Статус

- ✅ Лендинг, форма, API почты
- ✅ AI polish (нужен `GROQ_API_KEY` или `GEMINI_API_KEY` на Vercel)

Чеклист: [SPEC.md §12](./SPEC.md#12-критерии-приёмки-чеклист).
