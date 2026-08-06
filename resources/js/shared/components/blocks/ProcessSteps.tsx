import React from 'react';
import SectionLayout from '@/shared/components/layouts/SectionLayout';

export interface StepItem {
  number: string;
  title: string;
  description: string;
}

const STEPS: StepItem[] = [
  {
    number: '01',
    title: 'Оставьте заявку',
    description: 'Менеджер свяжется с вами, ответит на вопросы и сделает предварительный расчет стоимости.',
  },
  {
    number: '02',
    title: 'Выезд специалиста',
    description: 'Бесплатный замер, снятие чистовых размеров, утверждение чертежей и заключение договора.',
  },
  {
    number: '03',
    title: 'Изготовление изделия',
    description: 'Производство закаленного стекла и комплектация фурнитурой в течение 15 рабочих дней.',
  },
  {
    number: '04',
    title: 'Доставка и монтаж',
    description: 'Бережная доставка собственным транспортом и чистый профессиональный монтаж.',
  },
];

export function ProcessSteps() {
  return (
    <SectionLayout bg="bg-[#16191B]" className="py-12 md:py-20 text-white">
      <div className="flex flex-col items-center text-center mb-12">
        <span className="text-xs font-bold text-sky-400 uppercase tracking-widest mb-2">
          Прозрачный процесс
        </span>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          Этапы работы
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        {STEPS.map((step) => (
          <div
            key={step.number}
            className="flex flex-col p-6 rounded-2xl bg-white/5 border border-white/10 relative overflow-hidden"
          >
            <span className="text-4xl font-black text-sky-500/30 mb-4 font-mono">
              {step.number}
            </span>
            <h3 className="text-lg font-bold text-white mb-2">
              {step.title}
            </h3>
            <p className="text-xs md:text-sm text-white/60 leading-relaxed">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </SectionLayout>
  );
}
