

import React from 'react';
import SectionLayout from '@/shared/components/layouts/SectionLayout';
import { Accordion, AccordionItem } from '@/shared/components/ui/Accordion';

const FAQ_ITEMS: AccordionItem[] = [
  {
    id: '1',
    title: 'Какие сроки изготовления?',
    content: 'Стандартный срок изготовления закаленного стекла и комплектации фурнитурой составляет до 15 рабочих дней с момента выезда на замер и согласования чертежа.',
  },
  {
    id: '2',
    title: 'Монтаж входит в стоимость?',
    content: 'Стоимость монтажа и доставки рассчитывается индивидуально в зависимости от сложности и габаритов изделия и включается в итоговый договор.',
  },
  {
    id: '3',
    title: 'Какое у вас стекло?',
    content: 'Мы используем исключительно закаленное безопасное стекло высокой прочности толщиной 8–10 мм, выдерживающее удары и перепады температур.',
  },
  {
    id: '4',
    title: 'Гарантию даете?',
    content: 'Да, на все изделия предоставляется официальная гарантия 3 года, а на монтажные работы — 1 год.',
  },
  {
    id: '5',
    title: 'Есть ли возможность покупки в рассрочку?',
    content: 'Да, у нас доступна система удобной рассрочки. Подробности можно уточнить у менеджера при расчете.',
  },
];

interface FaqAccordionProps {
  theme?: 'light' | 'dark';
}

export function FaqAccordion({ theme = 'light' }: FaqAccordionProps) {
  return (
    <SectionLayout
      bg={theme === 'dark' ? "bg-[#16191B]" : "bg-transparent"}
      className="py-12 md:py-20"
    >
      <div className="max-w-3xl mx-auto w-full flex flex-col items-center">
        {}
        <div className="flex flex-col items-center text-center mb-10">
          <h2 className={`text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            Вопросы и <span className="text-[#024f87]">ответы</span>
          </h2>
        </div>

        <Accordion items={FAQ_ITEMS} theme={theme} className="w-full" />
      </div>
    </SectionLayout>
  );
}
