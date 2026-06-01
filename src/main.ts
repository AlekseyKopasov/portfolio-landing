import { initContactForm } from './features/contactForm';
import { initNavigation } from './features/navigation';
import { renderPage } from './render/renderPage';
import './styles/main.scss';

const app = document.querySelector<HTMLDivElement>('#app');

if (!app) {
  throw new Error('Root element #app not found');
}

app.innerHTML = renderPage();
initNavigation();
initContactForm();
