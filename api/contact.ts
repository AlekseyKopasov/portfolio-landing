import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * POST /api/contact — форма обратной связи.
 * Реализация: этап 4 (SPEC.md §6).
 */
export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  return res.status(501).json({
    error: 'Not implemented',
    message: 'Contact API will be implemented in stage 4 (see SPEC.md).',
  });
}
