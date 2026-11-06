import React from 'react';
import { Head } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';

import MainLayout from '@/layouts/MainLayout';
import SectionLayout from '@/shared/components/layouts/SectionLayout';
import { ApiInspector } from '@widgets/ApiInspector';
import { BootstrapHeroBlock } from './components/BootstrapHeroBlock';
import { BootstrapVisualizer } from './components/BootstrapVisualizer';
import { useBootstrap } from './hooks/useBootstrap';
import { t } from '@/shared/i18n/useTranslation';

export default function BootstrapIndex() {
  
  const { data, isLoading, endpoint } = useBootstrap();

  const apiRequests = [{
    label: t('boot_api_request_label'),
    method: 'GET',
    endpoint: endpoint,
    data: data
  }];

  return (
    <MainLayout headerOverlaps={false}>
      <Head title={t('boot_page_title')} />
      <BootstrapHeroBlock />

      <SectionLayout containerVariant="content" className="pt-8 md:pt-12 pb-24">
        <div className="w-full relative z-10">
          {isLoading ? (
            <div className="py-32 flex justify-center">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
          ) : data ? (
            <>
              <BootstrapVisualizer config={data} />

              <div className="flex items-center justify-between mb-8 border-b border-border pb-6 mt-16">
                <h2 className="text-2xl font-bold text-foreground tracking-tight">{t('api_raw_response')}</h2>
              </div>

              <ApiInspector requests={apiRequests} />
            </>
          ) : null}
        </div>
      </SectionLayout>
    </MainLayout>
  );
}

BootstrapIndex.layout = (page: any) => page;
