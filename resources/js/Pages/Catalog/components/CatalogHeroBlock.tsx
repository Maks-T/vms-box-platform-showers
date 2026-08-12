

import React from 'react';
import SectionLayout from '@/shared/components/layouts/SectionLayout';

export function CatalogHeroBlock() {
  return (
    <SectionLayout className="py-4 md:py-8">
      <div className="w-full max-w-[1240px] mx-auto rounded-[20px] md:rounded-[28px] bg-gradient-to-br from-[#0c4974] via-[#004F87] to-[#00385e] text-white p-8 md:p-12 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col gap-2 max-w-xl">
          <span className="text-xs font-bold text-sky-300 uppercase tracking-widest">
            Каталог продукции
          </span>
          <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
            Каталог материалов и фурнитуры
          </h1>
        </div>

        <p className="text-sm md:text-base text-white/80 max-w-md font-normal leading-relaxed">
          Широкий выбор стекол, профилей, ручек и комплектующих. Удобная фильтрация по типам, цветам и характеристикам.
        </p>
      </div>
    </SectionLayout>
  );
}
