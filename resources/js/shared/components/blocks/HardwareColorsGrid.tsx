

import React from 'react';
import SectionLayout from '@/shared/components/layouts/SectionLayout';
import {siteAssets} from '@/shared/config/site-assets';

export interface HardwareColorItem {
  id: string;
  name: string;
  description: string;
  image: string;
}

const HARDWARE_COLORS: HardwareColorItem[] = [
  {
    id: 'chrome',
    name: 'Полированный хром',
    description: 'Классический зеркальный хром с безупречным блеском.',
    image: siteAssets.hardware.chrome,
  },
  {
    id: 'black',
    name: 'Черный матовый',
    description: 'Современное стойкое порошковое покрытие премиум-класса.',
    image: siteAssets.hardware.black,
  },
  {
    id: 'steel',
    name: 'Матовая сталь / Шлифованный хром',
    description: 'Практичная сатинированная поверхность, не оставляющая отпечатков пальцев.',
    image: siteAssets.hardware.steelMatte,
  },
  {
    id: 'bronze',
    name: 'Бронза / Анцитная бронза',
    description: 'Благородный теплый металлический оттенок.',
    image: siteAssets.hardware.bronze,
  },
  {
    id: 'gold',
    name: 'Золото матовое / глянцевое',
    description: 'Роскошное ювелирное PVD-покрытие.',
    image: siteAssets.hardware.gold,
  },
];

export function HardwareColorsGrid() {
  return (
    <SectionLayout className="py-12 md:py-20">
      <div className="flex flex-col items-center text-center mb-12">
        <span className="text-xs font-bold text-sky-500 uppercase tracking-widest mb-2">
          Нержавеющая сталь & Латунь
        </span>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
          Палитра цветов фурнитуры
        </h2>
        <p className="mt-3 text-muted-foreground max-w-2xl text-sm md:text-base">
          Подберите фурнитуру под цвет ваших смесителей и интерьера
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 w-full">
        {HARDWARE_COLORS.map((hw) => (
          <div
            key={hw.id}
            className="flex flex-col bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300"
          >
            <div className="aspect-square bg-slate-100 p-4 flex items-center justify-center overflow-hidden">
              <img
                src={hw.image}
                alt={hw.name}
                className="w-full h-full object-contain hover:scale-105 transition-transform"
              />
            </div>
            <div className="p-4 flex flex-col flex-1">
              <h3 className="text-sm md:text-base font-bold text-foreground">
                {hw.name}
              </h3>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                {hw.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </SectionLayout>
  );
}
