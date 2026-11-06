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
    common_yes: 'Ja',
    common_no: 'Nein',
    pagination_prev: '‹ Zurück',
    pagination_next: 'Weiter ›',
    product_live_demo: '3D-Live-Demo',
    error_not_found: 'Daten nicht gefunden (404)',
    error_validation: 'Fehler bei der Datenprüfung',
    error_server: 'Interner Serverfehler. Bitte versuchen Sie es später erneut.',
    error_request: 'Bei der Anfrage ist ein Fehler aufgetreten',
    error_no_response: 'Keine Antwort vom Server. Bitte prüfen Sie Ihre Netzwerkverbindung.',
    error_send: 'Beim Senden der Anfrage ist ein Fehler aufgetreten',
    lead_fill_required: 'Bitte geben Sie Ihren Namen und Ihre Kontaktdaten an',
    lead_fill_required_short: 'Bitte geben Sie Ihren Namen und mindestens einen Kontakt an',
    lead_received: 'Vielen Dank! Ihre Anfrage ist eingegangen.',
    lead_thanks_contact_soon: 'Vielen Dank! Wir melden uns in Kürze bei Ihnen.',
    lead_thank_you: 'Vielen Dank!',
    lead_received_team: 'Ihre Anfrage ist eingegangen. Unser Team meldet sich in Kürze bei Ihnen.',
    lead_modal_desc: 'Erhalten Sie eine Live-Demo mit Ihrem Produktkatalog und individuellen Preisen.',
    lead_name_placeholder: 'Ihr Name *',
    lead_name_example: 'Alexander',
    lead_phone_placeholder: 'Telefon / WhatsApp *',
    lead_message_label: 'Nachricht / Anforderungen',
    lead_message_placeholder: 'Erzählen Sie uns von Ihrem Projekt...',
    lead_sending: 'Wird gesendet...',
  },
  es: {
    nav_main: 'Inicio',
    nav_catalog: 'Catálogo',
    nav_demo: 'Demo',
    contact_sales: 'Contact Sales',
    calc_page_title: 'Configurador 3D de mamparas',
    common_yes: 'Sí',
    common_no: 'No',
    pagination_prev: '‹ Atrás',
    pagination_next: 'Siguiente ›',
    product_live_demo: 'Demo 3D en vivo',
    error_not_found: 'Datos no encontrados (404)',
    error_validation: 'Error de validación de datos',
    error_server: 'Error interno del servidor. Inténtelo de nuevo más tarde.',
    error_request: 'Se produjo un error al procesar la solicitud',
    error_no_response: 'No hay respuesta del servidor. Compruebe su conexión de red.',
    error_send: 'Se produjo un error al enviar la solicitud',
    lead_fill_required: 'Indique su nombre y sus datos de contacto',
    lead_fill_required_short: 'Indique su nombre y al menos un contacto',
    lead_received: '¡Gracias! Hemos recibido su solicitud.',
    lead_thanks_contact_soon: '¡Gracias! Nos pondremos en contacto con usted en breve.',
    lead_thank_you: '¡Gracias!',
    lead_received_team: 'Hemos recibido su solicitud. Nuestro equipo se pondrá en contacto con usted en breve.',
    lead_modal_desc: 'Obtenga una demo en vivo con su catálogo de productos y precios personalizados.',
    lead_name_placeholder: 'Su nombre *',
    lead_name_example: 'Alejandro',
    lead_phone_placeholder: 'Teléfono / WhatsApp *',
    lead_message_label: 'Mensaje / Requisitos',
    lead_message_placeholder: 'Cuéntenos sobre su proyecto...',
    lead_sending: 'Enviando...',
  },
  it: {
    nav_main: 'Home',
    nav_catalog: 'Catalogo',
    nav_demo: 'Demo',
    contact_sales: 'Contact Sales',
    calc_page_title: 'Configuratore 3D box doccia',
    common_yes: 'Sì',
    common_no: 'No',
    pagination_prev: '‹ Indietro',
    pagination_next: 'Avanti ›',
    product_live_demo: 'Demo 3D dal vivo',
    error_not_found: 'Dati non trovati (404)',
    error_validation: 'Errore di convalida dei dati',
    error_server: 'Errore interno del server. Riprova più tardi.',
    error_request: 'Si è verificato un errore durante la richiesta',
    error_no_response: 'Nessuna risposta dal server. Controlla la connessione di rete.',
    error_send: 'Si è verificato un errore durante l\'invio della richiesta',
    lead_fill_required: 'Inserisci il tuo nome e i tuoi dati di contatto',
    lead_fill_required_short: 'Inserisci il nome e almeno un contatto',
    lead_received: 'Grazie! Abbiamo ricevuto la tua richiesta.',
    lead_thanks_contact_soon: 'Grazie! Ti contatteremo a breve.',
    lead_thank_you: 'Grazie!',
    lead_received_team: 'Abbiamo ricevuto la tua richiesta. Il nostro team ti contatterà a breve.',
    lead_modal_desc: 'Ottieni una demo dal vivo con il tuo catalogo prodotti e prezzi personalizzati.',
    lead_name_placeholder: 'Il tuo nome *',
    lead_name_example: 'Alessandro',
    lead_phone_placeholder: 'Telefono / WhatsApp *',
    lead_message_label: 'Messaggio / Requisiti',
    lead_message_placeholder: 'Raccontaci del tuo progetto...',
    lead_sending: 'Invio in corso...',
  },
  pl: {
    nav_main: 'Główna',
    nav_catalog: 'Katalog',
    nav_demo: 'Demo',
    contact_sales: 'Contact Sales',
    calc_page_title: 'Konfigurator kabin 3D',
    common_yes: 'Tak',
    common_no: 'Nie',
    pagination_prev: '‹ Wstecz',
    pagination_next: 'Dalej ›',
    product_live_demo: 'Demo 3D na żywo',
    error_not_found: 'Nie znaleziono danych (404)',
    error_validation: 'Błąd walidacji danych',
    error_server: 'Wewnętrzny błąd serwera. Spróbuj ponownie później.',
    error_request: 'Wystąpił błąd podczas przetwarzania żądania',
    error_no_response: 'Brak odpowiedzi z serwera. Sprawdź połączenie sieciowe.',
    error_send: 'Wystąpił błąd podczas wysyłania żądania',
    lead_fill_required: 'Podaj imię i dane kontaktowe',
    lead_fill_required_short: 'Podaj imię i co najmniej jeden kontakt',
    lead_received: 'Dziękujemy! Otrzymaliśmy Twoje zgłoszenie.',
    lead_thanks_contact_soon: 'Dziękujemy! Wkrótce się z Tobą skontaktujemy.',
    lead_thank_you: 'Dziękujemy!',
    lead_received_team: 'Otrzymaliśmy Twoje zgłoszenie. Nasz zespół wkrótce się z Tobą skontaktuje.',
    lead_modal_desc: 'Zobacz demo na żywo z Twoim katalogiem produktów i indywidualnymi cenami.',
    lead_name_placeholder: 'Twoje imię *',
    lead_name_example: 'Aleksander',
    lead_phone_placeholder: 'Telefon / WhatsApp *',
    lead_message_label: 'Wiadomość / Wymagania',
    lead_message_placeholder: 'Opowiedz nam o swoim projekcie...',
    lead_sending: 'Wysyłanie...',
  },
  tr: {
    nav_main: 'Ana Sayfa',
    nav_catalog: 'Katalog',
    nav_demo: 'Demo',
    contact_sales: 'Contact Sales',
    calc_page_title: '3D Duşakabin Konfigüratörü',
    common_yes: 'Evet',
    common_no: 'Hayır',
    pagination_prev: '‹ Geri',
    pagination_next: 'İleri ›',
    product_live_demo: 'Canlı 3D Demo',
    error_not_found: 'Veri bulunamadı (404)',
    error_validation: 'Veri doğrulama hatası',
    error_server: 'Dahili sunucu hatası. Lütfen daha sonra tekrar deneyin.',
    error_request: 'İstek işlenirken bir hata oluştu',
    error_no_response: 'Sunucudan yanıt yok. Ağ bağlantınızı kontrol edin.',
    error_send: 'İstek gönderilirken bir hata oluştu',
    lead_fill_required: 'Lütfen adınızı ve iletişim bilgilerinizi girin',
    lead_fill_required_short: 'Lütfen adınızı ve en az bir iletişim bilgisini girin',
    lead_received: 'Teşekkürler! Talebiniz alındı.',
    lead_thanks_contact_soon: 'Teşekkürler! Kısa süre içinde sizinle iletişime geçeceğiz.',
    lead_thank_you: 'Teşekkürler!',
    lead_received_team: 'Talebiniz alındı. Ekibimiz kısa süre içinde sizinle iletişime geçecek.',
    lead_modal_desc: 'Ürün kataloğunuz ve size özel fiyatlarla canlı bir demo alın.',
    lead_name_placeholder: 'Adınız *',
    lead_name_example: 'Ahmet',
    lead_phone_placeholder: 'Telefon / WhatsApp *',
    lead_message_label: 'Mesaj / Gereksinimler',
    lead_message_placeholder: 'Bize projenizden bahsedin...',
    lead_sending: 'Gönderiliyor...',
  },
};

export const LOCALE_COOKIE = 'vms_locale';

const isLocale = (value: unknown): value is Locale =>
  typeof value === 'string' && SUPPORTED_LOCALES.includes(value as Locale);

const readCookie = (name: string): string | null => {
  const row = document.cookie.split('; ').find((item) => item.startsWith(`${name}=`));
  return row ? decodeURIComponent(row.slice(name.length + 1)) : null;
};

export function writeLocaleCookie(locale: Locale): void {
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; SameSite=Lax${secure}`;
}

export function getActiveLocale(): Locale {
  if (typeof window === 'undefined') {
    return 'en';
  }

  const fromCookie = readCookie(LOCALE_COOKIE);
  if (isLocale(fromCookie)) {
    return fromCookie;
  }

  try {
    const legacy = localStorage.getItem('app_locale');
    if (isLocale(legacy)) {
      writeLocaleCookie(legacy);
      localStorage.removeItem('app_locale');
      return legacy;
    }
  } catch {
    // ignore
  }

  const htmlLang = document.documentElement.lang.slice(0, 2).toLowerCase();
  if (isLocale(htmlLang)) {
    return htmlLang;
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
    writeLocaleCookie(newLocale);
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