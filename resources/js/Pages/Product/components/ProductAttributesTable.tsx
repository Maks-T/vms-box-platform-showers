import React from 'react';
import {EavAttribute, EavValueOption} from '@/types/catalog';

interface Props {
  attributes: Record<string, EavAttribute>;
}

export function ProductAttributesTable({attributes}: Props) {
  if (!attributes || Object.keys(attributes).length === 0) {
    return <p className="text-sm text-slate-400 italic">Характеристики не указаны</p>;
  }

  const renderValue = (attr: EavAttribute) => {
    const val = attr.value;

    if (val === null || val === undefined || val === '') return '—';

    if (typeof val === 'boolean') return val ? 'Да' : 'Нет';

    if (typeof val === 'object' && val !== null && 'label' in val) {
      const opt = val as EavValueOption;
      return (
        <div className="flex items-center gap-2 justify-end">
          {opt.meta?.hex && (
            <div className="w-3.5 h-3.5 rounded-full border border-slate-300" style={{backgroundColor: opt.meta.hex}}/>
          )}
          <span>{opt.label}</span>
        </div>
      );
    }

    if (Array.isArray(val)) {
      return val.map(v => (typeof v === 'object' && v !== null && 'label' in v ? v.label : String(v))).join(', ');
    }

    return String(val);
  };

  return (
    <div className="w-full flex flex-col border border-slate-200/80 rounded-2xl overflow-hidden bg-white">
      {Object.entries(attributes).map(([code, attr], idx) => {
        if (attr.value === null || attr.value === undefined || attr.value === '') return null;

        return (
          <div
            key={code}
            className={`flex justify-between items-center px-5 py-3.5 text-xs md:text-sm ${
              idx % 2 === 0 ? 'bg-[#F2F7FA]/50' : 'bg-white'
            }`}
          >
            <span className="font-medium text-slate-500">{attr.name}</span>
            <span className="font-semibold text-slate-900 text-right">{renderValue(attr)}</span>
          </div>
        );
      })}
    </div>
  );
}