

import React from 'react';
import SectionLayout from '@/shared/components/layouts/SectionLayout';
import { siteAssets } from '@/shared/config/site-assets';
import { Plus } from 'lucide-react';

export function CustomProjectHeroBlock({ onSelectHotspot }: { onSelectHotspot?: () => void }) {
  const models = [
    { id: 1, img: siteAssets.constructions.corner, title: 'Угловая для ванны' },
    { id: 2, img: siteAssets.constructions.doorNiche, title: 'Душевая в нишу' },
    { id: 3, img: siteAssets.constructions.frameMinimal, title: 'Пятиугольная кабинка' },
    { id: 4, img: siteAssets.constructions.partitionStationary, title: 'Перегородка свободного входа' },
  ];

  return (
    <SectionLayout className="py-10 md:py-16">
      <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-12">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-slate-900 tracking-tight leading-tight mb-3">
          Душевые кабины по индивидуальным проектам
        </h2>
        <p className="text-sm sm:text-base text-slate-500 font-normal">
          Индивидуальный подход и высокое качество
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 w-full max-w-[1240px] mx-auto mb-16">
        {models.map((model) => (
          <div key={model.id} className="relative group flex flex-col items-center">
            <div className="relative w-full aspect-[3/4] bg-slate-50 rounded-2xl overflow-hidden p-4 flex items-center justify-center border border-slate-100 shadow-sm">
              <img
                src={model.img}
                alt={model.title}
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
              />
              <button
                onClick={onSelectHotspot}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#004F87] text-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                title="Подробнее"
              >
                <Plus className="w-5 h-5 stroke-[2.5px]" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="max-w-4xl mx-auto text-center px-4">
        <p className="text-sm md:text-base text-slate-600 font-normal leading-relaxed">
          Мы предлагаем изготовление душевых кабин «под ключ» с учётом всех ваших пожеланий. Ваши специалисты помогут вам выбрать материалы, фурнитуру и дополнительные функции для вашей душевой кабины. Мы гарантируем высокое качество работы и соблюдение сроков.
        </p>
      </div>
    </SectionLayout>
  );
}
