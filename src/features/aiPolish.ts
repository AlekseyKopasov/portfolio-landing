type AiStatusType = 'idle' | 'loading' | 'success' | 'error' | 'unavailable';

function setAiStatus(
  el: HTMLElement,
  type: AiStatusType,
  message: string,
): void {
  el.className = 'form__ai-status';
  if (type !== 'idle') {
    el.classList.add(`form__ai-status--${type}`);
  }
  el.textContent = message;
}

export function initAiPolish(): void {
  const comment = document.getElementById('comment') as HTMLTextAreaElement | null;
  const polishBtn = document.getElementById('ai-polish-btn') as HTMLButtonElement | null;
  const aiStatus = document.getElementById('ai-polish-status');

  if (!comment || !polishBtn || !aiStatus) return;

  void (async () => {
    try {
      const res = await fetch('/api/ai/status');
      const data = (await res.json()) as { configured?: boolean };

      if (!data.configured) {
        polishBtn.disabled = true;
        polishBtn.title = 'Добавьте GROQ_API_KEY или GEMINI_API_KEY в Vercel';
        setAiStatus(
          aiStatus,
          'unavailable',
          'AI не подключён. Бесплатно: Groq или Google Gemini — ключ в Vercel (см. README).',
        );
      }
    } catch {
      /* при локальном npm run dev без vercel dev — проверка недоступна, кнопка остаётся активной */
    }
  })();

  polishBtn.addEventListener('click', async () => {
    const text = comment.value.trim();

    if (text.length < 3) {
      setAiStatus(aiStatus, 'error', 'Сначала набросайте мысль в комментарии (от 3 символов).');
      comment.focus();
      return;
    }

    polishBtn.disabled = true;
    setAiStatus(aiStatus, 'loading', 'AI переформулирует текст...');

    try {
      const response = await fetch('/api/ai/polish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      const data = (await response.json().catch(() => ({}))) as {
        text?: string;
        message?: string;
        error?: string;
      };

      if (!response.ok) {
        setAiStatus(
          aiStatus,
          'error',
          data.message ?? data.error ?? 'AI недоступен. Отредактируйте текст вручную.',
        );
        return;
      }

      if (!data.text) {
        setAiStatus(aiStatus, 'error', 'Пустой ответ AI. Попробуйте ещё раз.');
        return;
      }

      comment.value = data.text;
      setAiStatus(aiStatus, 'success', 'Готово. Проверьте текст перед отправкой.');
      comment.focus();
    } catch {
      setAiStatus(aiStatus, 'error', 'Нет связи с AI. Проверьте сеть или напишите вручную.');
    } finally {
      if (!polishBtn.title) {
        polishBtn.disabled = false;
      }
    }
  });
}
