

import React from 'react';
import { cn } from '@/shared/lib/utils';
import { ProductFamily } from '@/types/catalog';

interface Props {
  families: ProductFamily[];
  activeFamily: string;
  onChange: (code: string) => void;
}

export const CatalogPills = ({ families, activeFamily, onChange }: Props) => {
  const basePill = "group flex items-center gap-3 h-[46px] rounded-full transition-all duration-200 shrink-0 cursor-pointer pl-2 pr-6 border";

  const activeClass = "bg-[#004F87] border-[#004F87] text-white shadow-md";
  const inactiveClass = "bg-white border-slate-200 text-slate-700 hover:border-[#004F87] hover:text-[#004F87] shadow-sm";

  return (
    <div className="mb-4">
      <div className="flex flex-nowrap md:flex-wrap items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {families.map((family) => {
          const isActive = activeFamily === family.code;

          return (
            <button
              key={family.code}
              onClick={() => onChange(family.code)}
              className={cn(basePill, isActive ? activeClass : inactiveClass)}
            >
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-colors",
                isActive
                  ? "bg-white text-[#004F87]"
                  : "bg-slate-100 text-slate-600 group-hover:bg-[#004F87]/10 group-hover:text-[#004F87]"
              )}>
                {family.name.charAt(0)}
              </div>
              <span className="text-xs md:text-sm font-bold uppercase tracking-wider whitespace-nowrap">
                {family.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
