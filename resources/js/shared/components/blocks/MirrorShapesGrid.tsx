

import React from 'react';
import SectionLayout from '@/shared/components/layouts/SectionLayout';

export interface MirrorShapeItem {
  id: string;
  name: string;
  image: string;
}

const SHAPES: MirrorShapeItem[] = [
  { id: 'rect', name: 'Прямоугольное', image: '/images/site/mirrors/shape-rectangle.webp' },
  { id: 'round', name: 'Круглое', image: '/images/site/mirrors/shape-round.webp' },
  { id: 'curved', name: 'Криволинейное', image: '/images/site/mirrors/shape-curved.webp' },
];

export function MirrorShapesGrid() {
  return (
    <SectionLayout className="py-12 md:py-20 bg-[#F2F7FA]">
      <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-10">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-slate-900 tracking-tight">
          Форма <span className="text-[#024f87]">зеркала</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-10 max-w-[1100px] mx-auto w-full">
        {SHAPES.map((shape) => (
          <div key={shape.id} className="flex flex-col items-center text-center group cursor-pointer">
            <div className="w-full aspect-[360/396] mb-4 relative overflow-hidden rounded-none bg-white">
              <img
                src={shape.image}
                alt={shape.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>
            <div className="text-base md:text-[18px] font-semibold text-slate-900 group-hover:text-[#024f87] transition-colors font-sans">
              {shape.name}
            </div>
          </div>
        ))}
      </div>
    </SectionLayout>
  );
}
