import React from 'react';
import {
  Cloud,
  DoorOpen,
  Globe,
  Headset,
  Paintbrush,
  Palette,
  RefreshCw,
  Box as ScanBox,
  Sliders,
  SwatchBook,
  Truck
} from "lucide-react";

export const productData = {
  product: 'Shower Configurator',
  category: 'Shower Configurator',
  title: {
    start: '3D Shower Enclosure Configurator',
    accent: '',
    end: '',
  },
  description: [
    'One tool: fast quoting for your sales team, and lead generation from your website. Customers build their own shower enclosure in 3D, see the price, and submit a request. You get a ready configuration, not a vague lead.',
  ],
  heroButtonText: 'Request Pricing',
  videoSrc: '/storage/videos/showers/showers_hero.mp4',
  demoAppUrl: '/products/showers/demo',

  benefitsSection: {
    title: {
      start: 'Built for',
      finish: ' both sales teams and websites',
    },
    description:
      'The same calculation engine works as a hands-on tool for your managers and as a lead-converting widget for your customers.',
    cards: [
      {
        icon: Headset,
        title: 'For managers and sales teams',
        items: [
          'Instant price calculation: 7 construction types, opening variants, glass, and hardware are all factored in automatically',
          'Prices, compatibility, and stock stay up to date, managed in the admin panel with no developer needed',
          'A ready-made quote for the client in 3 minutes, with a detailed line-item breakdown, instead of half an hour in Excel',
          'Leads arrive with the configuration attached, so there is no need to ask the client what exactly they want',
        ],
      },
      {
        icon: Globe,
        title: 'For your website and end customers',
        items: [
          'Real-time 3D visualization: a photorealistic model customers can rotate',
          'Flexible self-service customization: construction shape, glass, hardware, and opening systems, all built visually',
          'Transparent pricing right in front of the customer, with no calls and no waiting on a manager',
          'A one-click request or quote straight from the configurator, with a shareable link to the configuration',
        ],
      },
    ],
  },

  configurationSection: {
    title: {
      start: 'Everything You Need to Configure a ',
      accent: 'Shower Enclosure',
    },
    description:
      'The client or manager selects the configuration they need and instantly sees how it looks in 3D.',
    videoSrc: '/storage/videos/showers/showers_config.mp4',
    imageSrc: '',
    items: [
      {
        icon: ScanBox,
        title: '7 shower enclosure shapes',
        text: 'Straight, corner, sliding, hinged, and more, for any bathroom layout.',
      },
      {
        icon: Palette,
        title: 'Glass color and finish',
        text: 'Clear, frosted, tinted, or textured, with changes updating instantly on the 3D model.',
      },
      {
        icon: SwatchBook,
        title: 'Hardware and its finish',
        text: 'Handles, hinges, and profiles, in chrome, matte black, gold, and other finishes.',
      },
      {
        icon: DoorOpen,
        title: 'Opening type and door count',
        text: 'Sliding, hinged, or folding constructions, with one, two, or more doors.',
      },
      {
        icon: Truck,
        title: 'Delivery, installation, measurement',
        text: 'Additional services are added directly in the configurator and instantly reflected in the quote.',
      },
    ],
  },

  featureSection: {
    title: {
      start: null,
      accent: null,
    },
    description: null,
    items: [
      {
        title: 'Automatic Quoting',
        text: (
          <>
            The configurator recalculates the quote in real time with every parameter change:
            dimensions, glass, hardware, services.
            <br />
            <br />
            The manager sees a full cost breakdown and the total instantly, with no manual calculations.
          </>
        ),
        videoSrc: '/storage/videos/showers/showers_estimate.mp4',
      },
      {
        title: 'Quote for the Client',
        text: (
          <>
            With one click, the calculation turns into a ready-made commercial quote showing all
            parameters and the final price.
            <br />
            <br />
            The quote always reflects current pricing, and the configuration can be shared via
            link even before the document is generated.
          </>
        ),
        videoSrc: '/storage/videos/showers/showers_kp.mp4',
      },
      {
        title: 'Admin Panel',
        text: (
          <>
            Prices, materials, colors, and services shown to the client are set and updated in
            the admin panel, with no developer involved.
            <br />
            <br />
            Changes apply to calculations instantly, giving the company full control over its
            product range and pricing.
          </>
        ),
        videoSrc: '/storage/videos/showers/showers_admin.mp4',
      },
    ],
  },

  subscriptionSection: {
    badgeText: 'Partnership Format',
    title: {
      start: 'A subscription product, ',
      accent: 'built for continuous updates and new features',
    },
    buttonText: 'Get Pricing',
    items: [
      {
        icon: Cloud,
        title: 'Ready-made SaaS subscription',
        description: 'No upfront development costs, and a fast launch.',
      },
      {
        icon: Paintbrush,
        title: 'Configured to fit you',
        description: 'Catalog, pricing, and branding tailored to your product line and visual identity.',
      },
      {
        icon: Sliders,
        title: 'Admin panel, no developers needed',
        description: 'Manage your catalog, pricing, and logic without programmers.',
      },
      {
        icon: RefreshCw,
        title: 'Continuous development',
        description:
          'New features, construction types, and 3D improvements delivered regularly, at no extra cost within your subscription.',
      },
    ],
  },

  ctaSection: {
    title: 'Want this tool for your business?',
    description:
      'Leave a request and we will show you a demo with real data and walk you through pricing.',
    buttonLabel: 'Request a Demo',
  },
};

export default productData;
