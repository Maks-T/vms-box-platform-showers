import { useState, useEffect } from 'react';
import { ru, TranslationKey } from './locales/ru';
import { en } from './locales/en';

const dictionaries: Record<string, Record<TranslationKey, string>> = {
  ru,
  en,
};

export type Locale = 'ru' | 'en';

export function getActiveLocale(): Locale {
  if (typeof window === 'undefined') {
    return 'en';
  }
  const saved = localStorage.getItem('app_locale');
  return (saved === 'ru' ? 'ru' : 'en');
}

export function t(key: TranslationKey, params: Record<string, string | number> = {}, forcedLocale?: Locale): string {
  const locale = forcedLocale || getActiveLocale();
  const dict = dictionaries[locale] || dictionaries.ru;
  let text: string = dict[key] || dictionaries.ru[key] || key;

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