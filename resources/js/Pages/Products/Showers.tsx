import React from 'react';
import { Head } from '@inertiajs/react';
import MainLayout from '@/layouts/MainLayout';
import { useTranslation } from '@/shared/i18n/useTranslation';
import { getShowersProductData } from './data';
import { ProductHero } from './components/ProductHero';
import { ProductBenefits } from './components/ProductBenefits';
import { ProductConfigPreview } from './components/ProductConfigPreview';
import { ProductFeatureGrid } from './components/ProductFeatureGrid';
import { ProductSubscription } from './components/ProductSubscription';
import { ProductLeadBanner } from './components/ProductLeadBanner';

export default function Showers() {
  const { locale } = useTranslation();
  const productData = getShowersProductData(locale);

  const handleOpenModal = () => {
    if (typeof window !== 'undefined' && (window as any).AppBridge?.leads?.openModal) {
      (window as any).AppBridge.leads.openModal({
        formCode: 'product_showers_subscription',
        title: 'Contact Sales',
        hiddenData: { placement: 'Блок подписки (Конфигуратор душевых)' },
      });
    }
  };

  return (
    <>
      <Head
        title={productData.title?.start ? `${productData.title.start} | showers-cpq.tech` : '3D Shower Configurator | showers-cpq.tech'}
      >
        {productData.description?.[0] && (
          <meta name="description" content={productData.description[0]} />
        )}
      </Head>

      <ProductHero
        product={productData.product}
        category={productData.category}
        title={productData.title}
        description={productData.description}
        videoSrc={productData.videoSrc}
        btnText={productData.heroButtonText}
        demoAppUrl="/calculator"
      />

      <ProductBenefits sectionData={productData.benefitsSection} />

      <ProductConfigPreview
        sectionData={productData.configurationSection}
        demoUrl="/calculator"
      />

      <ProductFeatureGrid sectionData={productData.featureSection} />

      <ProductSubscription
        sectionData={productData.subscriptionSection}
        onActionClick={handleOpenModal}
      />

      <ProductLeadBanner
        sectionData={productData.ctaSection}
        placement="Страница продукта: Конфигуратор душевых"
      />
    </>
  );
}

Showers.layout = (page: any) => <MainLayout headerOverlaps={false}>{page}</MainLayout>;