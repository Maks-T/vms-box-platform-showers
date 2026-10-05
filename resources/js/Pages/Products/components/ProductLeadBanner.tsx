import React, { useState } from 'react';
import SectionLayout from '@/shared/components/layouts/SectionLayout';
import { H3, Text } from '@/shared/components/ui/Typography';
import { toast } from 'sonner';
import { Send, CheckCircle2 } from 'lucide-react';
import { useTranslation } from '@/shared/i18n/useTranslation';
import client from '@/shared/lib/client';

interface Props {
  sectionData: {
    title: string;
    description: string;
    buttonLabel?: string;
  };
  placement?: string;
}

export const ProductLeadBanner: React.FC<Props> = ({ sectionData, placement }) => {
  const { title, description, buttonLabel } = sectionData;
  const { t, locale } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '' });

  const isEn = locale === 'en';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || (!formData.phone.trim() && !formData.email.trim())) {
      toast.error(isEn ? 'Please fill in name and at least one contact' : 'Пожалуйста, заполните имя и контакты');
      return;
    }

    setLoading(true);
    try {
      try {
        await client.post('/api/v1/leads', {
          ...formData,
          form_code: 'product_lead_banner',
          hidden_data: { placement: placement || 'ProductLeadBanner' },
          locale,
        });
      } catch (err) {
        console.warn('Leads API fallback:', err);
      }

      setSubmitted(true);
      toast.success(isEn ? 'Thank you! Your request has been received.' : 'Спасибо! Ваша заявка принята.');
    } catch (err: any) {
      toast.error(err?.message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SectionLayout>
      <div className="p-6 md:p-10 bg-slate-50 rounded-[24px] border border-slate-200 flex flex-col lg:flex-row gap-8 lg:gap-12 items-start justify-between shadow-sm">
        <div className="flex-1 flex flex-col gap-4">
          <H3 className="text-slate-900 text-[20px] md:text-[24px] font-bold leading-tight">
            {title}
          </H3>
          <Text className="text-slate-600 text-[15px] md:text-[16px] leading-relaxed max-w-[500px]">
            {description}
          </Text>
        </div>

        <div className="flex-1 w-full">
          {submitted ? (
            <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 shrink-0" />
              <span className="font-semibold text-sm">
                {isEn ? 'Thank you! We will get in touch with you shortly.' : 'Спасибо! Мы свяжемся с вами в ближайшее время.'}
              </span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder={isEn ? 'Your Name *' : 'Ваше имя *'}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-12 px-4 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:border-[#005ECA]"
                />
                <input
                  type="text"
                  required
                  placeholder={isEn ? 'Phone / WhatsApp *' : 'Телефон / WhatsApp *'}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="h-12 px-4 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:border-[#005ECA]"
                />
              </div>
              <input
                type="email"
                placeholder={isEn ? 'Email' : 'Email'}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="h-12 px-4 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:border-[#005ECA]"
              />
              <button
                type="submit"
                disabled={loading}
                className="h-12 mt-1 rounded-xl bg-[#005ECA] hover:bg-[#0EA5E9] text-white font-bold text-sm tracking-wide transition-all shadow-md active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{loading ? (isEn ? 'Sending...' : 'Отправка...') : (buttonLabel || t('contact_sales'))}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </SectionLayout>
  );
};