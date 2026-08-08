

import React, { useState } from 'react';
import SectionLayout from '@/shared/components/layouts/SectionLayout';

export interface ShowerConstructionTab {
  id: string;
  name: string;
  image: string;
}

const TABS: ShowerConstructionTab[] = [
  { id: 'doors', name: 'Двери', image: '/images/site/constructions/shower-tab-doors.webp' },
  { id: 'cabins', name: 'Душевые кабины', image: '/images/site/constructions/shower-tab-cabins.webp' },
  { id: 'partitions', name: 'Перегородки', image: '/images/site/constructions/shower-tab-partitions.webp' },
];

export function ConstructionTypesGrid() {
  const [activeTab, setActiveTab] = useState(TABS[0].id);

  const selectedType = TABS.find((t) => t.id === activeTab) || TABS[0];

  return (
    <SectionLayout className="py-10 md:py-16">
      <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-slate-900 tracking-tight mb-2">
          Типы <span className="text-[#024f87]">конструкций</span>
        </h2>
      </div>

      <div className="flex items-center justify-center gap-2 md:gap-4 mb-8 max-w-[1240px] mx-auto">
        {TABS.map((type) => {
          const isActive = activeTab === type.id;
          return (
            <button
              key={type.id}
              onClick={() => setActiveTab(type.id)}
              className={`px-6 py-2.5 rounded-full text-xs md:text-sm font-semibold transition-all cursor-pointer ${
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
          className="w-full h-full object-contain p-2 transition-all duration-300"
        />
      </div>
    </SectionLayout>
  );
}
