import React from 'react';
import SectionLayout from '@/shared/components/layouts/SectionLayout';
import {siteAssets} from '@/shared/config/site-assets';

export interface AdvantageItem {
  id: string;
  title: string;
  description: string;
  icon: string;
}

const ADVANTAGES: AdvantageItem[] = [
  {
    id: 'guarantee',
    title: 'Надежно',
    description: 'Гарантия на любое изделие 3 года, 1 год — на монтажные работы.',
    icon: siteAssets.advantages.guarantee,
  },
  {
    id: 'fast',
    title: 'Быстро',
    description: 'Точный срок изготовления до 15 рабочих дней.',
    icon: siteAssets.advantages.fastTerm,
  },
  {
    id: 'montage',
    title: 'Качественный монтаж',
    description: 'Бережная доставка собственным автотранспортом и аккуратная сборка.',
    icon: siteAssets.advantages.qualityMontage,
  },
  {
    id: 'individual',
    title: 'Индивидуальный подход',
    description: 'Учитывая особенности вашей планировки, реализуем любые дизайнерские задумки.',
    icon: siteAssets.advantages.individualApproach,
  },
  {
    id: 'discount',
    title: 'Гибкая система акций',
    description: 'Гарантированные приятные бонусы и подарки каждому клиенту.',
    icon: siteAssets.advantages.discountSystem,
  },
  {
    id: 'glass',
    title: 'Качество стекла',
    description: 'Только проверенные изготовители закаленного стекла высшего класса.',
    icon: siteAssets.advantages.glassQuality,
  },
];

export function AdvantagesGrid() {
  return (
    <SectionLayout className="py-12 md:py-20">
      <div className="flex flex-col items-center text-center mb-12">
        <span className="text-xs font-bold text-sky-500 uppercase tracking-widest mb-2">
          Почему именно мы
        </span>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
          6 причин выбрать нас
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {ADVANTAGES.map((adv) => (
          <div
            key={adv.id}
            className="flex items-start gap-4 p-6 bg-card border border-border rounded-2xl hover:border-primary/40 hover:shadow-md transition-all"
          >
            <div
              className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center shrink-0 p-2.5">
              <img src={adv.icon} alt={adv.title} className="w-full h-full object-contain"/>
            </div>

            <div className="flex flex-col">
              <h3 className="text-base font-bold text-foreground mb-1">
                {adv.title}
              </h3>
              <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                {adv.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </SectionLayout>
  );
}
