

import React from 'react';
import SectionLayout from '@/shared/components/layouts/SectionLayout';

export interface MirrorExecutionItem {
  id: string;
  name: string;
  image: string;
}

const EXECUTIONS: MirrorExecutionItem[] = [
  { id: 'simple', name: 'Обычное зеркало без всего', image: '/images/site/mirrors/exec-simple.webp' },
  { id: 'front_light', name: 'Зеркало с фронтальной подсветкой', image: '/images/site/mirrors/exec-front-light.webp' },
  { id: 'floating_light', name: 'Зеркало с парящей подсветкой', image: '/images/site/mirrors/exec-floating-light.webp' },
  { id: 'double_light', name: 'Зеркало с фронтальной и парящей подсветкой', image: '/images/site/mirrors/exec-double-light.webp' },
  { id: 'facet', name: 'Зеркало с фацетом', image: '/images/site/mirrors/exec-facet.webp' },
  { id: 'pattern', name: 'Зеркало с узором', image: '/images/site/mirrors/exec-pattern.webp' },
];

export function MirrorExecutionsGrid() {
  return (
    <SectionLayout className="py-12 md:py-20 bg-white">
      <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-10">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-slate-900 tracking-tight">
          Варианты <span className="text-[#024f87]">исполнения</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-10 max-w-[1100px] mx-auto w-full">
        {EXECUTIONS.map((item) => (
          <div key={item.id} className="flex flex-col items-center text-center group cursor-pointer">
            <div className="w-full aspect-[360/396] mb-4 relative overflow-hidden rounded-none bg-white">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>
            <div className="text-base md:text-[18px] font-semibold text-slate-900 group-hover:text-[#024f87] transition-colors font-sans">
              {item.name}
            </div>
          </div>
        ))}
      </div>
    </SectionLayout>
  );
}
