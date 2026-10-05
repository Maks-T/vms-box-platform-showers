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
  product: 'Konfigurator kabin prysznicowych',
  category: 'Konfigurator kabin prysznicowych',
  title: {
    start: 'Konfigurator kabin prysznicowych 3D',
    accent: '',
    end: '',
  },
  description: [
    'Jedno narzędzie: szybka wycena dla działu sprzedaży i generowanie leadów ze strony internetowej. Klient sam projektuje kabinę prysznicową w 3D, widzi cenę i wysyła zapytanie. Otrzymujecie gotową konfigurację, a nie ogólny lead.',
  ],
  heroButtonText: 'Zapytaj o cenę',
  videoSrc: '/storage/videos/showers/showers_hero.mp4',
  demoAppUrl: '/products/showers/demo',

  benefitsSection: {
    title: {
      start: 'Korzyść dla',
      finish: ' działu sprzedaży i strony internetowej',
    },
    description:
      'Ten sam silnik obliczeniowy działa jako narzędzie pracy dla Twoich handlowców i jako widget sprzedażowy dla klientów.',
    cards: [
      {
        icon: Headset,
        title: 'Dla handlowców i działu sprzedaży',
        items: [
          'Błyskawiczna wycena: 7 typów konstrukcji, warianty otwierania, szkło i okucia są uwzględniane automatycznie',
          'Ceny, kompatybilność i dostępność są zawsze aktualne, ustawiane w panelu administracyjnym bez programisty',
          'Gotowa oferta dla klienta w 3 minuty, z dokładnym kosztorysem pozycji, zamiast pół godziny w Excelu',
          'Zapytania przychodzą już z konfiguracją, więc nie trzeba dopytywać klienta, czego dokładnie chce',
        ],
      },
      {
        icon: Globe,
        title: 'Dla strony internetowej i klienta końcowego',
        items: [
          'Wizualizacja 3D w czasie rzeczywistym: fotorealistyczny model, który można obracać',
          'Elastyczna konfiguracja "pod siebie": kształt konstrukcji, szkło, okucia, systemy otwierania, wszystko układane wizualnie',
          'Przejrzysta wycena na oczach klienta, bez telefonów i czekania na handlowca',
          'Zapytanie lub oferta jednym kliknięciem prosto z konfiguratora, z możliwością udostępnienia konfiguracji linkiem',
        ],
      },
    ],
  },

  configurationSection: {
    title: {
      start: 'Wszystko, czego potrzeba do konfiguracji ',
      accent: 'kabiny prysznicowej',
    },
    description:
      'Klient lub handlowiec wybiera potrzebną konfigurację i od razu widzi, jak wygląda w 3D.',
    videoSrc: '/storage/videos/showers/showers_config.mp4',
    imageSrc: '',
    items: [
      {
        icon: ScanBox,
        title: '7 kształtów kabin prysznicowych',
        text: 'Proste, narożne, przesuwne, uchylne i inne, do każdego układu łazienki.',
      },
      {
        icon: Palette,
        title: 'Kolor i faktura szkła',
        text: 'Przezroczyste, matowe, przyciemniane lub teksturowane, zmiany widoczne od razu na modelu 3D.',
      },
      {
        icon: SwatchBook,
        title: 'Okucia i ich kolor',
        text: 'Uchwyty, zawiasy, profile, w chromie, czarnym macie, złocie i innych wykończeniach.',
      },
      {
        icon: DoorOpen,
        title: 'Typ otwierania i liczba drzwi',
        text: 'Drzwi przesuwne, uchylne lub składane, jedne, dwoje lub więcej.',
      },
      {
        icon: Truck,
        title: 'Dostawa, montaż, pomiar',
        text: 'Usługi dodatkowe dodawane są bezpośrednio w konfiguratorze i od razu trafiają do wyceny.',
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
        title: 'Automatyczny kosztorys',
        text: (
          <>
            Konfigurator przelicza wycenę w czasie rzeczywistym przy każdej zmianie parametrów:
            wymiarów, szkła, okuć, usług.
            <br />
            <br />
            Handlowiec widzi pełny rozkład kosztów i sumę końcową od razu, bez ręcznych obliczeń.
          </>
        ),
        videoSrc: '/storage/videos/showers/showers_estimate.mp4',
      },
      {
        title: 'Oferta dla klienta',
        text: (
          <>
            Po zakończeniu obliczeń jednym kliknięciem powstaje gotowa oferta handlowa z
            parametrami i ceną końcową.
            <br />
            <br />
            Oferta jest zawsze zsynchronizowana z aktualnymi cenami, a konfiguracją można
            podzielić się linkiem jeszcze przed wygenerowaniem dokumentu.
          </>
        ),
        videoSrc: '/storage/videos/showers/showers_kp.mp4',
      },
      {
        title: 'Panel administracyjny',
        text: (
          <>
            Ceny, materiały, kolory i usługi widoczne dla klienta ustawiane i aktualizowane są w
            panelu administracyjnym, bez udziału programistów.
            <br />
            <br />
            Zmiany od razu obowiązują w obliczeniach, firma elastycznie zarządza asortymentem i
            polityką cenową samodzielnie.
          </>
        ),
        videoSrc: '/storage/videos/showers/showers_admin.mp4',
      },
    ],
  },

  subscriptionSection: {
    badgeText: 'Model współpracy',
    title: {
      start: 'Produkt subskrypcyjny, ',
      accent: 'ze stałymi aktualizacjami i nowymi funkcjami',
    },
    buttonText: 'Poznaj cenę',
    items: [
      {
        icon: Cloud,
        title: 'Gotowe rozwiązanie SaaS w subskrypcji',
        description: 'Bez nakładów inwestycyjnych na rozwój i z szybkim startem.',
      },
      {
        icon: Paintbrush,
        title: 'Dopasowane do Ciebie',
        description: 'Katalog, ceny i branding dopasowane do Twojej linii produktowej i identyfikacji wizualnej.',
      },
      {
        icon: Sliders,
        title: 'Panel administracyjny bez programistów',
        description: 'Zarządzaj katalogiem, cenami i logiką bez programistów.',
      },
      {
        icon: RefreshCw,
        title: 'Ciągły rozwój',
        description:
          'Nowe funkcje, typy konstrukcji i ulepszenia 3D, regularnie i bez dopłat w ramach subskrypcji.',
      },
    ],
  },

  ctaSection: {
    title: 'Chcesz takie narzędzie dla swojej firmy?',
    description:
      'Zostaw zapytanie, pokażemy demo na prawdziwych danych i opowiemy o kosztach wdrożenia.',
    buttonLabel: 'Poproś o demo',
  },
};

export default productData;
