

import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import MainLayout from '@/layouts/MainLayout';

import { MirrorTypesGrid } from '@/shared/components/blocks/MirrorTypesGrid';
import { MirrorShapesGrid } from '@/shared/components/blocks/MirrorShapesGrid';
import { MirrorExecutionsGrid } from '@/shared/components/blocks/MirrorExecutionsGrid';
import { InlineFormBanner } from '@/shared/components/blocks/InlineFormBanner';
import { ProcessSteps } from '@/shared/components/blocks/ProcessSteps';
import { AdvantagesGrid } from '@/shared/components/blocks/AdvantagesGrid';
import { PortfolioGallery } from '@/shared/components/blocks/PortfolioGallery';
import { FaqAccordion } from '@/shared/components/blocks/FaqAccordion';
import { LeadModal } from '@/features/lead-capture/LeadModal';
import { siteAssets } from '@/shared/config/site-assets';
import {HeroCover} from "@shared/components/blocks/HeroCover";

export default function MirrorsIndex() {
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);

  return (
    <MainLayout headerOverlaps={false}>
      <Head title="Зеркала на заказ с подсветкой и фацетом в Минске - Прозрачные решения" />

      {}
      <HeroCover
        title="Зеркала"
        description="Мы изготавливаем на заказ и по индивидуальным эскизам. Создайте уникальное пространство, где каждая деталь продумана до мелочей."
        bgImage={siteAssets.hero.mirrors}
      />

      {}
      <div className="max-w-4xl mx-auto text-center px-4 py-6">
        <p className="text-sm md:text-base text-slate-600 font-normal leading-relaxed">
          Мы предлагаем изготовление душевых кабин и зеркал «под ключ» с учётом всех ваших пожеланий. Наши специалисты помогут вам выбрать материалы, фурнитуру и дополнительные функции для вашего зеркала. Мы гарантируем высокое качество работы и соблюдение сроков.
        </p>
      </div>

      {}
      <MirrorTypesGrid />

      {/* 3. Форма зеркала (Прямоугольное, Круглое, Криволинейное) */}
      <MirrorShapesGrid />

      {/* 4. Варианты исполнения (Подсветка, Фацет, Узоры) */}
      <MirrorExecutionsGrid />

      {/* 5. Не можете определиться? */}
      {/*<InlineFormBanner
        title="Не можете определиться?"
        subtitle="Получите профессиональную консультацию от экспертов «Прозрачные решения»!"
        variant="white"
      />*/}

      {/* 6. Этапы работы */}
      {/*<ProcessSteps />*/}

      {/* 7. 6 причин выбрать нас */}
      {/*<AdvantagesGrid />*/}

      {/* 8. Наши работы */}
      {/*<PortfolioGallery title="Наши работы" />*/}

      {/* 9. Вопросы-ответы */}
      <FaqAccordion />

     {/* <LeadModal
        isOpen={isLeadModalOpen}
        onClose={() => setIsLeadModalOpen(false)}
        sourceTitle="Консультация по зеркалам"
      />*/}
    </MainLayout>
  );
}

MirrorsIndex.layout = (page: any) => page;
