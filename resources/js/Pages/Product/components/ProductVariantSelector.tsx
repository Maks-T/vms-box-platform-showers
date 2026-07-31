import React from 'react';
import { ProductVariant, EavValueOption } from '@/types/catalog';
import { cn } from '@/shared/lib/utils';
import { Check } from 'lucide-react';

interface Props {
  variants: ProductVariant[];
  activeVariant: ProductVariant | null;
  onSelectVariant: (variant: ProductVariant) => void;
}

export function ProductVariantSelector({ variants, activeVariant, onSelectVariant }: Props) {
  if (!variants || variants.length <= 1) return null;

  const variantAttrsMap: Record<string, { name: string; options: { option: EavValueOption; variant: ProductVariant }[] }> = {};

  variants.forEach(v => {
    if (!v.attributes) return;

    Object.entries(v.attributes).forEach(([code, attr]) => {
      if (!attr.value) return;

      if (!variantAttrsMap[code]) {
        variantAttrsMap[code] = {
          name: attr.name || code,
          options: []
        };
      }

      const valObj = (typeof attr.value === 'object' && attr.value !== null && 'key' in attr.value)
        ? (attr.value as EavValueOption)
        : null;

      if (valObj) {
        if (!variantAttrsMap[code].options.some(item => item.option.key === valObj.key)) {
          variantAttrsMap[code].options.push({ option: valObj, variant: v });
        }
      }
    });
  });

  const attrEntries = Object.entries(variantAttrsMap);

  if (attrEntries.length > 0) {
    return (
      <div className="flex flex-col gap-5 py-4 border-y border-slate-200/80 my-6">
        {attrEntries.map(([code, { name, options }]) => {
          const activeValObj = (activeVariant?.attributes?.[code]?.value as EavValueOption | undefined);
          const activeKey = activeValObj?.key;

          return (
            <div key={code} className="flex flex-col gap-2.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {name}:
              </label>
              <div className="flex flex-wrap gap-2">
                {options.map(({ option, variant }) => {
                  const isSelected = activeKey ? activeKey === option.key : activeVariant?.id === variant.id;

                  return (
                    <button
                      key={option.key}
                      type="button"
                      onClick={() => onSelectVariant(variant)}
                      className={cn(
                        "px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all border cursor-pointer flex items-center gap-2",
                        isSelected
                          ? "bg-[#004F87] border-[#004F87] text-white shadow-sm"
                          : "bg-white border-slate-200 text-slate-700 hover:border-[#004F87] hover:text-[#004F87]"
                      )}
                    >
                      {option.meta?.hex && (
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0"
                          style={{ backgroundColor: option.meta.hex }}
                        />
                      )}
                      {isSelected && !option.meta?.hex && <Check className="w-3.5 h-3.5 stroke-[3px]" />}
                      <span>{option.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2.5 py-4 border-y border-slate-200/80 my-6">
      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
        Вариант исполнения:
      </label>
      <div className="flex flex-wrap gap-2">
        {variants.map((v) => {
          const isSelected = activeVariant?.id === v.id;
          const label = (v.name && v.name !== v.sku) ? v.name : v.sku;

          return (
            <button
              key={v.id}
              type="button"
              onClick={() => onSelectVariant(v)}
              className={cn(
                "px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all border cursor-pointer",
                isSelected
                  ? "bg-[#004F87] border-[#004F87] text-white shadow-sm"
                  : "bg-white border-slate-200 text-slate-700 hover:border-[#004F87] hover:text-[#004F87]"
              )}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}