import React from 'react';
import {cn} from '@/shared/lib/utils';
import {CatalogPills} from '@/features/catalog/components/CatalogPills';

interface Props {
  familiesList: any[];
  activeFamily: string;
  setFamily: (family: string) => void;
  typesSchema: { code: string; name: string }[];
  productType: string;
  setProductType: (type: string) => void;
}

export function CatalogNavigationBlock({
                                         familiesList, activeFamily, setFamily, typesSchema, productType, setProductType
                                       }: Props) {
  return (
    <div className="flex flex-col w-full mb-8 relative z-10 pt-4">
      {familiesList.length > 1 && (
        <CatalogPills
          families={familiesList}
          activeFamily={activeFamily}
          onChange={setFamily}
        />
      )}

      {typesSchema.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mt-2 pt-4 border-t border-slate-200/60">
          <button
            onClick={() => setProductType('')}
            className={cn(
              "px-5 py-2 rounded-full text-[13px] font-medium transition-colors border cursor-pointer",
              productType === ''
                ? "bg-[#004F87] border-[#004F87] text-white shadow-sm font-semibold"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            )}
          >
            Все типы
          </button>
          {typesSchema.map((t) => (
            <button
              key={t.code}
              onClick={() => setProductType(t.code)}
              className={cn(
                "px-5 py-2 rounded-full text-[13px] font-medium transition-colors border cursor-pointer",
                productType === t.code
                  ? "bg-[#004F87] border-[#004F87] text-white shadow-sm font-semibold"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              )}
            >
              {t.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}