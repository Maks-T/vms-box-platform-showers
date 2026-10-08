import React from 'react';
import SectionLayout from '@/shared/components/layouts/SectionLayout';
import StatusBadge from '@/shared/components/ui/StatusBadge';
import { Accent, H1, Text } from '@/shared/components/ui/Typography';
import { Button } from '@/shared/components/ui/Button';
import HeroVisual from '@/entities/Visual/HeroVisual';
import StatsGrid, { StatItem } from '@/entities/StatsGrid';
import { cn } from '@/shared/lib/utils';
import { useTranslation } from '@/shared/i18n/useTranslation';
import { BlurFadeText } from '@/shared/components/ui/BlurFadeText';
import { BlurText } from '@/shared/components/ui/BlurText';
import { Magnet } from '@/shared/components/ui/Magnet';

interface Props {
  product: string;
  category?: string;
  title: { start: string; accent?: string; end?: string };
  stats?: StatItem[];
  description: string[];
  videoSrc?: string;
  imageSrc?: string;
  btnText?: string;
  demoAppUrl?: string;
}

export const ProductHero: React.FC<Props> = ({
                                               product,
                                               category,
                                               title,
                                               stats,
                                               description,
                                               videoSrc,
                                               imageSrc,
                                               btnText = 'Contact Sales',
                                               demoAppUrl = '/calculator',
                                             }) => {
  const { locale } = useTranslation();

  const handleOpenModal = () => {
    if (typeof window !== 'undefined' && (window as any).AppBridge?.leads?.openModal) {
      (window as any).AppBridge.leads.openModal({
        formCode: 'product_hero_lead',
        title: 'Contact Sales',
        hiddenData: { placement: `Hero: ${product}` },
      });
    }
  };

  return (
    <SectionLayout id="product-hero" bg="bg-dark" noPadding containerVariant="content" className="pt-2 md:pt-4">
      <div className="flex flex-col py-8 lg:py-12">
        <div className="flex flex-col lg:flex-row justify-between gap-12 lg:gap-8 w-full items-start">
          <div className="flex flex-col items-start w-full lg:max-w-[660px]">
            {category && (
              <StatusBadge variant="blue" className="mb-6">
                {category}
              </StatusBadge>
            )}

            <H1 className="mb-6 lg:mb-8 leading-[1.1]">
              <BlurFadeText text={title.start} delay={50} />{' '}
              {title.accent && (
                <Accent variant="light">{title.accent}</Accent>
              )}{' '}
              {title.end && <BlurFadeText text={title.end} delay={150} />}
            </H1>

            <div className="mb-8 lg:mb-10 flex flex-col gap-3">
              {Array.isArray(description) ? (
                description.map((text, i) => (
                  <BlurText
                    key={i}
                    text={text}
                    delay={250 + i * 150}
                    className="text-base md:text-[18px] text-slate-300 font-normal leading-relaxed"
                  />
                ))
              ) : (
                <BlurText
                  text={description}
                  delay={250}
                  className="text-base md:text-[18px] text-slate-300 font-normal leading-relaxed"
                />
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <Magnet strength={12} className="w-full sm:w-auto">
                <Button
                  variant="default"
                  className="w-full sm:w-auto px-10 h-[56px] rounded-[12px] bg-[#005ECA] hover:bg-[#0EA5E9] text-white font-bold text-sm tracking-wide shadow-lg active:scale-[0.98]"
                  onClick={handleOpenModal}
                >
                  {btnText}
                </Button>
              </Magnet>

              {demoAppUrl && (
                <Button
                  variant="glass"
                  href={demoAppUrl}
                  className="w-full sm:w-auto px-8 h-[56px] rounded-[12px] font-semibold text-white border-white/10 hover:bg-white/[0.08]"
                >
                  {locale === 'en' ? 'Live 3D Demo' : 'Смотреть 3D Демо'}
                </Button>
              )}
            </div>
          </div>

          <HeroVisual
            className="w-full lg:w-[48%] mt-0"
            videoSrc={videoSrc}
            imageSrc={imageSrc}
            alt={product}
          />
        </div>

        {stats && stats.length > 0 && <StatsGrid stats={stats} className="mt-12 lg:mt-16 mb-0" />}
      </div>
    </SectionLayout>
  );
};