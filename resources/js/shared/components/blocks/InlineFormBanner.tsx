

import React, { useState } from 'react';
import SectionLayout from '@/shared/components/layouts/SectionLayout';
import { Input } from '@/shared/components/ui/Input';
import { PhoneInput } from '@/shared/components/ui/PhoneInput';
import { Button } from '@/shared/components/ui/Button';
import client from '@/shared/lib/client';
import { toast } from 'sonner';

interface Props {
  title?: string;
  subtitle?: string;
  variant?: 'blue' | 'white';
}

export function InlineFormBanner({
                                   title = "Оставьте заявку на расчет душевой кабины",
                                   subtitle = "Если вы знаете размеры — сделаем расчет по ним, либо приедем на замер к вам.",
                                   variant = 'blue',
                                 }: Props) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (!phone || phone.length < 10) {
      toast.error('Введите корректный номер телефона');
      return;
    }

    setIsLoading(true);

    try {
      await client.post('/api/v1/order/save', {
        customer: { name: name || 'Клиент с сайта', phone },
        grand_total: 0,
        currency: 'BYN',
        customer_comment: `Заявка с формы: ${title}`,
        results: [{ title, price: { total: 0, grand_total: 0 } }]
      });

      toast.success('Заявка успешно отправлена!');
      setName('');
      setPhone('');
    } catch (err) {
      toast.error('Ошибка отправки формы');
    } finally {
      setIsLoading(false);
    }
  };

  if (variant === 'blue') {
    return (
      <SectionLayout className="py-8 md:py-12">
        <div className="w-full max-w-[1240px] mx-auto rounded-[24px] bg-[#004F87] text-white p-8 md:p-12 shadow-xl flex flex-col items-center text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight mb-2">
            {title}
          </h2>
          <p className="text-sm md:text-base text-white/80 font-normal max-w-2xl mb-8">
            {subtitle}
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-xl">
            <Input
              themeVariant="blue"
              placeholder="Ваше имя"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-white/10 text-white placeholder:text-white/60 border-white/20"
            />
            <PhoneInput
              themeVariant="blue"
              value={phone}
              onChange={setPhone}
              required
              className="bg-white/10 text-white placeholder:text-white/60 border-white/20"
            />
            <Button
              type="submit"
              disabled={isLoading}
              className="h-12 px-8 bg-white text-[#004F87] hover:bg-slate-100 font-semibold rounded-xl shrink-0 w-full sm:w-auto"
            >
              {isLoading ? '...' : 'Отправить'}
            </Button>
          </form>
        </div>
      </SectionLayout>
    );
  }

  return (
    <SectionLayout className="py-8 md:py-12">
      <div className="w-full max-w-[1240px] mx-auto rounded-[24px] bg-slate-50 border border-slate-200 p-8 md:p-12 shadow-sm flex flex-col items-center text-center">
        <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 tracking-tight mb-2">
          {title}
        </h2>
        <p className="text-sm md:text-base text-slate-600 font-normal max-w-2xl mb-8">
          {subtitle}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-xl">
          <Input
            placeholder="Ваше имя"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <PhoneInput
            value={phone}
            onChange={setPhone}
            required
          />
          <Button
            type="submit"
            disabled={isLoading}
            className="h-12 px-8 bg-[#004F87] text-white hover:bg-[#003559] font-semibold rounded-xl shrink-0 w-full sm:w-auto"
          >
            {isLoading ? '...' : 'Отправить'}
          </Button>
        </form>
      </div>
    </SectionLayout>
  );
}
