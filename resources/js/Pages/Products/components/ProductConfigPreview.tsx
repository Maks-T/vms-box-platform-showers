import React from 'react';
import SectionLayout from '@/shared/components/layouts/SectionLayout';
import { H2, Text } from '@/shared/components/ui/Typography';
import LazyVideo from '@/shared/components/ui/LazyVideo';
import { Button } from '@/shared/components/ui/Button';

interface ConfigItem {
  icon?: any;
  title: string;
  text: string;
}

interface Props {
  sectionData: {
    title: { start: string; accent?: string };
    description?: string;
    videoSrc?: string;
    imageSrc?: string;
    items: ConfigItem[];
    buttonText?: string;
  };
  demoUrl?: string;
}

export const ProductConfigPreview: React.FC<Props> = ({ sectionData, demoUrl = '/calculator' }) => {
  const { title, description, videoSrc, imageSrc, items, buttonText = 'Live 3D Demo' } = sectionData;

  return (
    <SectionLayout bg="bg-[#F8FAFC]">
      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-2.5">
          <H2 className="text-slate-900 font-medium text-[28px] md:text-[36px]">
            <span className="text-slate-900">{title.start}</span>
            <span className="text-primary">{title.accent}</span>
          </H2>
          {description && (
            <Text className="text-slate-600 text-[16px] md:text-[18px] max-w-[750px]">
              {description}
            </Text>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-5 items-stretch">
          <div className="w-full lg:w-[540px] xl:w-[600px] shrink-0 rounded-[20px] overflow-hidden aspect-[4/3] sm:aspect-[16/10] lg:aspect-auto lg:h-[680px] shadow-sm border border-slate-200">
            <LazyVideo
              src={videoSrc}
              poster={imageSrc}
              theme="neutral"
              className="w-full h-full"
              videoClassName="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 flex flex-col gap-3">
            {items.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="flex-1 p-5 bg-white rounded-[20px] border border-slate-200/80 flex items-center gap-4 md:gap-5 shadow-sm">
                  <div className="w-11 h-11 bg-primary/10 rounded-[10px] border border-primary/20 flex items-center justify-center shrink-0">
                    {Icon ? <Icon className="w-5 h-5 text-primary" strokeWidth={1.5} /> : null}
                  </div>
                  <div className="flex flex-col gap-1 justify-center">
                    <h4 className="text-slate-900 text-[16px] md:text-[17px] font-bold font-sans leading-snug">
                      {item.title}
                    </h4>
                    <p className="text-slate-600 text-[14px] md:text-[15px] font-normal leading-relaxed font-sans">
                      {item.text}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <Button
            variant="default"
            href={demoUrl}
            className="w-full sm:w-auto px-8 h-[56px] rounded-[12px] bg-[#005ECA] hover:bg-[#0EA5E9] text-white font-bold text-sm tracking-wide shadow-md active:scale-[0.98]"
          >
            {buttonText}
          </Button>
        </div>
      </div>
    </SectionLayout>
  );
};