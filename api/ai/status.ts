import type { VercelRequest, VercelResponse } from '@vercel/node';

/** GET /api/ai/status — доступен ли AI на сервере (без раскрытия ключей). */
export default function handler(_req: VercelRequest, res: VercelResponse) {
  const configured = Boolean(process.env.OPENAI_API_KEY?.trim());

  return res.status(200).json({
    configured,
    model: configured ? (process.env.OPENAI_MODEL ?? 'gpt-4o-mini') : null,
  });
}
