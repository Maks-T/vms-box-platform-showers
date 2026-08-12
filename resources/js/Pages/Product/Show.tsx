import React, {useState, useEffect} from 'react';
import {Head} from '@inertiajs/react';
import MainLayout from '@/layouts/MainLayout';
import SectionLayout from '@/shared/components/layouts/SectionLayout';
import {StoneProduct, ProductVariant, BootstrapConfig} from '@/types/catalog';
import Breadcrumbs from '@/shared/components/ui/Breadcrumbs';
import {ProductGallery} from './components/ProductGallery';
import {ProductVariantSelector} from './components/ProductVariantSelector';
import {ProductAttributesTable} from './components/ProductAttributesTable';
import {Button} from '@/shared/components/ui/Button';
import {FavoriteButton} from '@/shared/components/ui/FavoriteButton';
import {LeadModal} from '@/features/lead-capture/LeadModal';
import {checkDevMode} from '@/shared/lib/dev';
import {bootstrapApi} from '@/shared/api/bootstrap.api';
import {ApiInspector} from '@widgets/ApiInspector';
import {Calculator, CheckCircle2} from 'lucide-react';

interface Props {
  product: StoneProduct;
  familyCode: string;
}

export default function ProductShow({product, familyCode}: Props) {
  const [bootstrapConfig, setBootstrapConfig] = useState<BootstrapConfig | null>(null);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);

  useEffect(() => {
    bootstrapApi.getConfig().then(setBootstrapConfig);
  }, []);

  const [activeVariant, setActiveVariant] = useState<ProductVariant | null>(() => {
    if (!product.variants || product.variants.length === 0) return null;
    return product.variants.find(v => v.is_default) || product.variants[0];
  });

  const isDev = checkDevMode();
  const defaultPriceType = bootstrapConfig?.price_types?.find((pt: any) => pt.is_default)?.slug || 'retail';
  const currencySymbol = bootstrapConfig?.base_currency?.symbol_native || bootstrapConfig?.base_currency?.symbol || 'руб.';

  const displayPrice = activeVariant
    ? (activeVariant.prices?.[defaultPriceType] || Object.values(activeVariant.prices || {})[0] || product.price_from)
    : product.price_from;

  const formattedPrice = displayPrice > 0
    ? new Intl.NumberFormat('ru-RU', {minimumFractionDigits: 0, maximumFractionDigits: 2}).format(displayPrice)
    : '';

  const displayImage = activeVariant?.preview_picture || product.preview_picture;

  const unitSymbol = product.unit ? (product.unit.symbol || product.unit.name) : 'шт.';

  const apiEndpoint = `/api/v1/${familyCode}/products?id=${product.id}`;
  const apiRequests = [
    {
      label: 'Карточка товара',
      method: 'GET',
      endpoint: apiEndpoint,
      data: product
    }
  ];

  const handleOrder = () => {
    setIsLeadModalOpen(true);
  };

  const hasAttributes = product.attributes && Object.keys(product.attributes).length > 0;

  const breadcrumbItems = [
    {label: 'Каталог', href: '/catalog'},
    {label: product.name}
  ];

  return (
    <MainLayout headerOverlaps={false}>
      <Head title={`${product.name} - Прозрачные решения`}/>

      <SectionLayout containerVariant="content" className="py-2 md:py-6 bg-white">
        <div className="w-full max-w-[1240px] mx-auto flex flex-col">
          <Breadcrumbs items={breadcrumbItems} variant="dark"/>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-14 items-start my-4">
            <div className="lg:col-span-6 sticky top-28">
              <ProductGallery
                mainImage={displayImage}
                productName={product.name}
                sku={activeVariant?.sku}
                id={product.id}
              />
            </div>

            <div className="lg:col-span-6 flex flex-col">
              <div className="flex items-center justify-between gap-4 mb-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Артикул: {activeVariant?.sku || product.code || product.external_code || product.id}
                </span>

                <div
                  className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full text-xs font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5"/>
                  <span>В наличии / Под заказ 15 дней</span>
                </div>
              </div>

              <h1
                className="text-2xl sm:text-3xl md:text-4xl font-semibold text-slate-900 tracking-tight leading-tight mb-4">
                {product.name}
              </h1>

              {product.short_description && (
                <p className="text-sm md:text-base text-slate-600 font-normal leading-relaxed mb-4">
                  {product.short_description}
                </p>
              )}

              <div className="flex items-baseline gap-2 my-2">
                {displayPrice > 0 ? (
                  <>
                    <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                      {formattedPrice}
                    </span>
                    <span className="text-base text-slate-500 font-medium">
                      {currencySymbol} / {unitSymbol}
                    </span>
                  </>
                ) : (
                  <span className="text-2xl font-bold text-[#004F87]">
                    Цена по запросу
                  </span>
                )}
              </div>

              <ProductVariantSelector
                variants={product.variants || []}
                activeVariant={activeVariant}
                onSelectVariant={setActiveVariant}
              />

              <div className="flex items-center gap-4 my-6">
                <Button
                  onClick={handleOrder}
                  variant="tilda"
                  size="lg"
                  className="flex-1 h-13 text-sm font-bold uppercase tracking-wider rounded-xl shadow-md"
                >
                  <Calculator className="w-5 h-5 mr-2"/>
                  Рассчитать стоимость
                </Button>

                <div
                  className="p-3.5 bg-slate-100 rounded-xl border border-slate-200/80 flex items-center justify-center">
                  <FavoriteButton product={product}/>
                </div>
              </div>
            </div>
          </div>

          {(product.description || hasAttributes) && (
            <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col gap-8">
              {product.description && (
                <div className="max-w-3xl flex flex-col gap-3">
                  <h3 className="text-lg font-bold text-slate-900">Описание</h3>
                  <div className="prose prose-slate text-slate-700 text-sm md:text-base leading-relaxed"
                       dangerouslySetInnerHTML={{__html: product.description}}/>
                </div>
              )}

              {hasAttributes && (
                <div className="max-w-2xl flex flex-col gap-3">
                  <h3 className="text-lg font-bold text-slate-900">Характеристики</h3>
                  <ProductAttributesTable attributes={product.attributes || {}}/>
                </div>
              )}
            </div>
          )}

          {isDev && (
            <div className="mt-16 pt-8 border-t border-slate-200">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Инспектор API запросов</h3>
              <ApiInspector requests={apiRequests}/>
            </div>
          )}
        </div>
      </SectionLayout>

      <LeadModal
        isOpen={isLeadModalOpen}
        onClose={() => setIsLeadModalOpen(false)}
        sourceTitle={`Расчет карточки товара: ${product.name} (${activeVariant?.sku || product.id})`}
      />
    </MainLayout>
  );
}

ProductShow.layout = (page: any) => page;