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
  product: 'Duşakabin Konfigüratörü',
  category: 'Duşakabin Konfigüratörü',
  title: {
    start: '3D Duşakabin Konfigüratörü',
    accent: '',
    end: '',
  },
  description: [
    'Tek bir araç: satış ekibiniz için hızlı fiyat teklifi ve web sitenizden potansiyel müşteri kazanımı. Müşteri kendi duşakabinini 3D olarak tasarlar, fiyatı görür ve talep gönderir. Siz belirsiz bir potansiyel müşteri değil, hazır bir konfigürasyon alırsınız.',
  ],
  heroButtonText: 'Fiyat Talep Et',
  videoSrc: '/storage/videos/showers/showers_hero.mp4',
  demoAppUrl: '/products/showers/demo',

  benefitsSection: {
    title: {
      start: 'Hem satış ekibine',
      finish: ' hem de web sitesine fayda',
    },
    description:
      'Aynı hesaplama motoru, satış temsilcileriniz için çalışma aracı, müşterileriniz için ise satışı destekleyen bir widget olarak çalışır.',
    cards: [
      {
        icon: Headset,
        title: 'Satış temsilcileri ve satış ekibi için',
        items: [
          'Anında fiyat hesaplama: 7 konstrüksiyon tipi, açılım seçenekleri, cam ve aksesuarlar otomatik olarak hesaba katılır',
          'Fiyatlar, uyumluluk ve stok durumu her zaman güncel, admin panelinden geliştirici gerekmeden yönetilir',
          "3 dakikada müşteri için hazır teklif, Excel'de yarım saat yerine kalem kalem detaylı maliyet dökümüyle",
          'Talepler konfigürasyonla birlikte gelir, müşteriye tam olarak ne istediğini sormaya gerek kalmaz',
        ],
      },
      {
        icon: Globe,
        title: 'Web sitesi ve son müşteri için',
        items: [
          'Gerçek zamanlı 3D görselleştirme: müşterinin döndürebileceği fotogerçekçi bir model',
          'Esnek kişiselleştirme: konstrüksiyon şekli, cam, aksesuar, açılım sistemleri, hepsi görsel olarak oluşturulur',
          'Müşterinin gözü önünde şeffaf fiyatlandırma, telefon görüşmesi ve temsilci beklemeden',
          'Konfigüratörden tek tıkla talep veya teklif, konfigürasyonu paylaşılabilir bağlantıyla gönderme imkanıyla',
        ],
      },
    ],
  },

  configurationSection: {
    title: {
      start: 'Duşakabini yapılandırmak için ',
      accent: 'gerekli her şey',
    },
    description:
      'Müşteri veya satış temsilcisi ihtiyacı olan konfigürasyonu seçer ve anında 3D olarak nasıl göründüğünü görür.',
    videoSrc: '/storage/videos/showers/showers_config.mp4',
    imageSrc: '',
    items: [
      {
        icon: ScanBox,
        title: '7 duşakabin şekli',
        text: 'Düz, köşe, sürgülü, menteşeli ve diğerleri, her banyo düzenine uygun.',
      },
      {
        icon: Palette,
        title: 'Cam rengi ve dokusu',
        text: 'Şeffaf, buzlu, renkli veya dokulu, değişiklikler anında 3D modelde görünür.',
      },
      {
        icon: SwatchBook,
        title: 'Aksesuarlar ve rengi',
        text: 'Kollar, menteşeler, profiller, krom, mat siyah, altın ve diğer kaplamalarda.',
      },
      {
        icon: DoorOpen,
        title: 'Açılım tipi ve kapı sayısı',
        text: 'Sürgülü, menteşeli veya katlanır konstrüksiyonlar, bir, iki veya daha fazla kapı ile.',
      },
      {
        icon: Truck,
        title: 'Teslimat, montaj, ölçüm',
        text: 'Ek hizmetler doğrudan konfigüratöre eklenir ve anında teklife yansır.',
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
        title: 'Otomatik Fiyat Teklifi',
        text: (
          <>
            Konfigüratör, her parametre değişikliğinde teklifi gerçek zamanlı olarak yeniden
            hesaplar: ölçüler, cam, aksesuarlar, hizmetler.
            <br />
            <br />
            Satış temsilcisi, manuel hesaplama yapmadan tam maliyet dökümünü ve toplam tutarı
            anında görür.
          </>
        ),
        videoSrc: '/storage/videos/showers/showers_estimate.mp4',
      },
      {
        title: 'Müşteri İçin Teklif',
        text: (
          <>
            Hesaplama tamamlandığında tek tıkla tüm parametreleri ve son fiyatı içeren hazır bir
            ticari teklif oluşturulur.
            <br />
            <br />
            Teklif her zaman güncel fiyatlarla senkronize olur ve konfigürasyon, belge
            oluşturulmadan önce bile bağlantı üzerinden paylaşılabilir.
          </>
        ),
        videoSrc: '/storage/videos/showers/showers_kp.mp4',
      },
      {
        title: 'Yönetim Paneli',
        text: (
          <>
            Müşterinin gördüğü fiyatlar, malzemeler, renkler ve hizmetler, geliştirici katılımı
            olmadan yönetim panelinden ayarlanır ve güncellenir.
            <br />
            <br />
            Değişiklikler hesaplamalara anında yansır, şirket ürün yelpazesini ve fiyat
            politikasını esnek biçimde kendisi yönetir.
          </>
        ),
        videoSrc: '/storage/videos/showers/showers_admin.mp4',
      },
    ],
  },

  subscriptionSection: {
    badgeText: 'İş Birliği Modeli',
    title: {
      start: 'Abonelik bazlı bir ürün, ',
      accent: 'sürekli güncellemeler ve yeni özelliklerle',
    },
    buttonText: 'Fiyat Öğren',
    items: [
      {
        icon: Cloud,
        title: 'Hazır SaaS Abonelik Çözümü',
        description: 'Geliştirme için başlangıç yatırımı gerekmeden, hızlı bir başlangıçla.',
      },
      {
        icon: Paintbrush,
        title: 'Size Göre Yapılandırılır',
        description: 'Katalog, fiyatlar ve marka, ürün gamınıza ve kurumsal kimliğinize göre uyarlanır.',
      },
      {
        icon: Sliders,
        title: 'Geliştirici Gerektirmeyen Yönetim Paneli',
        description: 'Katalog, fiyat ve mantığı programcı olmadan yönetin.',
      },
      {
        icon: RefreshCw,
        title: 'Sürekli Gelişim',
        description:
          'Yeni özellikler, konstrüksiyon tipleri ve 3D iyileştirmeler, aboneliğiniz kapsamında düzenli olarak ve ek ücret olmadan.',
      },
    ],
  },

  ctaSection: {
    title: 'İşletmeniz için bu aracı ister misiniz?',
    description:
      'Bir talep bırakın, gerçek verilerle bir demo gösterelim ve fiyatlandırmayı anlatalım.',
    buttonLabel: 'Demo Talep Et',
  },
};

export default productData;
