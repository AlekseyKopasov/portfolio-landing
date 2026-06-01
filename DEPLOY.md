# Подключение GitHub и Vercel (шаг 0)

Репозиторий инициализирован локально. Дальше — вручную (≈10 мин).

## 1. GitHub

```bash
cd C:/__Projects__/pet/presentation

# создайте пустой репозиторий на github.com (без README)
# затем:
git remote add origin https://github.com/AlekseyKopasov/ИМЯ-РЕПО.git
git push -u origin main
```

Или через GitHub Desktop / IDE.

## 2. Vercel

1. Войти на [vercel.com](https://vercel.com) (можно через GitHub).
2. **Add New… → Project** → Import репозитория.
3. В **Project Settings → General → Node.js Version** выбрать **20.x** (на Node 24 сборка Vite/rolldown падала с `MODULE_NOT_FOUND`).
4. Проверить настройки (из `vercel.json`):

   | Поле | Значение |
   |------|----------|
   | Framework Preset | Vite (или Other) |
   | Root Directory | `.` |
   | Build Command | `npm run build` |
   | Output Directory | `dist` |
   | Install Command | `npm install` |

5. **Deploy** (первый деплой без SMTP — форма вернёт 501, это ожидаемо).
6. **Settings → Environment Variables** — см. ниже (SMTP и AI).

### Переменные для формы и AI

| Переменная | Нужна для |
|------------|-----------|
| `SMTP_*`, `MAIL_FROM`, `MAIL_TO` | Отправка формы |
| `OPENAI_API_KEY` | Кнопка **AI — CLEARER TEXT** |
| `OPENAI_MODEL` | опционально, по умолчанию `gpt-4o-mini` |
| `OPENAI_BASE_URL` | опционально, если не OpenAI (совместимый API) |

После добавления переменных — **Deployments → Redeploy** (без redeploy env не подхватится).

Проверка AI: откройте `https://ваш-сайт.vercel.app/api/ai/status` — должно быть `{"configured":true,...}`.

Ключ OpenAI: [platform.openai.com/api-keys](https://platform.openai.com/api-keys) → Create secret key → вставить в Vercel (Production).

## 3. Автодеплой

Работает сразу после Import:

- `git push` в `main` → production;
- Pull Request → preview URL.

Дополнительный GitHub Actions для деплоя **не нужен** — только `ci.yml` для проверки сборки.

## 4. Локально с API (опционально)

```bash
npm i -g vercel   # или npx vercel
vercel login
vercel link       # в корне проекта
vercel dev        # фронт + /api/*
```

## 5. Проверка

- Сайт: `https://ваш-проект.vercel.app`
- API: `curl -X POST https://ваш-проект.vercel.app/api/contact` → `501` до реализации формы

## 6. Если билд снова падает (чеклист по логам)

В начале лога должно быть:

```text
Commit: dad6940   # или новее; 357e1c6 — старая версия с Vite 8
```

После `npm install`:

```text
audited 140+ packages   # норма
audited 36 packages     # ошибка: неверный Root Directory или старая структура monorepo
```

**Vercel → Project Settings → General:**

| Параметр | Значение |
|----------|----------|
| Root Directory | пусто или `.` (корень репо; структура без `apps/web`) |
| Node.js Version | **20.x** |
| Build Command | `npm run build` (из `vercel.json`) |
| Output Directory | `dist` |

**Deployments** → последний деплой с `main` → **⋯ → Redeploy** (не старый деплой с `357e1c6`).
