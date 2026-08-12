import React from 'react';
import { Heart } from 'lucide-react';

interface FavoritesEmptyStateProps {
  onClose: () => void;
}

export const FavoritesEmptyState = ({ onClose }: FavoritesEmptyStateProps) => {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center p-6 min-h-[320px]">
      <div className="w-12 h-12 rounded-lg bg-[#F2F7FA] flex items-center justify-center mb-4 border border-slate-200 text-[#004F87]">
        <Heart className="w-6 h-6" strokeWidth={1.5} />
      </div>
      <p className="text-sm font-bold tracking-tight text-slate-900 mb-1.5">
        Здесь пока пусто
      </p>
      <p className="text-xs text-slate-500 max-w-[220px] leading-relaxed mb-6">
        Добавляйте понравившиеся материалы в избранное, чтобы быстро вернуться к ним позже.
      </p>
      <button
        onClick={onClose}
        className="px-5 py-2 bg-[#004F87] hover:bg-[#003559] transition-colors text-white text-xs font-bold uppercase tracking-wider rounded-md cursor-pointer"
      >
        В каталог
      </button>
    </div>
  );
};