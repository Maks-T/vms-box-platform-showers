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
  product: 'Duschkonfigurator',
  category: 'Duschkonfigurator',
  title: {
    start: '3D-Konfigurator für Duschkabinen',
    accent: '',
    end: '',
  },
  description: [
    'Ein Tool für schnelle Angebote im Vertrieb und Leadgenerierung über die Website. Kunden gestalten ihre Duschkabine selbst in 3D, sehen den Preis und senden eine Anfrage. Sie erhalten eine fertige Konfiguration, keinen vagen Lead.',
  ],
  heroButtonText: 'Preis anfragen',
  videoSrc: '/storage/videos/showers/showers_hero.mp4',
  demoAppUrl: '/products/showers/demo',

  benefitsSection: {
    title: {
      start: 'Nutzen für',
      finish: ' Vertrieb und Website gleichermaßen',
    },
    description:
      'Dieselbe Berechnungslogik funktioniert als Arbeitswerkzeug für Ihre Vertriebsmitarbeiter und als verkaufsförderndes Widget für Ihre Kunden.',
    cards: [
      {
        icon: Headset,
        title: 'Für Vertrieb und Verkaufsteam',
        items: [
          'Sofortige Preisberechnung: 7 Konstruktionstypen, Öffnungsvarianten, Glas und Beschläge werden automatisch berücksichtigt',
          'Preise, Kompatibilität und Verfügbarkeit sind immer aktuell und werden im Admin-Panel ohne Entwickler gepflegt',
          'Ein fertiges Angebot für den Kunden in 3 Minuten, mit detaillierter Positionsaufstellung, statt einer halben Stunde in Excel',
          'Anfragen kommen bereits mit der Konfiguration, sodass Sie den Kunden nicht mehr fragen müssen, was genau er möchte',
        ],
      },
      {
        icon: Globe,
        title: 'Für Website und Endkunden',
        items: [
          'Echtzeit-3D-Visualisierung: ein fotorealistisches Modell, das Kunden drehen können',
          'Flexible Selbstkonfiguration: Form, Glas, Beschläge und Öffnungssysteme, alles visuell zusammengestellt',
          'Transparente Preisberechnung direkt vor den Augen des Kunden, ohne Anrufe und ohne Warten auf einen Mitarbeiter',
          'Anfrage oder Angebot mit einem Klick direkt aus dem Konfigurator, mit einem teilbaren Link zur Konfiguration',
        ],
      },
    ],
  },

  configurationSection: {
    title: {
      start: 'Alles, was Sie zur Konfiguration einer ',
      accent: 'Duschkabine brauchen',
    },
    description:
      'Der Kunde oder Mitarbeiter wählt die gewünschte Konfiguration und sieht sofort, wie sie in 3D aussieht.',
    videoSrc: '/storage/videos/showers/showers_config.mp4',
    imageSrc: '',
    items: [
      {
        icon: ScanBox,
        title: '7 Formen von Duschkabinen',
        text: 'Gerade, Eck-, Schiebe-, Drehtür- und weitere Varianten, für jeden Badgrundriss.',
      },
      {
        icon: Palette,
        title: 'Glasfarbe und -struktur',
        text: 'Klar, satiniert, getönt oder strukturiert, Änderungen werden sofort im 3D-Modell sichtbar.',
      },
      {
        icon: SwatchBook,
        title: 'Beschläge und ihre Farbe',
        text: 'Griffe, Scharniere, Profile, in Chrom, mattschwarz, Gold und weiteren Oberflächen.',
      },
      {
        icon: DoorOpen,
        title: 'Öffnungsart und Türanzahl',
        text: 'Schiebe-, Dreh- oder Falttüren, mit einer, zwei oder mehr Türen.',
      },
      {
        icon: Truck,
        title: 'Lieferung, Montage, Aufmaß',
        text: 'Zusatzleistungen werden direkt im Konfigurator hinzugefügt und sofort im Angebot berücksichtigt.',
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
        title: 'Automatische Kalkulation',
        text: (
          <>
            Der Konfigurator berechnet das Angebot in Echtzeit bei jeder Parameteränderung neu:
            Maße, Glas, Beschläge, Leistungen.
            <br />
            <br />
            Der Mitarbeiter sieht sofort eine vollständige Kostenaufschlüsselung und die
            Gesamtsumme, ohne manuelle Berechnung.
          </>
        ),
        videoSrc: '/storage/videos/showers/showers_estimate.mp4',
      },
      {
        title: 'Angebot für den Kunden',
        text: (
          <>
            Nach der Berechnung entsteht mit einem Klick ein fertiges kommerzielles Angebot mit
            allen Parametern und dem Endpreis.
            <br />
            <br />
            Das Angebot ist immer mit den aktuellen Preisen synchronisiert, und die Konfiguration
            kann schon vor der Dokumenterstellung per Link geteilt werden.
          </>
        ),
        videoSrc: '/storage/videos/showers/showers_kp.mp4',
      },
      {
        title: 'Admin-Panel',
        text: (
          <>
            Preise, Materialien, Farben und Leistungen, die der Kunde sieht, werden im
            Admin-Panel festgelegt und aktualisiert, ohne Beteiligung von Entwicklern.
            <br />
            <br />
            Änderungen wirken sich sofort auf die Berechnungen aus, das Unternehmen steuert
            Sortiment und Preispolitik flexibel selbst.
          </>
        ),
        videoSrc: '/storage/videos/showers/showers_admin.mp4',
      },
    ],
  },

  subscriptionSection: {
    badgeText: 'Zusammenarbeitsmodell',
    title: {
      start: 'Ein Abo-Produkt, ',
      accent: 'mit laufenden Updates und neuen Funktionen',
    },
    buttonText: 'Preise erfahren',
    items: [
      {
        icon: Cloud,
        title: 'Fertige SaaS-Lösung im Abo',
        description: 'Ohne Investitionskosten für die Entwicklung und mit schnellem Start.',
      },
      {
        icon: Paintbrush,
        title: 'Auf Sie zugeschnitten',
        description: 'Katalog, Preise und Branding passend zu Ihrer Produktlinie und Ihrem Corporate Design.',
      },
      {
        icon: Sliders,
        title: 'Admin-Panel ohne Entwickler',
        description: 'Verwalten Sie Katalog, Preise und Logik ohne Programmierer.',
      },
      {
        icon: RefreshCw,
        title: 'Kontinuierliche Weiterentwicklung',
        description:
          'Neue Funktionen, Konstruktionstypen und 3D-Verbesserungen, regelmäßig und ohne Aufpreis im Rahmen Ihres Abos.',
      },
    ],
  },

  ctaSection: {
    title: 'Möchten Sie dieses Tool für Ihr Unternehmen?',
    description:
      'Hinterlassen Sie eine Anfrage, wir zeigen Ihnen eine Demo mit echten Daten und erklären die Preise.',
    buttonLabel: 'Demo anfragen',
  },
};

export default productData;
