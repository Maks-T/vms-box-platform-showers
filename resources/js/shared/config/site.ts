export interface NavItem {
  label: string;
  href: string;
  disabled?: boolean;
  forceRefresh?: boolean;
}

export interface SocialItem {
  id: string;
  src?: string;
  href: string;
  label: string;
}

export const siteConfig = {
  company: {
    name: "Прозрачные решения",
    tagline: "Душевые кабины, перегородки и зеркала на заказ в Минске",
    status: "Изготовление за 15 дней",
    copyright: `© ${new Date().getFullYear()} Прозрачные решения. Все права защищены.`,
  },

  contacts: {
    phone: {
      label: "+375 (44) 555-61-01",
      href: "tel:+375445556101",
      formatted: "+375 (44) 555-61-01",
    },
    email: {
      label: "info@proreshenia.by",
      href: "mailto:info@proreshenia.by",
    },
    address: "г. Минск, Республика Беларусь",
    workingHours: "Пн-Вс: 09:00 - 20:00",
  },

  socials: [
    {
      id: 'telegram',
      src: "/images/icons/telegram.svg",
      href: "https://t.me/proreshenia_by",
      label: "Telegram",
    },
    {
      id: 'viber',
      src: "/images/icons/viber.svg",
      href: "viber://chat?number=+375445556101",
      label: "Viber",
    },
    {
      id: 'instagram',
      src: "/images/site/logo/logo-instagram_1.svg",
      href: "https://instagram.com/proreshenia.by",
      label: "Instagram",
    },
  ] as SocialItem[],

  headerNav: [
    { label: 'Душевые кабины', href: '/shower_cabin' },
    { label: 'Межкомнатные перегородки', href: '/peregorodki' },
    { label: 'Зеркала', href: '/zerkala' },
    { label: 'Контакты', href: '/contacts' },
  ] as NavItem[],
};
