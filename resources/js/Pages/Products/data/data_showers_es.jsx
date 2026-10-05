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
  product: 'Configurador de mamparas de ducha',
  category: 'Configurador de mamparas de ducha',
  title: {
    start: 'Configurador 3D de mamparas de ducha',
    accent: '',
    end: '',
  },
  description: [
    'Una sola herramienta: cotizaciones rápidas para su equipo de ventas y generación de leads desde el sitio web. El cliente arma su propia mampara en 3D, ve el precio y envía una solicitud. Ustedes reciben una configuración lista, no un lead genérico.',
  ],
  heroButtonText: 'Solicitar precio',
  videoSrc: '/storage/videos/showers/showers_hero.mp4',
  demoAppUrl: '/products/showers/demo',

  benefitsSection: {
    title: {
      start: 'Beneficio',
      finish: ' tanto para ventas como para el sitio web',
    },
    description:
      'El mismo motor de cálculo funciona como herramienta de trabajo para sus vendedores y como widget de venta para sus clientes.',
    cards: [
      {
        icon: Headset,
        title: 'Para vendedores y equipo comercial',
        items: [
          'Cálculo instantáneo del precio: 7 tipos de estructura, variantes de apertura, vidrio y herrajes se consideran automáticamente',
          'Precios, compatibilidad y disponibilidad siempre actualizados, gestionados en el panel de administración sin programador',
          'Cotización lista para el cliente en 3 minutos, con desglose detallado por partida, en lugar de media hora en Excel',
          'Las solicitudes llegan ya con la configuración, sin necesidad de preguntarle al cliente qué es exactamente lo que quiere',
        ],
      },
      {
        icon: Globe,
        title: 'Para el sitio web y el cliente final',
        items: [
          'Visualización 3D en tiempo real: un modelo fotorrealista que el cliente puede rotar',
          'Personalización flexible: forma de la estructura, vidrio, herrajes, sistemas de apertura, todo armado visualmente',
          'Cotización transparente ante los ojos del cliente, sin llamadas ni esperas',
          'Solicitud o cotización con un clic directamente desde el configurador, con enlace compartible de la configuración',
        ],
      },
    ],
  },

  configurationSection: {
    title: {
      start: 'Todo lo necesario para configurar una ',
      accent: 'mampara de ducha',
    },
    description:
      'El cliente o el vendedor elige la configuración necesaria y la ve al instante en 3D.',
    videoSrc: '/storage/videos/showers/showers_config.mp4',
    imageSrc: '',
    items: [
      {
        icon: ScanBox,
        title: '7 formas de mamparas de ducha',
        text: 'Rectas, en esquina, correderas, abatibles y otras más, para cualquier distribución de baño.',
      },
      {
        icon: Palette,
        title: 'Color y acabado del vidrio',
        text: 'Transparente, mate, tintado o texturizado, con cambios visibles al instante en el modelo 3D.',
      },
      {
        icon: SwatchBook,
        title: 'Herrajes y su color',
        text: 'Manijas, bisagras, perfiles, en cromo, negro mate, oro y otros acabados.',
      },
      {
        icon: DoorOpen,
        title: 'Tipo de apertura y número de puertas',
        text: 'Correderas, abatibles o plegables, con una, dos o más puertas.',
      },
      {
        icon: Truck,
        title: 'Entrega, instalación, medición',
        text: 'Los servicios adicionales se agregan directamente en el configurador y se reflejan de inmediato en la cotización.',
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
        title: 'Cotización automática',
        text: (
          <>
            El configurador recalcula la cotización en tiempo real con cada cambio de parámetro:
            dimensiones, vidrio, herrajes, servicios.
            <br />
            <br />
            El vendedor ve de inmediato un desglose completo de costos y el total, sin cálculos
            manuales.
          </>
        ),
        videoSrc: '/storage/videos/showers/showers_estimate.mp4',
      },
      {
        title: 'Cotización para el cliente',
        text: (
          <>
            Al finalizar el cálculo, con un clic se genera una cotización comercial lista con
            todos los parámetros y el precio final.
            <br />
            <br />
            La cotización siempre está sincronizada con los precios actuales, y la configuración
            se puede compartir por enlace incluso antes de generar el documento.
          </>
        ),
        videoSrc: '/storage/videos/showers/showers_kp.mp4',
      },
      {
        title: 'Panel de administración',
        text: (
          <>
            Los precios, materiales, colores y servicios que ve el cliente se configuran y
            actualizan en el panel de administración, sin participación de programadores.
            <br />
            <br />
            Los cambios se aplican de inmediato a los cálculos, la empresa gestiona su catálogo y
            política de precios de forma flexible y autónoma.
          </>
        ),
        videoSrc: '/storage/videos/showers/showers_admin.mp4',
      },
    ],
  },

  subscriptionSection: {
    badgeText: 'Modelo de colaboración',
    title: {
      start: 'Un producto por suscripción, ',
      accent: 'con actualizaciones constantes y nuevas funciones',
    },
    buttonText: 'Conocer el precio',
    items: [
      {
        icon: Cloud,
        title: 'Solución SaaS lista por suscripción',
        description: 'Sin inversión inicial en desarrollo y con un lanzamiento rápido.',
      },
      {
        icon: Paintbrush,
        title: 'Configurado a su medida',
        description: 'Catálogo, precios y marca adaptados a su línea de productos y su identidad visual.',
      },
      {
        icon: Sliders,
        title: 'Panel de administración sin programadores',
        description: 'Gestione catálogo, precios y lógica sin programadores.',
      },
      {
        icon: RefreshCw,
        title: 'Desarrollo continuo',
        description:
          'Nuevas funciones, tipos de estructura y mejoras en 3D, de forma regular y sin costo adicional dentro de su suscripción.',
      },
    ],
  },

  ctaSection: {
    title: '¿Quiere esta herramienta para su negocio?',
    description:
      'Deje una solicitud, le mostraremos una demo con datos reales y le explicaremos los costos de implementación.',
    buttonLabel: 'Solicitar una demo',
  },
};

export default productData;
