// resources/js/Pages/Product/components/ProductGallery.tsx

import React, { useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';

interface Props {
  mainImage: string | null;
  productName: string;
  sku?: string;
  id: number;
}

export function ProductGallery({ mainImage, productName }: Props) {
  const [selectedImage, setSelectedImage] = useState<string | null>(mainImage);

  const displayImg = selectedImage || mainImage;

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="relative w-full aspect-square bg-[#F2F7FA] rounded-2xl border border-slate-200/80 p-6 flex items-center justify-center overflow-hidden">
        {displayImg ? (
          <img
            src={displayImg}
            alt={productName}
            className="w-full h-full object-contain mix-blend-multiply transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="flex flex-col items-center text-slate-300">
            <ImageIcon className="w-16 h-16 mb-2" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Нет фото</span>
          </div>
        )}
      </div>
    </div>
  );
}