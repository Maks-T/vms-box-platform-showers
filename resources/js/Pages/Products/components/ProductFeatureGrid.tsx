import React from 'react';
import SectionLayout from '@/shared/components/layouts/SectionLayout';
import { H2, Text } from '@/shared/components/ui/Typography';
import LazyVideo from '@/shared/components/ui/LazyVideo';
import { cn } from '@/shared/lib/utils';

interface FeatureItem {
  title: string;
  text: React.ReactNode;
  videoSrc?: string;
  imageSrc?: string;
}

interface Props {
  sectionData: {
    title?: { start?: string | null; accent?: string | null };
    description?: string | null;
    items: FeatureItem[];
  };
}

export const ProductFeatureGrid: React.FC<Props> = ({ sectionData }) => {
  const { title, description, items } = sectionData;
  const hasHeader = title?.start || title?.accent;

  return (
    <SectionLayout bg="bg-white" className="pt-0 md:pt-0 lg:pt-0">
      <div className="flex flex-col gap-6">
        {hasHeader && (
          <div className="flex flex-col gap-2.5 lg:max-w-[720px] mb-4">
            <H2 className="text-slate-900 font-medium text-[28px] md:text-[36px]">
              <span className="text-slate-900">{title?.start}</span>
              <span className="text-primary">{title?.accent}</span>
            </H2>
            {description && (
              <Text className="text-slate-600 text-[16px] md:text-[18px]">{description}</Text>
            )}
          </div>
        )}

        <div className="flex flex-col gap-6">
          {items.map((item, idx) => (
            <div key={idx} className="p-4 sm:p-5 md:p-6 bg-slate-50 rounded-[20px] border border-slate-200 flex flex-col items-stretch">
              <div className={cn('flex flex-col lg:flex-row items-center gap-6 lg:gap-8 w-full', idx % 2 === 1 && 'lg:flex-row-reverse')}>
                <div className="w-full lg:w-[58%] xl:w-[60%] aspect-video rounded-[16px] overflow-hidden shrink-0 bg-white border border-slate-200/80 shadow-sm">
                  <LazyVideo
                    src={item.videoSrc}
                    poster={item.imageSrc}
                    theme="white"
                    className="w-full h-full"
                    videoClassName="w-full h-full object-contain"
                  />
                </div>

                <div className="w-full lg:w-[42%] xl:w-[40%] flex flex-col justify-center px-1 sm:px-2 lg:px-4 gap-3">
                  <h3 className="text-slate-900 text-[20px] md:text-[24px] font-bold font-sans leading-snug">
                    {item.title}
                  </h3>
                  <div className="text-slate-600 text-[15px] md:text-[16px] font-normal leading-relaxed font-sans">
                    {item.text}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionLayout>
  );
};