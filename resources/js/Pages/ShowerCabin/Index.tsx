

import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import MainLayout from '@/layouts/MainLayout';

import { ConstructionTypesGrid } from '@/shared/components/blocks/ConstructionTypesGrid';
import { InlineFormBanner } from '@/shared/components/blocks/InlineFormBanner';
import { GlassTypesGrid } from '@/shared/components/blocks/GlassTypesGrid';
import { HardwareSection } from '@/shared/components/blocks/HardwareSection';
import { ProcessSteps } from '@/shared/components/blocks/ProcessSteps';
import { QualityMontageBlock } from '@/shared/components/blocks/QualityMontageBlock';
import { PortfolioGallery } from '@/shared/components/blocks/PortfolioGallery';
import { FaqAccordion } from '@/shared/components/blocks/FaqAccordion';
import { AdvantagesGrid } from '@/shared/components/blocks/AdvantagesGrid';
import { QuizCalculatorBlock } from '@/shared/components/blocks/QuizCalculatorBlock';
import { LeadModal } from '@/features/lead-capture/LeadModal';
import { siteAssets } from '@/shared/config/site-assets';
import {HeroCover} from "@shared/components/blocks/HeroCover";

export default function ShowerCabinIndex() {
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("Заявка на консультацию");

  const handleOpenConsultation = () => {
    setModalTitle("Консультация эксперта по душевым кабинам");
    setIsLeadModalOpen(true);
  };

  return (
    <MainLayout headerOverlaps={false}>
      <Head title="Душевые кабины под ключ в Минске - Прозрачные решения" />

      {}
      <HeroCover
        title="Душевые кабины"
        description="Мы изготавливаем на заказ и по индивидуальным эскизам. Создайте уникальное пространство, где каждая деталь продумана до мелочей."
        bgImage={siteAssets.hero.showerCabin}
      />

      {}
      <div className="max-w-4xl mx-auto text-center px-4 py-6">
        <p className="text-sm md:text-base text-slate-600 font-normal leading-relaxed">
          Мы предлагаем изготовление душевых кабин «под ключ» с учётом всех ваших пожеланий. Наши специалисты помогут вам выбрать материалы, фурнитуру и дополнительные функции для вашей душевой кабины. Мы гарантируем высокое качество работы и соблюдение сроков.
        </p>
      </div>

      {}
      <ConstructionTypesGrid onSelect={handleOpenConsultation} />

      {}
      {/*<InlineFormBanner
        title="Не можете определиться?"
        subtitle="Получите профессиональную консультацию от экспертов «Прозрачные решения»!"
        variant="white"
      />*/}

      {/* 4. Виды стекла */}
      <GlassTypesGrid />

      {/* 5. Выберите цвет фурнитуры */}
      <HardwareSection />

      {/* 6. Оставьте заявку на расчет */}
     {/* <InlineFormBanner
        title="Оставьте заявку на расчет душевой кабины"
        subtitle="Если вы знаете размеры — сделаем расчет по ним, либо приедем на замер к вам."
        variant="blue"
      />*/}

      {/* 7. Этапы работы */}
      {/*<ProcessSteps />*/}

      {/* 8. Качественный монтаж */}
      <QualityMontageBlock onOpenConsultation={handleOpenConsultation} />

      {/* 9. Наши работы */}
    {/*  <PortfolioGallery title="Наши работы" />*/}

      {/* 10. Вопросы-ответы */}
      <FaqAccordion />

      {/* 11. 6 причин выбрать нас */}
    {/*  <AdvantagesGrid />*/}

      {/* 12. Квиз замера */}
     {/* <QuizCalculatorBlock />*/}

      <LeadModal
        isOpen={isLeadModalOpen}
        onClose={() => setIsLeadModalOpen(false)}
        sourceTitle={modalTitle}
      />
    </MainLayout>
  );
}

ShowerCabinIndex.layout = (page: any) => page;
