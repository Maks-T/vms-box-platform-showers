import React, {useEffect, useState} from 'react';
import {useFavorites} from '@/store/useFavorites';
import {bootstrapApi} from '@/shared/api/bootstrap.api';
import {BootstrapConfig} from '@/types/catalog';
import {Sheet, SheetContent} from '@/shared/ui/sheet';
import {FavoritesHeader} from './FavoritesHeader';
import {FavoritesEmptyState} from './FavoritesEmptyState';
import {FavoriteItemRow} from './FavoriteItemRow';

export const FavoritesDrawer = () => {
  const {isOpen, setIsOpen, items, removeItem, clearFavorites} = useFavorites();
  const [bootstrapConfig, setBootstrapConfig] = useState<BootstrapConfig | null>(null);

  useEffect(() => {
    if (isOpen) {
      bootstrapApi.getConfig().then(setBootstrapConfig);
    }
  }, [isOpen]);

  const currencySymbol = bootstrapConfig?.base_currency?.symbol_native || bootstrapConfig?.base_currency?.symbol || 'руб.';

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-[420px] p-0 flex flex-col gap-0 border-l border-slate-200 bg-white text-slate-900 shadow-none"
      >
        <FavoritesHeader count={items.length} onClear={clearFavorites}/>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-5 bg-slate-50/30">
          {items.length === 0 ? (
            <FavoritesEmptyState onClose={() => setIsOpen(false)}/>
          ) : (
            <div className="flex flex-col gap-3">
              {items.map((item) => (
                <FavoriteItemRow
                  key={item.id}
                  item={item}
                  onRemove={removeItem}
                  onNavigate={() => setIsOpen(false)}
                  currencySymbol={currencySymbol}
                />
              ))}
            </div>
          )}
        </div>

        <div
          className="p-3.5 border-t border-slate-200 bg-[#F2F7FA] shrink-0 text-center text-slate-500 text-[11px] font-medium">
          Прозрачные решения • Избранное
        </div>
      </SheetContent>
    </Sheet>
  );
};