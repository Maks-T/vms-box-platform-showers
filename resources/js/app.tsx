import '../css/app.css';
import { createInertiaApp, router } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';

const appName = import.meta.env.VITE_APP_NAME || 'VMS';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Просмотры страниц для тега Google в SPA.
 * Первую загрузку тег учитывает сам; при переходах Inertia меняет адрес без перезагрузки,
 * поэтому page_view отправляем вручную — после отрисовки, когда обновлён document.title.
 * @since 2026-11-07
 */
let isFirstNavigation = true;

router.on('navigate', () => {
  if (isFirstNavigation) {
    isFirstNavigation = false;
    return;
  }

  if (typeof window.gtag !== 'function') {
    return;
  }

  window.setTimeout(() => {
    window.gtag?.('event', 'page_view', {
      page_location: window.location.href,
      page_path: window.location.pathname + window.location.search,
      page_title: document.title,
    });
  }, 0);
});

createInertiaApp({
  title: (title: string) => `${title} - ${appName}`,
  resolve: (name: string) => {
    const pages = import.meta.glob('./Pages/**/*.{js,jsx,ts,tsx}');
    const path = Object.keys(pages).find((p) => p.startsWith(`./Pages/${name}.`));

    if (!path) {
      throw new Error(`Страница не найдена: ./Pages/${name}`);
    }

    return pages[path]() as Promise<any>;
  },
  setup({ el, App, props }) {
    const root = createRoot(el);
    root.render(<App {...props} />);
  },
  progress: {
    color: '#0284c7',
  },
});