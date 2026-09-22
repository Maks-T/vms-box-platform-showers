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
      name: "VMS-NC Cloud SaaS",
      status: t('site_catalog_status'),
      copyright: `© ${new Date().getFullYear()} Vistegra.`,
    };
  },

  contacts: {
    phone: {label: "+375 29 189-83-22", href: "tel:++375291898322"},
    email: {label: "info@vistegra.by", href: "mailto:info@vistegra.by"},
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
      {label: t('nav_calculator'), href: route('calculator.show'), disabled: false, forceRefresh: true},
      {label: t('nav_configuration'), href: route('bootstrap'), disabled: false},
      {label: t('nav_catalog'), href: route('catalog'), disabled: false},
      {label: t('nav_services'), href: route('services'), disabled: false},
      {label: t('nav_about'), href: '#', disabled: true},
    ];
  },

};
