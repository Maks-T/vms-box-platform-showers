import React from 'react';
import { Accent } from '@/shared/components/ui/Typography';
import {PageHero} from "@shared/components/ui/PageHero";
import { t } from '@/shared/i18n/useTranslation';

export function BootstrapHeroBlock() {
  return (
    <PageHero
      badge={t('boot_hero_badge')}
      title={<>Bootstrap <Accent variant="light">API</Accent></>}
      description={t('boot_hero_desc')}
    />
  );
}