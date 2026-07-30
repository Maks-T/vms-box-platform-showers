

import React from 'react';
import SectionLayout from '@/shared/components/layouts/SectionLayout';

export function WhyPartitionsBlock() {
  return (
    <SectionLayout className="py-12 md:py-20 bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16 items-center max-w-[1240px] mx-auto w-full">
        {}
        <div className="lg:col-span-6 flex flex-col items-start text-left">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-slate-900 tracking-tight mb-4">
            Зачем нужны <span className="text-[#024f87]">перегородки</span>
          </h2>

          <div className="w-10 h-[2px] bg-slate-900 mb-6" />

          <p className="text-sm md:text-base text-slate-600 font-normal leading-relaxed mb-6">
            С помощью раздвижной перегородки для зонирования пространства удается разделить комнату по секциям. Это актуально для новостроек со свободной планировкой. Если вы планируете разделить комнату и сделать для каждого члена семьи свой «угол», мы рекомендуем использовать матовое стекло, которое наполовину пропускает свет.
          </p>

          <p className="text-sm md:text-base text-slate-600 font-normal leading-relaxed">
            Раздвижные перегородки в студиях также применяются для разделения пространства. Например, вы можете заказать установку раздвижной перегородки между кухней и отделить зону для приготовления пищи от спальной и жилой секции.
          </p>
        </div>

        {}
        <div className="lg:col-span-6 flex justify-center">
          <div className="w-full aspect-square max-w-[560px] overflow-hidden rounded-none">
            <img
              src="/images/site/constructions/noroot.webp"
              alt="Зачем нужны перегородки"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </SectionLayout>
  );
}
