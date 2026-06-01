# Portfolio Landing — 8-bit NES Developer Presentation

Лендинг-презентация для тестового задания. Полное ТЗ: [SPEC.md](./SPEC.md).

Репозиторий: [github.com/AlekseyKopasov/portfolio-landing](https://github.com/AlekseyKopasov/portfolio-landing)

## Стек

- **Frontend:** Vite 6, TypeScript, SCSS, БЭМ
- **API:** Vercel Serverless (Node.js), Zod, Nodemailer
- **AI:** OpenAI Chat Completions (`/api/ai/polish`)
- **Деплой:** Vercel + GitHub

## Локальный запуск

```bash
npm install
cp .env.example .env   # заполнить SMTP и при необходимости OPENAI_API_KEY
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
- `OPENAI_API_KEY` — для AI (опционально)
- `OPENAI_BASE_URL`, `OPENAI_MODEL` — при необходимости

После изменения env — **Redeploy**.

## AI-инструменты в разработке

| Инструмент | Для чего |
|------------|----------|
| **Cursor** | Структура проекта, SCSS/БЭМ, API, README |
| **OpenAI API** | Кнопка «AI — CLEARER TEXT» на проде |

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
- ✅ AI polish (нужен `OPENAI_API_KEY` на Vercel)

Чеклист: [SPEC.md §12](./SPEC.md#12-критерии-приёмки-чеклист).
