export const SYSTEM_PROMPT = [
  'Ты помощник на лендинге IT-специалиста.',
  'Переформулируй черновик комментария вежливо, ясно и по-русски.',
  'Сохрани смысл, не добавляй фактов, которых нет в исходнике.',
  'Ответ — только готовый текст (2–4 предложения), без кавычек и пояснений.',
].join(' ');

export type AiProviderId = 'groq' | 'gemini' | 'openai';

export interface AiRuntimeConfig {
  provider: AiProviderId;
  model: string;
  /** Для /api/ai/status (без секретов) */
  label: string;
}

function trimKey(value: string | undefined): string | undefined {
  const key = value?.trim();
  return key || undefined;
}

/** Приоритет по умолчанию: Groq → Gemini → OpenAI (бесплатные tier у Groq/Gemini). */
export function resolveAiConfig(): AiRuntimeConfig | null {
  const forced = process.env.AI_PROVIDER?.trim().toLowerCase() as AiProviderId | undefined;

  const groqKey = trimKey(process.env.GROQ_API_KEY);
  const geminiKey = trimKey(process.env.GEMINI_API_KEY);
  const openaiKey = trimKey(process.env.OPENAI_API_KEY);

  if (forced === 'groq' && groqKey) {
    return {
      provider: 'groq',
      model: process.env.GROQ_MODEL?.trim() || 'llama-3.1-8b-instant',
      label: 'Groq (free tier)',
    };
  }

  if (forced === 'gemini' && geminiKey) {
    return {
      provider: 'gemini',
      model: process.env.GEMINI_MODEL?.trim() || 'gemini-2.0-flash',
      label: 'Google Gemini (free tier)',
    };
  }

  if (forced === 'openai' && openaiKey) {
    return {
      provider: 'openai',
      model: process.env.OPENAI_MODEL?.trim() || 'gpt-4o-mini',
      label: 'OpenAI',
    };
  }

  if (groqKey) {
    return {
      provider: 'groq',
      model: process.env.GROQ_MODEL?.trim() || 'llama-3.1-8b-instant',
      label: 'Groq (free tier)',
    };
  }

  if (geminiKey) {
    return {
      provider: 'gemini',
      model: process.env.GEMINI_MODEL?.trim() || 'gemini-2.0-flash',
      label: 'Google Gemini (free tier)',
    };
  }

  if (openaiKey) {
    return {
      provider: 'openai',
      model: process.env.OPENAI_MODEL?.trim() || 'gpt-4o-mini',
      label: 'OpenAI',
    };
  }

  return null;
}

async function polishWithOpenAiCompatible(
  baseUrl: string,
  apiKey: string,
  model: string,
  userText: string,
  signal: AbortSignal,
): Promise<string | null> {
  const response = await fetch(`${baseUrl.replace(/\/$/, '')}/chat/completions`, {
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
        { role: 'user', content: userText },
      ],
    }),
    signal,
  });

  const data = (await response.json().catch(() => ({}))) as {
    choices?: Array<{ message?: { content?: string } }>;
    error?: { message?: string };
  };

  if (!response.ok) {
    console.error('OpenAI-compatible AI error:', data);
    throw new Error(data.error?.message ?? 'provider_error');
  }

  return data.choices?.[0]?.message?.content?.trim() ?? null;
}

async function polishWithGemini(
  apiKey: string,
  model: string,
  userText: string,
  signal: AbortSignal,
): Promise<string | null> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: `${SYSTEM_PROMPT}\n\nЧерновик комментария:\n${userText}` }],
        },
      ],
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 400,
      },
    }),
    signal,
  });

  const data = (await response.json().catch(() => ({}))) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    error?: { message?: string };
  };

  if (!response.ok) {
    console.error('Gemini AI error:', data);
    throw new Error(data.error?.message ?? 'provider_error');
  }

  return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? null;
}

export async function polishText(
  config: AiRuntimeConfig,
  userText: string,
  signal: AbortSignal,
): Promise<string | null> {
  switch (config.provider) {
    case 'groq':
      return polishWithOpenAiCompatible(
        'https://api.groq.com/openai/v1',
        process.env.GROQ_API_KEY!,
        config.model,
        userText,
        signal,
      );
    case 'gemini':
      return polishWithGemini(process.env.GEMINI_API_KEY!, config.model, userText, signal);
    case 'openai': {
      const baseUrl = process.env.OPENAI_BASE_URL ?? 'https://api.openai.com/v1';
      return polishWithOpenAiCompatible(
        baseUrl,
        process.env.OPENAI_API_KEY!,
        config.model,
        userText,
        signal,
      );
    }
    default:
      return null;
  }
}
