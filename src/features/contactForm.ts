interface FormPayload {
  name: string;
  phone: string;
  email: string;
  comment: string;
  website?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[\d\s+()-]{10,}$/;

function getField(id: string): HTMLInputElement | HTMLTextAreaElement | null {
  return document.getElementById(id) as HTMLInputElement | HTMLTextAreaElement | null;
}

function setFieldError(fieldId: string, message: string): void {
  const input = getField(fieldId);
  const errorEl = document.getElementById(`${fieldId}-error`);
  if (!input || !errorEl) return;

  if (input instanceof HTMLTextAreaElement) {
    input.classList.toggle('form__textarea--error', Boolean(message));
  } else {
    input.classList.toggle('form__input--error', Boolean(message));
  }
  input.setAttribute('aria-invalid', message ? 'true' : 'false');
  errorEl.textContent = message;
}

function clearErrors(): void {
  ['name', 'phone', 'email', 'comment'].forEach((id) => setFieldError(id, ''));
}

function validate(payload: FormPayload): boolean {
  let valid = true;

  if (!payload.name.trim()) {
    setFieldError('name', 'Введите имя');
    valid = false;
  } else {
    setFieldError('name', '');
  }

  if (!PHONE_RE.test(payload.phone.trim())) {
    setFieldError('phone', 'Укажите корректный телефон');
    valid = false;
  } else {
    setFieldError('phone', '');
  }

  if (!EMAIL_RE.test(payload.email.trim())) {
    setFieldError('email', 'Укажите корректный email');
    valid = false;
  } else {
    setFieldError('email', '');
  }

  if (!payload.comment.trim()) {
    setFieldError('comment', 'Добавьте комментарий');
    valid = false;
  } else {
    setFieldError('comment', '');
  }

  return valid;
}

function setStatus(
  statusEl: HTMLElement,
  type: 'idle' | 'loading' | 'success' | 'error',
  message: string,
): void {
  statusEl.className = 'form__status';
  if (type !== 'idle') {
    statusEl.classList.add(`form__status--${type}`);
  }
  statusEl.textContent = message;
}

export function initContactForm(): void {
  const form = document.getElementById('contact-form') as HTMLFormElement | null;
  const statusEl = document.getElementById('form-status');
  const submitBtn = form?.querySelector<HTMLButtonElement>('.form__submit');

  if (!form || !statusEl || !submitBtn) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    clearErrors();

    const payload: FormPayload = {
      name: (getField('name')?.value ?? '').trim(),
      phone: (getField('phone')?.value ?? '').trim(),
      email: (getField('email')?.value ?? '').trim(),
      comment: (getField('comment')?.value ?? '').trim(),
      website: (document.getElementById('website') as HTMLInputElement | null)?.value ?? '',
    };

    if (payload.website) {
      setStatus(statusEl, 'success', 'Сообщение отправлено.');
      form.reset();
      return;
    }

    if (!validate(payload)) {
      setStatus(statusEl, 'error', 'Проверьте поля формы.');
      return;
    }

    submitBtn.disabled = true;
    setStatus(statusEl, 'loading', 'Отправка...');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = (await response.json().catch(() => ({}))) as { message?: string; error?: string };

      if (!response.ok) {
        const msg =
          data.message ??
          data.error ??
          (response.status === 501
            ? 'Сервис почты ещё настраивается. Напишите на email из контактов.'
            : 'Не удалось отправить. Попробуйте позже.');
        setStatus(statusEl, 'error', msg);
        return;
      }

      setStatus(statusEl, 'success', 'Спасибо! Сообщение отправлено, копия ушла на ваш email.');
      form.reset();
    } catch {
      setStatus(statusEl, 'error', 'Нет связи с сервером. Проверьте сеть и попробуйте снова.');
    } finally {
      submitBtn.disabled = false;
    }
  });
}
