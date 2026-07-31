import React from 'react';
import {Heart} from 'lucide-react';
import {SheetHeader, SheetTitle, SheetDescription} from '@/shared/ui/sheet';

interface FavoritesHeaderProps {
  count: number;
  onClear: () => void;
}

export const FavoritesHeader = ({count, onClear}: FavoritesHeaderProps) => {
  return (
    <SheetHeader
      className="p-5 border-b border-slate-200 bg-[#F2F7FA] flex flex-row items-center justify-between shrink-0">
      <div className="flex items-center gap-2.5">
        <div
          className="w-8 h-8 rounded-md bg-white border border-slate-200 flex items-center justify-center text-[#004F87]">
          <Heart className="w-4 h-4 fill-[#004F87]"/>
        </div>
        <SheetTitle className="text-base font-bold tracking-tight text-slate-900 m-0">
          Избранное <span className="text-slate-400 text-xs font-normal">({count})</span>
        </SheetTitle>
      </div>
      {count > 0 && (
        <button
          onClick={onClear}
          className="text-xs font-semibold text-slate-500 hover:text-red-500 transition-colors uppercase tracking-wider cursor-pointer mr-6"
        >
          Очистить
        </button>
      )}
      <SheetDescription className="sr-only">
        Выбранные материалы и товары
      </SheetDescription>
    </SheetHeader>
  );
};