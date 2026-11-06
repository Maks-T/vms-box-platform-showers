import React from 'react';
import SectionLayout from '@/shared/components/layouts/SectionLayout';
import WaveBackground from '@/shared/components/ui/WaveBackground';
import {H1, Text, Accent} from '@/shared/components/ui/Typography';
import StatusBadge from '@/shared/components/ui/StatusBadge';
import { t } from '@/shared/i18n/useTranslation';

export function CatalogHero() {
  return (
    <SectionLayout
      bg="bg-[#0B0F19]"
      bgElement={<WaveBackground/>}
      containerVariant="content"
      className="pt-2 md:pt-4"
    >
      <div className="flex flex-col pt-12 pb-16 lg:pt-20 lg:pb-24 max-w-3xl">
        <StatusBadge variant="blue" className="mb-6 self-start">
          API Sandbox & Catalog
        </StatusBadge>

        <H1 className="mb-6">
          {t('sandbox_hero_title_1')} <Accent variant="light">{t('sandbox_hero_title_accent')}</Accent>
        </H1>

        <Text variant="leadDark" className="text-slate-400 leading-relaxed">
          {t('sandbox_hero_desc')}
        </Text>
      </div>
    </SectionLayout>
  );
}