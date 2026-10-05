import React from 'react';
import SectionLayout from '@/shared/components/layouts/SectionLayout';
import { H2, Text } from '@/shared/components/ui/Typography';
import { Check } from 'lucide-react';

interface BenefitCard {
  icon: any;
  title: string;
  items: string[];
}

interface Props {
  sectionData: {
    title: { start: string; finish?: string };
    description?: string;
    cards: BenefitCard[];
  };
}

export const ProductBenefits: React.FC<Props> = ({ sectionData }) => {
  const { title, description, cards } = sectionData;

  return (
    <SectionLayout bg="bg-white">
      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-2.5">
          <H2 className="text-slate-900 font-medium text-[28px] md:text-[36px]">
            <span className="text-primary">{title.start}</span>
            <span className="text-slate-900">{title.finish}</span>
          </H2>
          {description && (
            <Text className="text-slate-600 text-[16px] md:text-[18px] max-w-[750px]">
              {description}
            </Text>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div key={index} className="p-6 md:p-[30px] bg-slate-50 rounded-[20px] border border-slate-200 flex flex-col gap-5">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-white rounded-[10px] border border-slate-200/80 shadow-sm flex items-center justify-center shrink-0">
                    <Icon className="w-6 h-6 text-primary" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-slate-900 text-[18px] md:text-[20px] font-bold font-sans">
                    {card.title}
                  </h3>
                </div>

                <div className="w-full h-px bg-slate-200" />

                <div className="flex flex-col gap-4">
                  {card.items.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-7 h-7 bg-white rounded-lg border border-slate-200/80 shadow-sm flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-4 h-4 text-primary stroke-[2.5]" />
                      </div>
                      <p className="flex-1 text-slate-700 text-[15px] font-normal leading-snug font-sans">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </SectionLayout>
  );
};