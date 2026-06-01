# Portfolio Landing — 8-bit NES Developer Presentation

Лендинг-презентация для тестового задания. Полное ТЗ: [SPEC.md](./SPEC.md).

## Стек

- **Frontend:** Vite, TypeScript, SCSS, БЭМ
- **API:** Vercel Serverless (Node.js)
- **Деплой:** Vercel + GitHub

## Локальный запуск

```bash
# из корня репозитория
npm install
npm run dev
```

Откройте URL из терминала (обычно http://localhost:5173).

API локально на Vercel Dev (опционально):

```bash
npx vercel dev
```

Скопируйте `.env.example` → `.env` и заполните SMTP перед тестом формы.

## Скрипты

| Команда | Действие |
|---------|----------|
| `npm run dev` | Dev-сервер Vite |
| `npm run build` | Production-сборка → `apps/web/dist` |
| `npm run preview` | Просмотр сборки |

## Деплой на Vercel (автодеплой из GitHub)

1. Запушьте репозиторий на GitHub.
2. [vercel.com/new](https://vercel.com/new) → Import этого репозитория.
3. Настройки (обычно подхватываются из `vercel.json`):
   - **Root Directory:** `.`
   - **Build Command:** `npm run build`
   - **Output Directory:** `apps/web/dist`
4. **Settings → Environment Variables** — переменные из `.env.example`.
5. Deploy. Каждый `push` в `main` обновляет production.

Preview-деплои создаются автоматически для Pull Request.

## Статус реализации

См. чеклист в [SPEC.md §12](./SPEC.md#12-критерии-приёмки-чеклист).

## AI

Будет описано после этапа 6 (см. SPEC.md §10).
