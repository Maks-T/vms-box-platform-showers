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
  product: 'Configuratore box doccia',
  category: 'Configuratore box doccia',
  title: {
    start: 'Configuratore 3D di box doccia',
    accent: '',
    end: '',
  },
  description: [
    "Uno strumento unico: preventivi rapidi per il team vendite e generazione di lead dal sito. Il cliente compone il proprio box doccia in 3D, vede il prezzo e invia una richiesta. Voi ricevete una configurazione già pronta, non un lead generico.",
  ],
  heroButtonText: 'Richiedi un preventivo',
  videoSrc: '/storage/videos/showers/showers_hero.mp4',
  demoAppUrl: '/products/showers/demo',

  benefitsSection: {
    title: {
      start: 'Un vantaggio',
      finish: ' sia per le vendite che per il sito',
    },
    description:
      'Lo stesso motore di calcolo funziona come strumento di lavoro per i vostri commerciali e come widget di vendita per i vostri clienti.',
    cards: [
      {
        icon: Headset,
        title: 'Per commerciali e team vendite',
        items: [
          'Calcolo istantaneo del prezzo: 7 tipi di struttura, varianti di apertura, vetro e ferramenta vengono considerati automaticamente',
          'Prezzi, compatibilità e disponibilità sempre aggiornati, gestiti nel pannello di amministrazione senza sviluppatori',
          "Preventivo pronto per il cliente in 3 minuti, con un dettaglio preciso delle voci, invece di mezz'ora su Excel",
          'Le richieste arrivano già con la configurazione, senza bisogno di chiedere al cliente cosa desidera esattamente',
        ],
      },
      {
        icon: Globe,
        title: 'Per il sito e il cliente finale',
        items: [
          'Visualizzazione 3D in tempo reale: un modello fotorealistico che il cliente può ruotare',
          'Personalizzazione flessibile: forma della struttura, vetro, ferramenta, sistemi di apertura, tutto configurato visivamente',
          'Preventivo trasparente sotto gli occhi del cliente, senza telefonate e senza attese',
          'Richiesta o preventivo con un clic direttamente dal configuratore, con link condivisibile della configurazione',
        ],
      },
    ],
  },

  configurationSection: {
    title: {
      start: 'Tutto il necessario per configurare un ',
      accent: 'box doccia',
    },
    description:
      'Il cliente o il commerciale sceglie la configurazione desiderata e la vede subito in 3D.',
    videoSrc: '/storage/videos/showers/showers_config.mp4',
    imageSrc: '',
    items: [
      {
        icon: ScanBox,
        title: '7 forme di box doccia',
        text: 'Lineari, angolari, scorrevoli, a battente e altre ancora, per ogni layout del bagno.',
      },
      {
        icon: Palette,
        title: 'Colore e finitura del vetro',
        text: 'Trasparente, satinato, colorato o strutturato, con modifiche visibili subito sul modello 3D.',
      },
      {
        icon: SwatchBook,
        title: 'Ferramenta e sua finitura',
        text: 'Maniglie, cerniere, profili, in cromo, nero opaco, oro e altre finiture.',
      },
      {
        icon: DoorOpen,
        title: 'Tipo di apertura e numero di ante',
        text: 'Scorrevoli, a battente o pieghevoli, con una, due o più ante.',
      },
      {
        icon: Truck,
        title: 'Consegna, installazione, sopralluogo',
        text: 'I servizi aggiuntivi si aggiungono direttamente nel configuratore e vengono subito inclusi nel preventivo.',
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
        title: 'Preventivo automatico',
        text: (
          <>
            Il configuratore ricalcola il preventivo in tempo reale a ogni modifica dei
            parametri: dimensioni, vetro, ferramenta, servizi.
            <br />
            <br />
            Il commerciale vede subito il dettaglio completo dei costi e il totale, senza calcoli
            manuali.
          </>
        ),
        videoSrc: '/storage/videos/showers/showers_estimate.mp4',
      },
      {
        title: 'Preventivo per il cliente',
        text: (
          <>
            Al termine del calcolo, con un clic si genera un preventivo commerciale pronto con
            tutti i parametri e il prezzo finale.
            <br />
            <br />
            Il preventivo è sempre sincronizzato con i prezzi aggiornati, e la configurazione può
            essere condivisa tramite link ancora prima di generare il documento.
          </>
        ),
        videoSrc: '/storage/videos/showers/showers_kp.mp4',
      },
      {
        title: 'Pannello di amministrazione',
        text: (
          <>
            Prezzi, materiali, colori e servizi visibili al cliente vengono impostati e
            aggiornati nel pannello di amministrazione, senza coinvolgere gli sviluppatori.
            <br />
            <br />
            Le modifiche si applicano subito ai calcoli, l'azienda gestisce in autonomia e con
            flessibilità l'assortimento e la politica dei prezzi.
          </>
        ),
        videoSrc: '/storage/videos/showers/showers_admin.mp4',
      },
    ],
  },

  subscriptionSection: {
    badgeText: 'Modello di collaborazione',
    title: {
      start: 'Un prodotto in abbonamento, ',
      accent: 'con aggiornamenti continui e nuove funzionalità',
    },
    buttonText: 'Scopri il prezzo',
    items: [
      {
        icon: Cloud,
        title: 'Soluzione SaaS pronta in abbonamento',
        description: 'Senza investimenti iniziali per lo sviluppo e con un avvio rapido.',
      },
      {
        icon: Paintbrush,
        title: 'Configurato su misura per voi',
        description: 'Catalogo, prezzi e branding adattati alla vostra linea di prodotti e alla vostra identità visiva.',
      },
      {
        icon: Sliders,
        title: 'Pannello di amministrazione senza sviluppatori',
        description: 'Gestite catalogo, prezzi e logica senza programmatori.',
      },
      {
        icon: RefreshCw,
        title: 'Sviluppo continuo',
        description:
          "Nuove funzionalità, tipi di struttura e miglioramenti 3D, con regolarità e senza costi aggiuntivi nell'abbonamento.",
      },
    ],
  },

  ctaSection: {
    title: 'Volete questo strumento per la vostra azienda?',
    description:
      'Lasciate una richiesta, vi mostreremo una demo con dati reali e vi spiegheremo i costi di attivazione.',
    buttonLabel: 'Richiedi una demo',
  },
};

export default productData;
