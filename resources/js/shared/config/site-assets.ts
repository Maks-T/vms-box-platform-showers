

export const siteAssets = {
  logo: {
    instagram: '/images/site/logo/logo-instagram_1.svg',
    main: '/images/site/logo/logo-instagram.svg',
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
    frostedBronze: '/images/site/glass/glass-frosted-bronze.webp',
    frostedGraphite: '/images/site/glass/glass-frosted-graphite.webp',
  },

  mirrors: {
    regular: '/images/site/mirrors/mirror-regular.webp',
    optiwhite: '/images/site/mirrors/mirror-optiwhite.webp',
    graphite: '/images/site/mirrors/mirror-graphite.webp',
    bronze: '/images/site/mirrors/mirror-bronze.webp',
    gold: '/images/site/mirrors/mirror-gold.webp',
    aged: '/images/site/mirrors/mirror-aged.webp',
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
    partitionStationary: '/images/site/constructions/partition-static.webp',
    partitionSliding: '/images/site/constructions/partition-sliding.webp',
    frameMinimal: '/images/site/constructions/construction-frame-minimal.webp',
    frameBorder: '/images/site/constructions/construction-frame-border.webp',
  },

  
  portfolio: {
    showers: [
      '/images/site/portfolio/showers/shower-1.webp',
      '/images/site/portfolio/showers/shower-2.webp',
      '/images/site/portfolio/showers/shower-3.webp',
      '/images/site/portfolio/showers/shower-4.webp',
      '/images/site/portfolio/showers/shower-5.webp',
      '/images/site/portfolio/showers/shower-6.webp',
      '/images/site/portfolio/showers/shower-7.webp',
      '/images/site/portfolio/showers/shower-8.webp',
      '/images/site/portfolio/showers/shower-9.webp',
      '/images/site/portfolio/showers/shower-10.webp',
      '/images/site/portfolio/showers/shower-11.webp',
      '/images/site/portfolio/showers/shower-12.webp',
    ],
    partitions: [
      '/images/site/portfolio/partitions/partition-1.webp',
      '/images/site/portfolio/partitions/partition-2.webp',
      '/images/site/portfolio/partitions/partition-3.webp',
      '/images/site/portfolio/partitions/partition-4.webp',
      '/images/site/portfolio/partitions/partition-5.webp',
      '/images/site/portfolio/partitions/partition-6.webp',
      '/images/site/portfolio/partitions/partition-7.webp',
      '/images/site/portfolio/partitions/partition-8.webp',
      '/images/site/portfolio/partitions/partition-9.webp',
      '/images/site/portfolio/partitions/partition-10.webp',
      '/images/site/portfolio/partitions/partition-11.webp',
    ],
    mirrors: [
      '/images/site/portfolio/mirrors/mirror-1.webp',
      '/images/site/portfolio/mirrors/mirror-2.webp',
      '/images/site/portfolio/mirrors/mirror-3.webp',
      '/images/site/portfolio/mirrors/mirror-4.webp',
      '/images/site/portfolio/mirrors/mirror-5.webp',
      '/images/site/portfolio/mirrors/mirror-6.webp',
      '/images/site/portfolio/mirrors/mirror-7.webp',
      '/images/site/portfolio/mirrors/mirror-8.webp',
      '/images/site/portfolio/mirrors/mirror-9.webp',
      '/images/site/portfolio/mirrors/mirror-10.webp',
    ],
  },
} as const;

export type SiteAssets = typeof siteAssets;
