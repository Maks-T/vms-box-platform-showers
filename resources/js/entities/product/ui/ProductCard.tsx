

import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { Image as ImageIcon } from 'lucide-react';
import { StoneProduct, EavValueOption, BootstrapConfig, ProductVariant } from '@/types/catalog';
import { route } from "ziggy-js";
import { cn } from '@/shared/lib/utils';
import { FavoriteButton } from '@/shared/components/ui/FavoriteButton';

interface ProductCardProps {
  product: StoneProduct;
  bootstrapConfig?: BootstrapConfig | null;
}

export const ProductCard = ({ product, bootstrapConfig }: ProductCardProps) => {
  const { id, name, slug, price_from, preview_picture, unit, attributes, variants } = product;

  const [activeVariant, setActiveVariant] = useState<ProductVariant | null>(null);

  const defaultPriceType = bootstrapConfig?.price_types?.find((pt: any) => pt.is_default)?.slug || 'retail';

  const displayImage = activeVariant?.preview_picture || preview_picture;

  const displayPrice = activeVariant
    ? (activeVariant.prices?.[defaultPriceType] || Object.values(activeVariant.prices || {})[0] || price_from)
    : price_from;

  const currencySymbol = bootstrapConfig?.base_currency?.symbol_native || bootstrapConfig?.base_currency?.symbol || 'руб.';

  const formattedNumber = displayPrice > 0
    ? new Intl.NumberFormat('ru-RU', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(displayPrice)
    : '';

  const collection = attributes?.collection?.value as EavValueOption | undefined;
  const brand = attributes?.brand?.value as EavValueOption | undefined;

  let subtitle = unit ? `Ед. изм: ${unit.name}` : 'Ед. изм: Штука';
  if (brand) subtitle = `Бренд: ${brand.label}`;
  else if (collection) subtitle = `Коллекция: ${collection.label}`;

  const parentColor = attributes?.color?.value as EavValueOption | undefined;
  const variantColors: EavValueOption[] = [];

  if (variants?.length > 0) {
    const seen = new Set();
    variants.forEach(v => {
      const vColor = v.attributes?.color?.value as EavValueOption | undefined;
      if (vColor && !seen.has(vColor.key)) {
        seen.add(vColor.key);
        variantColors.push(vColor);
      }
    });
  }

  const colorsToShow = variantColors.length > 0 ? variantColors : (parentColor ? [parentColor] : []);

  const activeColorSlug = activeVariant
    ? (activeVariant.attributes?.color?.value as EavValueOption | undefined)?.key
    : (variants?.find(v => v.is_default)?.attributes?.color?.value as EavValueOption | undefined)?.key;

  const handleColorClick = (e: React.MouseEvent, color: EavValueOption) => {
    e.preventDefault();
    e.stopPropagation();

    const match = variants?.find(v => {
      const vColor = v.attributes?.color?.value as EavValueOption | undefined;
      return vColor?.key === color.key;
    });

    if (match) {
      setActiveVariant(match);
    }
  };

  const renderSwatch = (color: EavValueOption) => {
    const isSelected = color.key === activeColorSlug;

    const swatchClasses = cn(
      "w-5 h-5 rounded-full object-cover border border-slate-200/80 shadow-sm cursor-pointer transition-all duration-200",
      isSelected
        ? "ring-2 ring-[#004F87] ring-offset-1 scale-105 opacity-100"
        : "opacity-70 hover:opacity-100 hover:scale-105"
    );

    if (color.meta?.image) {
      return (
        <img
          key={color.key}
          src={color.meta.image}
          title={color.label}
          alt={color.label}
          onClick={(e) => handleColorClick(e, color)}
          className={swatchClasses}
        />
      );
    }
    if (color.meta?.hex) {
      return (
        <div
          key={color.key}
          title={color.label}
          onClick={(e) => handleColorClick(e, color)}
          className={swatchClasses}
          style={{ backgroundColor: color.meta.hex }}
        />
      );
    }
    return null;
  };

  return (
    <div className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-slate-200/80 hover:shadow-xl transition-all duration-300">

      {}
      <div className="relative aspect-[4/3] bg-slate-50 overflow-hidden border-b border-slate-100 p-4 flex items-center justify-center">
        <Link href={route('product.show', slug)} className="block w-full h-full">
          {displayImage ? (
            <img
              src={displayImage}
              alt={name}
              className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-slate-300">
              <ImageIcon className="w-12 h-12" />
            </div>
          )}
        </Link>

        {}
        <div className="absolute top-3 left-3 bg-[#004F87] text-white text-[11px] font-bold px-2.5 py-1 rounded-[6px] uppercase tracking-wider shadow-sm">
          ID {id}
        </div>

        <FavoriteButton product={product} className="absolute top-3 right-3" />
      </div>

      {}
      <div className="flex flex-col flex-1 p-5 md:p-6">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 line-clamp-1">
          {subtitle}
        </p>

        <Link href={route('product.show', slug)} className="block mb-4 flex-1">
          <h3 className="text-base md:text-lg font-semibold text-slate-900 leading-snug tracking-tight group-hover:text-[#004F87] transition-colors line-clamp-2">
            {name}
          </h3>
        </Link>

        {colorsToShow.length > 0 && (
          <div className="flex items-center gap-1.5 mb-4 mt-auto flex-wrap">
            {colorsToShow.length === 1 ? (
              <div className="flex items-center gap-2">
                {renderSwatch(colorsToShow[0])}
                <span className="text-xs text-slate-500 truncate">{colorsToShow[0].label}</span>
              </div>
            ) : (
              <>
                {colorsToShow.slice(0, 6).map(c => renderSwatch(c))}
                {colorsToShow.length > 6 && (
                  <span className="text-[11px] font-medium text-slate-400 ml-1">+{colorsToShow.length - 6}</span>
                )}
              </>
            )}
          </div>
        )}

        {}
        <div className="mt-auto flex flex-col gap-4 pt-2">
          <div className="text-2xl font-bold text-slate-900 flex items-baseline gap-1 min-h-[32px]">
            {displayPrice > 0 ? (
              <>
                <span>{formattedNumber}</span>
                <span className="text-sm font-normal text-slate-500 lowercase">
                  {currencySymbol}
                </span>
              </>
            ) : (
              <span className="text-sm font-medium text-slate-400">
                По запросу
              </span>
            )}
          </div>

          <Link
            href={route('product.show', slug)}
            className="w-full h-11 bg-[#004F87] hover:bg-[#003559] text-white text-xs font-bold tracking-widest uppercase transition-all duration-200 flex items-center justify-center rounded-xl shadow-sm active:scale-[0.98]"
          >
            Подробнее
          </Link>
        </div>
      </div>
    </div>
  );
};
