import React, {useState} from 'react';
import SectionLayout from '@/shared/components/layouts/SectionLayout';
import {siteAssets} from '@/shared/config/site-assets';
import {Modal} from '@/shared/components/ui/Modal';

interface Props {
  title?: string;
  images?: readonly string[];
}

export function PortfolioGallery({
                                   title = "Наши работы",
                                   images = siteAssets.portfolio,
                                 }: Props) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <SectionLayout className="py-12 md:py-20">
      <div className="flex flex-col items-center text-center mb-12">
        <span className="text-xs font-bold text-sky-500 uppercase tracking-widest mb-2">
          Реализованные объекты
        </span>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
          {title}
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
        {images.map((img, idx) => (
          <div
            key={idx}
            onClick={() => setSelectedImage(img)}
            className="group relative aspect-square rounded-2xl overflow-hidden bg-slate-100 cursor-pointer border border-border shadow-sm hover:shadow-lg transition-all"
          >
            <img
              src={img}
              alt={`Работа ${idx + 1}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div
              className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold uppercase tracking-wider">
              Увеличить
            </div>
          </div>
        ))}
      </div>

      {}
      <Modal
        isOpen={Boolean(selectedImage)}
        onClose={() => setSelectedImage(null)}
        maxWidth="3xl"
        className="!p-2 bg-black border-white/20"
      >
        {selectedImage && (
          <div
            className="relative aspect-auto max-h-[80vh] overflow-hidden rounded-xl flex items-center justify-center">
            <img
              src={selectedImage}
              alt="Просмотр работы"
              className="max-h-[80vh] w-auto object-contain rounded-xl"
            />
          </div>
        )}
      </Modal>
    </SectionLayout>
  );
}
