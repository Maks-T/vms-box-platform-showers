import React from 'react';
import { Accent } from '@/shared/components/ui/Typography';
import {PageHero} from "@shared/components/ui/PageHero";
import { useTranslation } from '@/shared/i18n/useTranslation';

export function CatalogHeroBlock() {
  const { t } = useTranslation();

  return (
    <PageHero
      badge={t('catalog_hero_badge')}
      title={<>{t('catalog_hero_title_1')} <Accent variant="light">{t('catalog_hero_title_accent')}</Accent></>}
      description={t('catalog_hero_desc')}
    />
  );
}