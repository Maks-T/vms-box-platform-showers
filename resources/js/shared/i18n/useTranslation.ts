import { useState, useEffect } from 'react';
import { ru, TranslationKey } from './locales/ru';
import { en } from './locales/en';

export type Locale = 'en' | 'de' | 'es' | 'it' | 'pl' | 'tr' | 'ru';

export const SUPPORTED_LOCALES: Locale[] = ['en', 'de', 'es', 'it', 'pl', 'tr', 'ru'];

// Локализованные базовые интерфейсные фразы для всех 7 языков
const multiLangOverrides: Record<Locale, Partial<Record<TranslationKey, string>>> = {
  en,
  ru,
  de: {
    nav_main: 'Startseite',
    nav_catalog: 'Katalog',
    nav_demo: 'Demo',
    contact_sales: 'Contact Sales',
    calc_page_title: '3D-Duschkonfigurator',
  },
  es: {
    nav_main: 'Inicio',
    nav_catalog: 'Catálogo',
    nav_demo: 'Demo',
    contact_sales: 'Contact Sales',
    calc_page_title: 'Configurador 3D de mamparas',
  },
  it: {
    nav_main: 'Home',
    nav_catalog: 'Catalogo',
    nav_demo: 'Demo',
    contact_sales: 'Contact Sales',
    calc_page_title: 'Configuratore 3D box doccia',
  },
  pl: {
    nav_main: 'Główna',
    nav_catalog: 'Katalog',
    nav_demo: 'Demo',
    contact_sales: 'Contact Sales',
    calc_page_title: 'Konfigurator kabin 3D',
  },
  tr: {
    nav_main: 'Ana Sayfa',
    nav_catalog: 'Katalog',
    nav_demo: 'Demo',
    contact_sales: 'Contact Sales',
    calc_page_title: '3D Duşakabin Konfigüratörü',
  },
};

export function getActiveLocale(): Locale {
  if (typeof window === 'undefined') {
    return 'en';
  }
  const saved = localStorage.getItem('app_locale') as Locale | null;
  if (saved && SUPPORTED_LOCALES.includes(saved)) {
    return saved;
  }
  return 'en';
}

export function t(key: TranslationKey, params: Record<string, string | number> = {}, forcedLocale?: Locale): string {
  const locale = forcedLocale || getActiveLocale();
  const dict = multiLangOverrides[locale] || en;
  let text: string = dict[key] || en[key] || ru[key] || key;

  Object.entries(params).forEach(([paramKey, val]) => {
    text = text.replace(new RegExp(`:${paramKey}`, 'g'), String(val));
  });

  return text;
}

export function useTranslation() {
  const [locale, setLocaleState] = useState<Locale>(getActiveLocale);

  useEffect(() => {
    const handleStorageChange = () => {
      setLocaleState(getActiveLocale());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const changeLocale = (newLocale: Locale) => {
    localStorage.setItem('app_locale', newLocale);
    setLocaleState(newLocale);
    window.location.reload();
  };

  const translate = (key: TranslationKey, params?: Record<string, string | number>) => {
    return t(key, params, locale);
  };

  return {
    locale,
    setLocale: changeLocale,
    t: translate,
  };
}