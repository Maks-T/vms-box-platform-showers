import React from 'react';
import { Heart } from 'lucide-react';
import { useTranslation } from '@/shared/i18n/useTranslation';

interface FavoritesEmptyStateProps {
  onClose: () => void;
}

export const FavoritesEmptyState = ({ onClose }: FavoritesEmptyStateProps) => {
  const { t } = useTranslation();
  return (
    <div className="h-full flex flex-col items-center justify-center text-center p-6 min-h-[350px]">
      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-5 border border-white/10">
        <Heart className="w-8 h-8 text-white/20" strokeWidth={1.5} />
      </div>
      <p className="text-md font-bold uppercase tracking-wider text-white/90 mb-2">
        {t('favorites_empty_title')}
      </p>
      <p className="text-xs text-muted-foreground max-w-[240px] leading-relaxed mb-8">
        {t('favorites_empty_desc')}
      </p>
      <button
        onClick={onClose}
        className="px-6 py-3 bg-[#3D98FF] hover:bg-[#3D98FF]/90 transition-colors text-white text-xs font-bold uppercase tracking-widest rounded-xl shadow-md cursor-pointer"
      >
        {t('favorites_to_catalog')}
      </button>
    </div>
  );
};
