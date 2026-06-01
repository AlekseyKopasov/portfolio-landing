import './styles/main.scss';

const app = document.querySelector<HTMLDivElement>('#app');

if (!app) {
  throw new Error('Root element #app not found');
}

app.innerHTML = `
  <div class="page">
    <div class="page__crt-overlay" aria-hidden="true"></div>
    <main class="page__main">
      <section class="hero">
        <p class="hero__blink-text">PRESS START</p>
        <h1 class="hero__title">Алексей Копасов</h1>
        <p class="hero__subtitle">Senior Fullstack Developer</p>
        <p class="hero__hint">Скелет проекта — см. SPEC.md</p>
      </section>
    </main>
  </div>
`;
