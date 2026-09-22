import React, { useEffect } from 'react';
import {Head} from '@inertiajs/react';

import MainLayout from '@/layouts/MainLayout';
import SectionLayout from '@/shared/components/layouts/SectionLayout';
import {CatalogFilters} from '@/features/catalog/components/CatalogFilters';
import {CatalogSearchInput} from '@/features/catalog/components/CatalogSearchInput';
import {useCatalogParams} from '@/features/catalog/hooks/useCatalogParams';
import {useCatalogApi} from '@/features/catalog/hooks/useCatalogApi';

import {CatalogHeroBlock} from './components/CatalogHeroBlock';
import {CatalogNavigationBlock} from './components/CatalogNavigationBlock';
import {ProductGridBlock} from './components/ProductGridBlock';
import {ApiInspector} from '@widgets/ApiInspector';
import {useDevMode} from '@/shared/hooks/useDevMode';
import { useTranslation } from '@/shared/i18n/useTranslation';

export default function CatalogIndex() {
  const { t } = useTranslation();
  const isDev = useDevMode();

  const {
    family, productType, search, page, filters: activeFilters,
    setFamily, setProductType, setSearch, setPage, toggleFilter, clearFilters
  } = useCatalogParams('');

  const {
    products, meta, filtersSchema, bootstrapConfig, isLoading, apiUrl
  } = useCatalogApi({family, productType, search, page, filters: activeFilters});

  const familiesList = bootstrapConfig?.families || [];

  // Автоматический выбор первого семейства из БД, если в URL ничего не выбрано или указан невалидный код
  useEffect(() => {
    if (familiesList.length > 0) {
      const isFamilyValid = familiesList.some(f => f.code === family);
      if (!family || !isFamilyValid) {
        setFamily(familiesList[0].code);
      }
    }
  }, [familiesList, family, setFamily]);

  const activeFamilyData = familiesList.find(f => f.code === family);
  const typesForActiveFamily = activeFamilyData?.types || [];
  const activeFamilyName = activeFamilyData?.name;

  const hasActiveFilters = Object.keys(activeFilters).length > 0 || Boolean(search);

  const apiRequests = [
    {
      label: 'Данные Каталога (Товары / Услуги)',
      endpoint: apiUrl,
      data: {data: products, meta: meta}
    },
    {
      label: 'Схема Фильтров Каталога',
      endpoint: `/api/v1/${family}/filters`,
      data: filtersSchema
    },
    {
      label: 'Глобальная Конфигурация (Bootstrap)',
      endpoint: '/api/v1/bootstrap',
      data: bootstrapConfig
    }
  ];

  return (
    <MainLayout headerOverlaps={false}>
      <Head title={`${activeFamilyName || t('catalog_default_category')} - VMS-NC Box`}/>

      <CatalogHeroBlock/>

      <SectionLayout containerVariant="content" className="pt-0 -mt-6 md:-mt-10">

        <CatalogNavigationBlock
          familiesList={familiesList}
          activeFamily={family}
          setFamily={setFamily}
          typesSchema={typesForActiveFamily}
          productType={productType}
          setProductType={setProductType}
        />

        {/* Строка поиска */}
        <div className="mb-8 w-full flex justify-start">
          <CatalogSearchInput
            value={search}
            onChange={setSearch}
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          <aside className="hidden lg:block lg:w-[260px] xl:w-[280px] shrink-0">
            <div className="sticky top-28 max-h-[calc(100vh-140px)] overflow-y-auto pr-4 custom-scrollbar">
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="mb-8 text-[12px] font-bold text-muted-foreground hover:text-primary uppercase tracking-widest border-b border-border hover:border-primary pb-1 transition-colors cursor-pointer"
                >
                  {t('catalog_reset_filters')}
                </button>
              )}
              <CatalogFilters filters={filtersSchema} activeFilters={activeFilters} onToggle={toggleFilter}/>
            </div>
          </aside>

          <div className="lg:col-span-9 flex-1 relative flex flex-col pt-2 md:pt-4">

            <div className="relative flex-1 mb-16">
              <ProductGridBlock
                isLoading={isLoading}
                products={products}
                meta={meta}
                setPage={setPage}
                clearFilters={clearFilters}
                bootstrapConfig={bootstrapConfig}
              />
            </div>

            {!isLoading && isDev && (
              <div className="mt-8 border-t border-border pt-12 pb-8">
                <h3 className="text-xl font-bold text-foreground mb-6">{t('api_inspector_title')}</h3>
                <ApiInspector requests={apiRequests}/>
              </div>
            )}

          </div>
        </div>
      </SectionLayout>
    </MainLayout>
  );
}

CatalogIndex.layout = (page: any) => page;