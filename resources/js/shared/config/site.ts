import {route} from 'ziggy-js';
import { t } from '@/shared/i18n/useTranslation';

export interface NavItem {
  label: string;
  href: string;
  disabled?: boolean;
}

export interface SocialItem {
  id: string;
  src?: string;
  icon?: any;
  href: string;
  label: string;
}

export const siteConfig = {
  get company() {
    return {
      name: "showers-cpq.tech",
      status: t('site_catalog_status'),
      copyright: `© ${new Date().getFullYear()} showers-cpq.tech.`,
    };
  },

  contacts: {
    phone: {label: "", href: ""},
    email: {label: "info@showers-cpq.tech", href: "mailto:info@showers-cpq.tech"},
  },

  socials: [
    {id: 'telegram', src: "/images/icons/telegram.svg", href: "https://t.me/Andrey_Uglikov", label: "Telegram"},
    {id: 'viber', src: "/images/icons/viber.svg", href: "viber://chat?number=+375291898322", label: "Viber"},
    {id: 'whatsapp', src: "/images/icons/whatsapp.svg", href: "https://wa.me/375291898322", label: "WhatsApp"},
    {id: 'chanel', src: "/images/icons/chanel.svg", href: "https://t.me/margin_sense", label: "Канал основателя"},
    {
      id: 'linkedin',
      src: "/images/icons/linkedin.svg",
      href: "https://www.linkedin.com/in/andrey-uglikov-4945881a8/",
      label: "LinkedIn"
    },
  ] as SocialItem[],

  get headerNav(): (NavItem & { forceRefresh?: boolean })[] {
    return [
      {label: t('nav_main'), href: '/', disabled: false},
      {label: t('nav_catalog'), href: '/catalog', disabled: false},
      {label: t('nav_demo'), href: '/calculator', disabled: false, forceRefresh: true},
    ];
  },

};
