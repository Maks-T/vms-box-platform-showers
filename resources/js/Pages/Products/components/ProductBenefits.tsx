import React from 'react';
import SectionLayout from '@/shared/components/layouts/SectionLayout';
import { H2, Text } from '@/shared/components/ui/Typography';
import { Check } from 'lucide-react';
import { motion } from 'motion/react';
import { SpotlightCard } from '@/shared/components/ui/SpotlightCard';

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
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -80px 0px", amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col gap-2.5"
        >
          <H2 className="text-slate-900 font-medium text-[28px] md:text-[36px]">
            <span className="text-primary">{title.start}</span>
            <span className="text-slate-900">{title.finish}</span>
          </H2>
          {description && (
            <Text className="text-slate-600 text-[16px] md:text-[18px] max-w-[750px]">
              {description}
            </Text>
          )}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 45 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px -120px 0px", amount: 0.25 }}
                transition={{ duration: 0.65, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
              >
              <SpotlightCard
                spotlightColor="rgba(0, 94, 202, 0.08)"
                spotlightSize={400}
                className="p-6 md:p-[30px] bg-slate-50 rounded-[20px] border border-slate-200 flex flex-col gap-5"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-white rounded-[10px] border border-slate-200/80 shadow-sm flex items-center justify-center shrink-0">
                    <Icon className="w-6 h-6 text-primary" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-slate-900 text-[18px] md:text-[20px] font-bold font-sans">
                    {card.title}
                  </h3>
                </div>

                    <motion.div
                      initial={{ scaleX: 0, originX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true, margin: "0px 0px -120px 0px" }}
                      transition={{ duration: 0.5, delay: 0.2 + index * 0.1, ease: 'easeOut' }}
                      className="w-full h-px bg-slate-200"
                    />

                <div className="flex flex-col gap-4">
                  {card.items.map((item, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -12 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true, margin: "0px 0px -120px 0px" }}
                          transition={{
                            duration: 0.45,
                            delay: 0.25 + index * 0.1 + idx * 0.07,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                          className="flex items-start gap-3"
                        >
                          <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ type: 'spring', stiffness: 450, damping: 22, delay: 0.3 + index * 0.1 + idx * 0.07 }}
                            className="w-7 h-7 bg-white rounded-lg border border-slate-200/80 shadow-sm flex items-center justify-center shrink-0 mt-0.5"
                          >
                        <Check className="w-4 h-4 text-primary stroke-[2.5]" />
                          </motion.div>
                      <p className="flex-1 text-slate-700 text-[15px] font-normal leading-snug font-sans">
                        {item}
                      </p>
                        </motion.div>
                  ))}
                </div>
              </SpotlightCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </SectionLayout>
  );
};