import type { VercelRequest, VercelResponse } from '@vercel/node';
import { resolveAiConfig } from './provider';

/** GET /api/ai/status — доступен ли AI на сервере (без раскрытия ключей). */
export default function handler(_req: VercelRequest, res: VercelResponse) {
  const config = resolveAiConfig();

  return res.status(200).json({
    configured: Boolean(config),
    provider: config?.provider ?? null,
    model: config?.model ?? null,
    label: config?.label ?? null,
  });
}
