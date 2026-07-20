import React from 'react';

interface Props {
  currentType: string;
  className?: string;
}

export default function CalculatorTabs({ currentType, className }: Props) {
  return (
    <div className={`tw-flex tw-justify-center ${className || ''}`}>
      <div className="tw-bg-slate-100 tw-border tw-border-slate-200/80 tw-p-1 tw-rounded-[16px] tw-flex tw-gap-1 tw-items-center tw-max-w-md tw-w-full tw-shadow-sm">
        <a
          href="/calculator/user"
          className={`tw-flex-1 tw-text-center tw-py-2.5 tw-rounded-[12px] tw-text-[14px] tw-font-bold tw-transition-all tw-outline-none ${
            currentType === 'user'
              ? "tw-bg-white tw-text-[#00B7C2] tw-shadow-sm tw-border tw-border-slate-100"
              : "tw-text-slate-500 hover:tw-text-slate-900"
          }`}
        >
          Пользовательский
        </a>
        <a
          href="/calculator/manager"
          className={`tw-flex-1 tw-text-center tw-py-2.5 tw-rounded-[12px] tw-text-[14px] tw-font-bold tw-transition-all tw-outline-none ${
            currentType === 'manager'
              ? "tw-bg-white tw-text-[#00B7C2] tw-shadow-sm tw-border tw-border-slate-100"
              : "tw-text-slate-500 hover:tw-text-slate-900"
          }`}
        >
          Менеджерский
        </a>
      </div>
    </div>
  );
}
