import React from 'react';
import {Trash2, Image as ImageIcon} from 'lucide-react';
import {Link} from '@inertiajs/react';
import {route} from 'ziggy-js';
import {StoneProduct} from '@/types/catalog';

interface FavoriteItemRowProps {
  item: StoneProduct;
  onRemove: (id: number) => void;
  onNavigate: () => void;
  currencySymbol: string;
}

export const FavoriteItemRow = ({item, onRemove, onNavigate, currencySymbol}: FavoriteItemRowProps) => {
  const formatPrice = (price: number) => {
    if (price <= 0) return '';
    return new Intl.NumberFormat('ru-RU', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(price);
  };

  return (
    <div
      className="flex gap-3.5 p-3.5 rounded-lg bg-white border border-slate-200 hover:border-[#004F87] transition-colors group">
      <div
        className="w-[72px] h-[72px] bg-slate-50 rounded-md shrink-0 overflow-hidden p-1 flex items-center justify-center border border-slate-100 relative">
        {item.preview_picture ? (
          <img
            src={item.preview_picture}
            alt={item.name}
            className="w-full h-full object-contain"
          />
        ) : (
          <ImageIcon className="w-6 h-6 text-slate-300"/>
        )}
        <div
          className="absolute top-1 left-1 bg-[#004F87] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wider">
          ID {item.id}
        </div>
      </div>

      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <Link
          href={route('product.show', item.slug)}
          onClick={onNavigate}
          className="font-semibold text-xs md:text-sm leading-snug text-slate-900 group-hover:text-[#004F87] transition-colors line-clamp-2 cursor-pointer"
        >
          {item.name}
        </Link>

        <div className="pt-2 flex items-center justify-between">
          <div className="font-bold text-slate-900 text-sm md:text-base flex items-baseline gap-1">
            {item.price_from > 0 ? (
              <>
                <span>{formatPrice(item.price_from)}</span>
                <span className="text-[11px] font-normal text-slate-500 lowercase">
                  {currencySymbol}
                </span>
              </>
            ) : (
              <span className="text-[11px] font-normal text-slate-400">
                По запросу
              </span>
            )}
          </div>

          <button
            onClick={() => onRemove(item.id)}
            className="text-slate-400 hover:text-red-500 transition-colors p-1 cursor-pointer rounded hover:bg-slate-100"
            title="Удалить"
          >
            <Trash2 size={15}/>
          </button>
        </div>
      </div>
    </div>
  );
};