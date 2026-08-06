

import React, { useState } from 'react';
import SectionLayout from '@/shared/components/layouts/SectionLayout';

export interface PartitionOpeningType {
  id: string;
  name: string;
  image: string;
}

const OPENING_TYPES: PartitionOpeningType[] = [
  { id: 'static', name: 'Статичная', image: '/images/site/constructions/partition-static.webp' },
  { id: 'folding', name: 'Складная', image: '/images/site/constructions/partition-folding.webp' },
  { id: 'sliding', name: 'Раздвижная', image: '/images/site/constructions/partition-sliding.webp' },
  { id: 'hinged', name: 'Створчатая', image: '/images/site/constructions/partition-hinged.webp' },
  { id: 'recessed', name: 'Откатная', image: '/images/site/constructions/partition-recessed.webp' },
  { id: 'office', name: 'Офисная', image: '/images/site/constructions/partition-office.webp' },
];

export function PartitionOpeningTypesBlock() {
  const [activeTab, setActiveTab] = useState(OPENING_TYPES[0].id);

  const selectedType = OPENING_TYPES.find((t) => t.id === activeTab) || OPENING_TYPES[0];

  return (
    <SectionLayout className="py-10 md:py-16">
      <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-slate-900 tracking-tight mb-2">
          Виды <span className="text-[#024f87]">открытия перегородок</span>
        </h2>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 mb-8 max-w-[1240px] mx-auto">
        {OPENING_TYPES.map((type) => {
          const isActive = activeTab === type.id;
          return (
            <button
              key={type.id}
              onClick={() => setActiveTab(type.id)}
              className={`px-5 py-2.5 rounded-full text-xs md:text-sm font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#024f87] text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {type.name}
            </button>
          );
        })}
      </div>

      {}
      <div className="max-w-[1000px] mx-auto w-full aspect-[16/9] md:aspect-[21/9] bg-white overflow-hidden rounded-2xl shadow-sm relative">
        <img
          src={selectedType.image}
          alt={selectedType.name}
          className="w-full h-full object-cover transition-all duration-300"
        />
      </div>
    </SectionLayout>
  );
}
