import { cases, contacts, levels, profile, stack, workflow } from '../data/content';
import { escapeHtml } from '../utils/escapeHtml';

function renderNav(): string {
  const links = levels
    .filter((level) => level.id !== 'hero')
    .map(
      (level) =>
        `<li class="nav__item">
          <a class="nav__link" href="#${level.id}">${escapeHtml(level.title)}</a>
        </li>`,
    )
    .join('');

  return `
    <nav class="nav" aria-label="Навигация по разделам">
      <ul class="nav__list">${links}</ul>
    </nav>
  `;
}

function renderHero(): string {
  const directions = profile.directions
    .map((item) => `<li class="hero__direction-item">${escapeHtml(item)}</li>`)
    .join('');

  return `
    <section class="hero level-card" id="hero" aria-labelledby="hero-title">
      <p class="hero__blink-text" aria-hidden="true">PRESS START</p>
      <header class="level-card__header">
        <span class="level-card__badge">LV ${levels[0].num}</span>
        <h1 class="hero__title level-card__title" id="hero-title">${escapeHtml(profile.name)}</h1>
      </header>
      <p class="hero__subtitle">${escapeHtml(profile.role)}</p>
      <p class="hero__tagline">${escapeHtml(profile.tagline)}</p>
      <ul class="hero__meta">
        <li class="hero__meta-item">${escapeHtml(profile.location)}</li>
        <li class="hero__meta-item">${escapeHtml(profile.format)}</li>
        <li class="hero__meta-item">${escapeHtml(profile.experience)}</li>
      </ul>
      <ul class="hero__directions">${directions}</ul>
      ${profile.about.map((p) => `<p class="hero__text">${escapeHtml(p)}</p>`).join('')}
      <a class="hero__cta" href="#contact">INSERT COIN — связаться</a>
    </section>
  `;
}

function renderStats(): string {
  const chips = stack
    .map((tech) => `<li class="inventory__item"><span class="chip">${escapeHtml(tech)}</span></li>`)
    .join('');

  return `
    <section class="level-card" id="stats" aria-labelledby="stats-title">
      <header class="level-card__header">
        <span class="level-card__badge">LV ${levels[1].num}</span>
        <h2 class="level-card__title" id="stats-title">PLAYER STATS</h2>
      </header>
      <p class="level-card__lead">Инвентарь технологий</p>
      <ul class="inventory">${chips}</ul>
    </section>
  `;
}

function renderWorkflow(): string {
  const list = (items: string[]) =>
    items.map((item) => `<li class="level-card__list-item">${escapeHtml(item)}</li>`).join('');

  return `
    <section class="level-card" id="workflow" aria-labelledby="workflow-title">
      <header class="level-card__header">
        <span class="level-card__badge">LV ${levels[2].num}</span>
        <h2 class="level-card__title" id="workflow-title">HOW TO PLAY</h2>
      </header>
      <h3 class="level-card__subtitle">Подход к задачам</h3>
      <ul class="level-card__list">${list(workflow.approach)}</ul>
      <h3 class="level-card__subtitle">AI в работе</h3>
      <ul class="level-card__list">${list(workflow.ai)}</ul>
    </section>
  `;
}

function renderCases(): string {
  const cards = cases
    .map(
      (item) => `
      <article class="case-card" aria-labelledby="${item.id}-title">
        <header class="case-card__header">
          <h3 class="case-card__title" id="${item.id}-title">${escapeHtml(item.title)}</h3>
          <span class="case-card__nda">NDA</span>
        </header>
        <dl class="case-card__meta">
          <div class="case-card__meta-row">
            <dt class="case-card__meta-term">Домен</dt>
            <dd class="case-card__meta-value">${escapeHtml(item.domain)}</dd>
          </div>
          <div class="case-card__meta-row">
            <dt class="case-card__meta-term">Роль</dt>
            <dd class="case-card__meta-value">${escapeHtml(item.role)}</dd>
          </div>
        </dl>
        <ul class="case-card__stack">
          ${item.stack.map((tech) => `<li class="chip chip--small">${escapeHtml(tech)}</li>`).join('')}
        </ul>
        <ul class="case-card__tasks">
          ${item.tasks.map((task) => `<li class="case-card__task">${escapeHtml(task)}</li>`).join('')}
        </ul>
        <p class="case-card__result"><strong>Результат:</strong> ${escapeHtml(item.result)}</p>
        <p class="case-card__personal"><strong>Лично:</strong> ${escapeHtml(item.personal)}</p>
      </article>
    `,
    )
    .join('');

  return `
    <section class="level-card" id="cases" aria-labelledby="cases-title">
      <header class="level-card__header">
        <span class="level-card__badge">LV ${levels[3].num}</span>
        <h2 class="level-card__title" id="cases-title">STAGES CLEARED</h2>
      </header>
      <p class="level-card__lead">Проекты обобщены без названий заказчиков (NDA).</p>
      <div class="case-card__grid">${cards}</div>
    </section>
  `;
}

function renderContact(): string {
  const links = contacts
    .map((link) => {
      const attrs = link.external ? ' target="_blank" rel="noopener noreferrer"' : '';
      return `<li class="contacts__item">
        <a class="contacts__link" href="${escapeHtml(link.href)}"${attrs}>${escapeHtml(link.label)}</a>
      </li>`;
    })
    .join('');

  return `
    <section class="level-card" id="contact" aria-labelledby="contact-title">
      <header class="level-card__header">
        <span class="level-card__badge">LV ${levels[4].num}</span>
        <h2 class="level-card__title" id="contact-title">CONTINUE?</h2>
      </header>
      <ul class="contacts">${links}</ul>

      <form class="form" id="contact-form" novalidate>
        <p class="form__legend">Форма обратной связи</p>

        <div class="form__honeypot" aria-hidden="true">
          <label class="form__label" for="website">Website</label>
          <input class="form__input" type="text" id="website" name="website" tabindex="-1" autocomplete="off" />
        </div>

        <div class="form__field">
          <label class="form__label" for="name">Имя *</label>
          <input class="form__input" type="text" id="name" name="name" required autocomplete="name" />
          <p class="form__error" id="name-error" role="alert"></p>
        </div>

        <div class="form__field">
          <label class="form__label" for="phone">Телефон *</label>
          <input class="form__input" type="tel" id="phone" name="phone" required autocomplete="tel" />
          <p class="form__error" id="phone-error" role="alert"></p>
        </div>

        <div class="form__field">
          <label class="form__label" for="email">Email *</label>
          <input class="form__input" type="email" id="email" name="email" required autocomplete="email" />
          <p class="form__error" id="email-error" role="alert"></p>
        </div>

        <div class="form__field">
          <label class="form__label" for="comment">Комментарий *</label>
          <textarea class="form__textarea" id="comment" name="comment" rows="4" required></textarea>
          <p class="form__error" id="comment-error" role="alert"></p>
        </div>

        <button class="form__submit" type="submit">SEND — START</button>

        <p class="form__status" id="form-status" aria-live="polite" aria-atomic="true"></p>
      </form>
    </section>
  `;
}

export function renderPage(): string {
  return `
    <div class="page">
      <a class="page__skip-link" href="#hero">К содержимому</a>
      <div class="page__crt-overlay" aria-hidden="true"></div>
      <header class="page__header">
        <p class="page__logo">AK-8BIT</p>
        ${renderNav()}
      </header>
      <main class="page__main">
        ${renderHero()}
        ${renderStats()}
        ${renderWorkflow()}
        ${renderCases()}
        ${renderContact()}
      </main>
      <footer class="page__footer">
        <p class="page__footer-text">© ${new Date().getFullYear()} Алексей Копасов · 8-BIT PORTFOLIO</p>
      </footer>
    </div>
  `;
}
