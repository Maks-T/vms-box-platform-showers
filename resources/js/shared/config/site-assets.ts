// resources/js/shared/config/site-assets.ts

/**
 * Глобальный манифест путей к оптимизированным медиа-ассетам сайта.
 * Использует WebP формат для графики, GIF для анимаций и SVG для векторов.
 */
export const siteAssets = {
  logo: {
    instagram: '/images/site/logo/logo-instagram_1.svg',
  },

  hero: {
    showerCabin: '/images/site/hero/hero-shower-bg.webp',
    partitions: '/images/site/hero/hero-partition-bg.webp',
    mirrors: '/images/site/hero/hero-mirror-bg.webp',
    contacts: '/images/site/hero/hero-contacts-bg.webp',
    generalBg: '/images/site/hero/hero-bg-1.webp',
  },

  glass: {
    regular: '/images/site/glass/glass-regular.webp',
    optiwhite: '/images/site/glass/glass-optiwhite.webp',
    bronze: '/images/site/glass/glass-bronze.webp',
    graphite: '/images/site/glass/glass-graphite.webp',
    frostedRegular: '/images/site/glass/glass-frosted-regular.webp',
    frostedOptiwhite: '/images/site/glass/glass-frosted-optiwhite.webp',
    engraved: '/images/site/glass/glass-engraved.webp',
    patterned: '/images/site/glass/glass-patterned.webp',
  },

  hardware: {
    chrome: '/images/site/hardware/hardware-chrome.webp',
    black: '/images/site/hardware/hardware-black.webp',
    gold: '/images/site/glass/hardware-gold.webp',
    bronze: '/images/site/glass/hardware-bronze.webp',
    steelMatte: '/images/site/hardware/hardware-steel-matte.webp',
    hingesAnimation: '/images/site/hardware/hardware-hinges-animation.gif',
  },

  advantages: {
    guarantee: '/images/site/advantages/icon-guarantee.webp',
    fastTerm: '/images/site/advantages/icon-fast-term.webp',
    qualityMontage: '/images/site/advantages/icon-quality-montage.webp',
    individualApproach: '/images/site/advantages/icon-individual-approach.webp',
    discountSystem: '/images/site/advantages/icon-discount-system.webp',
    glassQuality: '/images/site/advantages/icon-glass-quality.webp',
  },

  constructions: {
    corner: '/images/site/constructions/construction-corner.webp',
    doorNiche: '/images/site/constructions/construction-door-niche.webp',
    partitionStationary: '/images/site/constructions/construction-partition-stationary.webp',
    partitionSliding: '/images/site/constructions/construction-partition-sliding.webp',
    frameMinimal: '/images/site/constructions/construction-frame-minimal.webp',
    frameBorder: '/images/site/constructions/construction-frame-border.webp',
  },

  portfolio: [
    '/images/site/portfolio/work-1.webp',
    '/images/site/portfolio/work-2.webp',
    '/images/site/portfolio/work-3.webp',
    '/images/site/portfolio/work-4.webp',
    '/images/site/portfolio/work-5.webp',
    '/images/site/portfolio/work-6.webp',
    '/images/site/portfolio/work-7.webp',
    '/images/site/portfolio/work-8.webp',
    '/images/site/portfolio/work-9.webp',
    '/images/site/portfolio/work-10.webp',
    '/images/site/portfolio/work-11.webp',
    '/images/site/portfolio/work-12.webp',
    '/images/site/portfolio/work-13.webp',
    '/images/site/portfolio/work-14.webp',
    '/images/site/portfolio/work-15.webp',
    '/images/site/portfolio/work-16.webp',
    '/images/site/portfolio/work-17.webp',
    '/images/site/portfolio/work-18.webp',
    '/images/site/portfolio/work-19.webp',
    '/images/site/portfolio/work-20.webp',
  ],
} as const;

export type SiteAssets = typeof siteAssets;
