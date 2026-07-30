

import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import MainLayout from '@/layouts/MainLayout';

import { PartitionOpeningTypesBlock } from '@/shared/components/blocks/PartitionOpeningTypesBlock';
import { InlineFormBanner } from '@/shared/components/blocks/InlineFormBanner';
import { GlassTypesGrid } from '@/shared/components/blocks/GlassTypesGrid';
import { WhyPartitionsBlock } from '@/shared/components/blocks/WhyPartitionsBlock';
import { ProcessSteps } from '@/shared/components/blocks/ProcessSteps';
import { AdvantagesGrid } from '@/shared/components/blocks/AdvantagesGrid';
import { PortfolioGallery } from '@/shared/components/blocks/PortfolioGallery';
import { FaqAccordion } from '@/shared/components/blocks/FaqAccordion';
import { LeadModal } from '@/features/lead-capture/LeadModal';
import { siteAssets } from '@/shared/config/site-assets';
import {HeroCover} from "@shared/components/blocks/HeroCover";

export default function PartitionsIndex() {
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("Заявка на консультацию");

  return (
    <MainLayout headerOverlaps={false}>
      <Head title="Межкомнатные перегородки - изготовление и установка в Минске" />

      {}
      <HeroCover
        title="Межкомнатные перегородки"
        description="Лучшее интерьерное решение для современного дизайна"
        bgImage={siteAssets.hero.partitions}
      />

      {}
      <div className="max-w-4xl mx-auto text-center px-4 py-6">
        <p className="text-sm md:text-base text-slate-600 font-normal leading-relaxed">
          Мы ценим каждого клиента и предлагаем самые удобные условия: рассрочку, доставку и установку, которые уже включены в стоимость, а также личные консультации и другие преимущества.
        </p>
      </div>

      {}
      <PartitionOpeningTypesBlock />

      {}
      {/* <InlineFormBanner
        title="Не можете определиться?"
        subtitle="Получите профессиональную консультацию от экспертов «Прозрачные решения»!"
        variant="white"
      />*/}

      {/* 4. Виды стекла (8 видов) */}
      <GlassTypesGrid />

      {/* 5. Зачем нужны перегородки */}
      <WhyPartitionsBlock />

      {/* 6. Оставьте заявку на расчет стоимости */}
      {/* <InlineFormBanner
        title="Оставьте заявку на расчет стоимости"
        subtitle="Если вы знаете размеры — сделаем расчет по ним, либо приедем на замер к вам."
        variant="blue"
      />*/}

      {/* 7. Этапы работы */}
      {/*<ProcessSteps />*/}

      {/* 8. 6 причин выбрать нас */}
      {/*<AdvantagesGrid />*/}

      {/* 9. Наши работы */}
      {/* <PortfolioGallery title="Наши работы" />*/}

      {/* 10. Вопросы-ответы */}
      <FaqAccordion />

      <LeadModal
        isOpen={isLeadModalOpen}
        onClose={() => setIsLeadModalOpen(false)}
        sourceTitle={modalTitle}
      />
    </MainLayout>
  );
}

PartitionsIndex.layout = (page: any) => page;
