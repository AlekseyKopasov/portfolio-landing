export function initAiPolish(): void {
  const comment = document.getElementById('comment') as HTMLTextAreaElement | null;
  const polishBtn = document.getElementById('ai-polish-btn') as HTMLButtonElement | null;
  const aiStatus = document.getElementById('ai-polish-status');

  if (!comment || !polishBtn || !aiStatus) return;

  const setAiStatus = (type: 'idle' | 'loading' | 'success' | 'error', message: string) => {
    aiStatus.className = 'form__ai-status';
    if (type !== 'idle') {
      aiStatus.classList.add(`form__ai-status--${type}`);
    }
    aiStatus.textContent = message;
  };

  polishBtn.addEventListener('click', async () => {
    const text = comment.value.trim();

    if (text.length < 3) {
      setAiStatus('error', 'Сначала набросайте мысль в комментарии (от 3 символов).');
      comment.focus();
      return;
    }

    polishBtn.disabled = true;
    setAiStatus('loading', 'AI переформулирует текст...');

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
        setAiStatus('error', data.message ?? data.error ?? 'AI недоступен. Отредактируйте текст вручную.');
        return;
      }

      if (!data.text) {
        setAiStatus('error', 'Пустой ответ AI. Попробуйте ещё раз.');
        return;
      }

      comment.value = data.text;
      setAiStatus('success', 'Готово. Проверьте текст перед отправкой.');
      comment.focus();
    } catch {
      setAiStatus('error', 'Нет связи с AI. Проверьте сеть или напишите вручную.');
    } finally {
      polishBtn.disabled = false;
    }
  });
}
