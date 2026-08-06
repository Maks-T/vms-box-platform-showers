

import React from 'react';
import SectionLayout from '@/shared/components/layouts/SectionLayout';

export interface MirrorTypeItem {
  id: string;
  name: string;
  image: string;
}

const MIRROR_TYPES: MirrorTypeItem[] = [
  {id: 'regular', name: 'Обычное', image: '/images/site/mirrors/mirror-regular.webp'},
  {id: 'optiwhite', name: 'Осветленное', image: '/images/site/mirrors/mirror-optiwhite.webp'},
  {id: 'graphite', name: 'Графит', image: '/images/site/mirrors/mirror-graphite.webp'},
  {id: 'bronze', name: 'Бронза', image: '/images/site/mirrors/mirror-bronze.webp'},
  {id: 'gold', name: 'Золото', image: '/images/site/mirrors/mirror-gold.webp'},
  {id: 'aged', name: 'Состаренное', image: '/images/site/mirrors/mirror-aged.webp'},
];

export function MirrorTypesGrid() {
  return (
    <SectionLayout className="py-12 md:py-20 bg-[#F2F7FA]">
      {}
      <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-10 md:mb-14">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-slate-900 tracking-tight">
          Виды <span className="text-[#024f87]">зеркал</span>
        </h2>
      </div>

      {}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-10 max-w-[1100px] mx-auto w-full">
        {MIRROR_TYPES.map((mirror) => (
          <div
            key={mirror.id}
            className="flex flex-col items-center text-center group cursor-pointer"
          >
            {}
            <div className="w-full aspect-[432/475] mb-4 relative overflow-hidden rounded-none bg-white">
              <img
                src={mirror.image}
                alt={mirror.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>

            {}
            <div
              className="text-base md:text-[18px] font-semibold text-slate-900 group-hover:text-[#024f87] transition-colors font-sans">
              {mirror.name}
            </div>
          </div>
        ))}
      </div>
    </SectionLayout>
  );
}
