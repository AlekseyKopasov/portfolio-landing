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
3. Проверить настройки (из `vercel.json`):

   | Поле | Значение |
   |------|----------|
   | Framework Preset | Vite (или Other) |
   | Root Directory | `.` |
   | Build Command | `npm run build` |
   | Output Directory | `apps/web/dist` |
   | Install Command | `npm install` |

4. **Deploy** (первый деплой без SMTP — форма вернёт 501, это ожидаемо).
5. После этапа 4 формы: **Settings → Environment Variables** — скопировать из `.env.example`.

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
