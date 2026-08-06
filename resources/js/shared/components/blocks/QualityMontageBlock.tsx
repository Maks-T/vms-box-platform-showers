

import React from 'react';
import SectionLayout from '@/shared/components/layouts/SectionLayout';
import { Button } from '@/shared/components/ui/Button';
import { siteAssets } from '@/shared/config/site-assets';

export function QualityMontageBlock({ onOpenConsultation }: { onOpenConsultation: () => void }) {
  return (
    <SectionLayout className="py-12 md:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center max-w-[1240px] mx-auto w-full">
        {}
        <div className="lg:col-span-6 flex flex-col items-start gap-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-slate-900 tracking-tight leading-tight">
            Качественный монтаж <br />
            <span className="text-slate-500 font-normal">— гарантия безупречной службы</span>
          </h2>

          <p className="text-sm md:text-base text-slate-600 font-normal leading-relaxed">
            Монтаж душевого ограждения выполняют мастера, прошедшие специальную подготовку и имеющие большой опыт в данной области.
          </p>

          <Button
            onClick={onOpenConsultation}
            className="mt-4 px-8 py-3 bg-[#024f87] text-white hover:bg-white hover:text-[#024f87] font-semibold text-sm rounded-[10px] border-2 border-[#024f87] shadow-sm transition-all cursor-pointer"
          >
            Получить консультацию
          </Button>
        </div>

        {}
        <div className="lg:col-span-6">
          <div className="w-full aspect-[16/10] overflow-hidden rounded-none">
            <img
              src={siteAssets.portfolio.showers[11] || '/images/site/portfolio/showers/shower-12.webp'}
              alt="Качественный монтаж душевых кабин"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </SectionLayout>
  );
}
