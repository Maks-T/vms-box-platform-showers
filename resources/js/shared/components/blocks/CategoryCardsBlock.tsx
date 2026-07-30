

import React from 'react';
import SectionLayout from '@/shared/components/layouts/SectionLayout';
import {siteAssets} from '@/shared/config/site-assets';
import {Button} from '@/shared/components/ui/Button';

export function CategoryCardsBlock() {
  const cards = [
    {
      id: 'shower',
      title: 'Душевые кабины',
      description: 'Душевые кабины на заказ из закаленного стекла. Подберем нужный размер, фурнитуру и дизайн.',
      image: siteAssets.hero.showerCabin,
      href: '/shower_cabin',
    },
    {
      id: 'partition',
      title: 'Межкомнатные перегородки',
      description: 'Перегородки — стильный способ зонировать пространство и визуально расширить его.',
      image: siteAssets.hero.partitions,
      href: '/peregorodki',
    },
    {
      id: 'mirror',
      title: 'Зеркала',
      description: 'Изготавливаем зеркала на заказ по индивидуальным размерам, любой формы, с подсветкой и без.',
      image: siteAssets.hero.mirrors,
      href: '/zerkala',
    },
  ];

  return (
    <SectionLayout className="py-8 md:py-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-[1240px] mx-auto">
        {cards.map((card) => (
          <div
            key={card.id}
            className="flex flex-col bg-white rounded-[20px] overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300"
          >
            <div className="aspect-[4/3] bg-slate-100 overflow-hidden">
              <img
                src={card.image}
                alt={card.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div className="p-6 md:p-8 flex flex-col flex-1 items-start">
              <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-3">
                {card.title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-6 flex-1">
                {card.description}
              </p>

              <Button
                href={card.href}
                className="h-11 px-8 rounded-[8px] bg-[#004F87] hover:bg-[#003B5C] text-white font-bold text-sm shadow-sm"
              >
                Подробнее
              </Button>
            </div>
          </div>
        ))}
      </div>
    </SectionLayout>
  );
}
