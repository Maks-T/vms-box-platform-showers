import React from 'react';
import {Accent} from '@/shared/components/ui/Typography';
import {PageHero} from "@shared/components/ui/PageHero";
import { t } from '@/shared/i18n/useTranslation';

export function ServicesHeroBlock() {
  return (
    <PageHero
      badge={t('services_hero_badge')}
      title={<>{t('services_hero_title')} <Accent variant="light">{t('services_hero_accent')}</Accent></>}
      description={t('services_hero_desc')}
    />
  );
}
