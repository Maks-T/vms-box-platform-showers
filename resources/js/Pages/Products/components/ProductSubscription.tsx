import React from 'react';
import SectionLayout from '@/shared/components/layouts/SectionLayout';
import StatusBadge from '@/shared/components/ui/StatusBadge';
import { H2 } from '@/shared/components/ui/Typography';
import { Button } from '@/shared/components/ui/Button';

interface SubscriptionCard {
  icon: any;
  title: string;
  description: string;
}

interface Props {
  sectionData: {
    badgeText?: string;
    title: { start: string; accent?: string };
    items: SubscriptionCard[];
    buttonText?: string;
  };
  onActionClick?: () => void;
}

export const ProductSubscription: React.FC<Props> = ({ sectionData, onActionClick }) => {
  const { badgeText, title, items, buttonText } = sectionData;

  return (
    <SectionLayout bg="bg-[#16191B]">
      <div className="flex flex-col gap-10 lg:gap-12 w-full">
        <div className="flex flex-col gap-5">
          {badgeText && (
            <StatusBadge variant="blue" className="w-fit">
              {badgeText}
            </StatusBadge>
          )}

          <H2 className="text-white font-medium text-[28px] md:text-[36px] max-w-[850px] leading-tight">
            <span>{title.start}</span>
            <span className="text-[#3D98FF]">{title.accent}</span>
          </H2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
          {items.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div key={idx} className="p-6 md:p-8 rounded-[20px] bg-white/[0.04] border border-white/10 flex flex-col gap-5 transition-all hover:border-white/20">
                <div className="w-11 h-11 rounded-[10px] bg-primary/10 border border-primary/20 shadow-sm flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6 text-primary" strokeWidth={1.5} />
                </div>

                <div className="flex flex-col gap-2.5">
                  <h4 className="text-white text-[16px] font-bold font-sans leading-snug">
                    {card.title}
                  </h4>
                  <p className="text-slate-300 text-[14px] md:text-[15px] font-normal leading-relaxed font-sans">
                    {card.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div>
          <Button
            variant="default"
            className="w-full sm:w-auto px-10 h-[56px] rounded-[12px] bg-[#005ECA] hover:bg-[#0EA5E9] text-white font-bold text-sm tracking-wide shadow-lg active:scale-[0.98]"
            onClick={onActionClick}
          >
            {buttonText || 'Contact Sales'}
          </Button>
        </div>
      </div>
    </SectionLayout>
  );
};