import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';
import { polishText, resolveAiConfig } from './provider';

const polishSchema = z.object({
  text: z.string().trim().min(3, 'Введите хотя бы несколько слов').max(2000, 'Слишком длинный текст'),
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const parsed = polishSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: 'Validation failed',
      message: parsed.error.issues[0]?.message ?? 'Некорректный текст',
    });
  }

  const aiConfig = resolveAiConfig();

  if (!aiConfig) {
    return res.status(503).json({
      error: 'AI not configured',
      message:
        'AI не настроен. Добавьте бесплатный GROQ_API_KEY или GEMINI_API_KEY в Vercel (см. README).',
    });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25_000);

  try {
    const polished = await polishText(aiConfig, parsed.data.text, controller.signal);

    if (!polished) {
      return res.status(502).json({
        error: 'Empty AI response',
        message: 'Не удалось получить ответ. Попробуйте ещё раз.',
      });
    }

    return res.status(200).json({ text: polished });
  } catch (error) {
    const isAbort = error instanceof Error && error.name === 'AbortError';
    console.error('AI polish error:', error);
    return res.status(isAbort ? 504 : 500).json({
      error: isAbort ? 'Timeout' : 'Internal error',
      message: isAbort
        ? 'AI не успел ответить. Попробуйте короче или повторите.'
        : 'Сервис AI временно недоступен. Напишите комментарий вручную.',
    });
  } finally {
    clearTimeout(timeout);
  }
}
