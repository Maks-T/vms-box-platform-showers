

import React from 'react';
import SectionLayout from '@/shared/components/layouts/SectionLayout';

export interface GlassTypeItem {
  id: string;
  name: string;
  image: string;
}

const GLASS_TYPES: GlassTypeItem[] = [
  { id: 'regular', name: 'Обычное', image: '/images/site/glass/glass-regular.webp' },
  { id: 'optiwhite', name: 'Осветленное', image: '/images/site/glass/glass-optiwhite.webp' },
  { id: 'bronze', name: 'Бронзовое', image: '/images/site/glass/glass-bronze.webp' },
  { id: 'graphite', name: 'Графит', image: '/images/site/glass/glass-graphite.webp' },
  { id: 'frosted_regular', name: 'Матовое обычное', image: '/images/site/glass/glass-frosted-regular.webp' },
  { id: 'frosted_optiwhite', name: 'Матовое осветленное', image: '/images/site/glass/glass-frosted-optiwhite.webp' },
  { id: 'frosted_bronze', name: 'Матовая бронза', image: '/images/site/glass/glass-frosted-bronze.webp' },
  { id: 'frosted_graphite', name: 'Матовое графит', image: '/images/site/glass/glass-frosted-graphite.webp' },
];

export function GlassTypesGrid() {
  return (
    <SectionLayout className="py-12 md:py-20 bg-white">
      <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-10 md:mb-14">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-slate-900 tracking-tight mb-4">
          Виды <span className="text-[#024f87]">стекла</span>
        </h2>

        <div className="text-sm md:text-base text-slate-600 font-normal leading-relaxed space-y-1">
          <p>Все стекло закаленное и безопасное, толщиной 8 мм. Выдерживает удары и высокие температуры.</p>
          <p>Может быть прозрачным, матовым или цветным.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-6 md:gap-x-8 max-w-[1200px] mx-auto w-full">
        {GLASS_TYPES.map((glass) => (
          <div
            key={glass.id}
            className="flex flex-col items-center text-center group cursor-pointer"
          >
            <div className="w-full aspect-[312/343] flex items-center justify-center mb-3 relative overflow-hidden rounded-none">
              <img
                src={glass.image}
                alt={glass.name}
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>

            <div className="text-base md:text-[18px] font-semibold text-slate-900 group-hover:text-[#024f87] transition-colors font-sans">
              {glass.name}
            </div>
          </div>
        ))}
      </div>
    </SectionLayout>
  );
}
