import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

const polishSchema = z.object({
  text: z.string().trim().min(3, 'Введите хотя бы несколько слов').max(2000, 'Слишком длинный текст'),
});

const SYSTEM_PROMPT = [
  'Ты помощник на лендинге IT-специалиста.',
  'Переформулируй черновик комментария вежливо, ясно и по-русски.',
  'Сохрани смысл, не добавляй фактов, которых нет в исходнике.',
  'Ответ — только готовый текст (2–4 предложения), без кавычек и пояснений.',
].join(' ');

interface ChatCompletionResponse {
  choices?: Array<{
    message?: { content?: string };
  }>;
}

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

  const apiKey = process.env.OPENAI_API_KEY;
  const baseUrl = (process.env.OPENAI_BASE_URL ?? 'https://api.openai.com/v1').replace(/\/$/, '');
  const model = process.env.OPENAI_MODEL ?? 'gpt-4o-mini';

  if (!apiKey) {
    return res.status(503).json({
      error: 'AI not configured',
      message: 'AI не настроен на сервере. Напишите комментарий вручную.',
    });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25_000);

  try {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.4,
        max_tokens: 400,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: parsed.data.text },
        ],
      }),
      signal: controller.signal,
    });

    const data = (await response.json().catch(() => ({}))) as ChatCompletionResponse & {
      error?: { message?: string };
    };

    if (!response.ok) {
      console.error('OpenAI error:', data);
      return res.status(502).json({
        error: 'AI provider error',
        message: 'Сервис AI временно недоступен. Попробуйте позже.',
      });
    }

    const polished = data.choices?.[0]?.message?.content?.trim();

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
        : 'Ошибка AI. Напишите комментарий вручную.',
    });
  } finally {
    clearTimeout(timeout);
  }
}
