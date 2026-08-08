

import React, { ReactNode } from 'react';
import SectionLayout from '@/shared/components/layouts/SectionLayout';
import { siteAssets } from '@/shared/config/site-assets';

interface HeroCoverProps {
  title?: ReactNode;
  description?: string;
  bgImage?: string;
}

export function HeroCover({
                            title = "Душевые кабины. Зеркала. Межкомнатные перегородки",
                            description = "Мы изготавливаем на заказ и по индивидуальным эскизам. Создайте уникальное пространство, где каждая деталь продумана до мелочей.",
                            bgImage = siteAssets.hero.showerCabin,
                          }: HeroCoverProps) {
  return (
    <SectionLayout className="py-4 md:py-8">
      <div className="relative w-full max-w-[1240px] mx-auto rounded-[20px] md:rounded-[28px] overflow-hidden text-white p-8 sm:p-12 md:p-20 text-center flex flex-col items-center justify-center shadow-lg min-h-[380px] md:min-h-[460px]">
        {}
        {bgImage && (
          <div className="absolute inset-0 z-0">
            <img
              src={bgImage}
              alt="Душевые кабины"
              className="w-full h-full object-cover object-center"
            />
            {}
            <div className="absolute inset-0 bg-[#004F87]/80 mix-blend-multiply" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#004F87]/70 via-[#004F87]/85 to-[#003559]/95" />
          </div>
        )}

        {}
        <div className="relative z-10 max-w-4xl flex flex-col items-center gap-5">
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-semibold text-white tracking-tight leading-[1.25] font-sans">
            {title}
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-white/90 max-w-2xl font-normal leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </SectionLayout>
  );
}
