

import React from 'react';
import SectionLayout from '@/shared/components/layouts/SectionLayout';
import { siteAssets } from '@/shared/config/site-assets';

export function HardwareSection() {
  return (
    <SectionLayout className="py-12 md:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center max-w-[1240px] mx-auto w-full">
        {}
        <div className="lg:col-span-5 flex flex-col items-start gap-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-slate-900 tracking-tight leading-tight">
            Выберите цвет фурнитуры <br />
            <span className="text-[#024f87]">на ваш вкус</span>
          </h2>

          <p className="text-sm md:text-base text-slate-600 font-normal leading-relaxed">
            Мы предлагаем следующую палитру:
          </p>

          <ul className="list-disc pl-5 text-sm md:text-base text-slate-700 font-medium space-y-1">
            <li>полированный хром,</li>
            <li>черный,</li>
            <li>матовый хром,</li>
            <li>бронза,</li>
            <li>золото.</li>
          </ul>

          <p className="text-xs md:text-sm text-slate-500 font-normal mt-2 leading-relaxed">
            Вы легко подберете фурнитуру, соответствующую общему интерьеру помещения.
          </p>
        </div>

        {}
        <div className="lg:col-span-7 flex justify-center">
          <div className="w-full max-w-xl aspect-[16/10] overflow-hidden flex items-center justify-center rounded-none">
            <img
              src={siteAssets.hardware.hingesAnimation}
              alt="Фурнитура для душевых кабин"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>
    </SectionLayout>
  );
}
