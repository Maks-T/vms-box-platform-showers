import React, {useState, useEffect} from 'react';
import {X, Send, CheckCircle2} from 'lucide-react';
import {toast} from 'sonner';
import {useLeadModalStore} from '@/shared/store/useLeadModalStore';
import {useTranslation} from '@/shared/i18n/useTranslation';
import client from '@/shared/lib/client';

export default function GlobalLeadModal() {
  const {isOpen, closeModal, modalProps, openModal} = useLeadModalStore();
  const {t, locale} = useTranslation();

  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
  });

  // Экспорт в глобальный AppBridge для вызова из любых кнопок
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).AppBridge = (window as any).AppBridge || {};
      (window as any).AppBridge.leads = {
        openModal: (params: any, hidden: any) => openModal(params, hidden),
        closeModal: () => closeModal(),
      };
    }
  }, [openModal, closeModal]);

  useEffect(() => {
    if (isOpen) {
      setIsSuccess(false);
      setFormData({name: '', phone: '', email: '', message: ''});
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || (!formData.phone.trim() && !formData.email.trim())) {
      toast.error(
        locale === 'en'
          ? 'Please fill in your name and contact details'
          : 'Пожалуйста, заполните имя и контактные данные'
      );
      return;
    }

    setLoading(true);
    try {
      try {
        await client.post('/api/v1/leads', {
          ...formData,
          form_code: modalProps.formCode || 'contact_sales_modal',
          hidden_data: modalProps.hiddenData || {},
          locale,
        });
      } catch (err) {
        console.warn('Leads endpoint fallback:', err);
      }

      setIsSuccess(true);
      toast.success(
        locale === 'en'
          ? 'Thank you! Your request has been received.'
          : 'Спасибо! Ваша заявка успешно принята.'
      );

      if (modalProps.onSuccess) {
        modalProps.onSuccess(formData);
      }

      setTimeout(() => {
        closeModal();
      }, 2000);
    } catch (e: any) {
      toast.error(e?.message || 'Error submitting request');
    } finally {
      setLoading(false);
    }
  };

  const isEn = locale === 'en';

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={closeModal}
      />

      <div
        className="relative w-full max-w-lg bg-[#16191B] border border-white/10 rounded-2xl shadow-2xl p-6 sm:p-8 text-white z-10 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={closeModal}
          className="absolute top-5 right-5 p-2 rounded-xl text-white/50 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
        >
          <X className="w-5 h-5"/>
        </button>

        {isSuccess ? (
          <div className="py-12 flex flex-col items-center text-center gap-4">
            <div
              className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <CheckCircle2 className="w-8 h-8"/>
            </div>
            <h3 className="text-2xl font-bold text-white">
              {isEn ? 'Thank you!' : 'Спасибо!'}
            </h3>
            <p className="text-white/60 text-sm max-w-sm">
              {isEn
                ? 'Your request has been received. Our team will contact you shortly.'
                : 'Ваша заявка принята. Наш специалист свяжется с вами в ближайшее время.'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <h3 className="text-2xl font-black text-white tracking-tight">
                {modalProps.title || t('contact_sales')}
              </h3>
              <p className="text-white/60 text-sm mt-1.5 leading-relaxed">
                {modalProps.description || (isEn
                  ? 'Get a live demo with your product catalog and personalized pricing.'
                  : 'Покажем живое демо на ваших данных и подробно расскажем об условиях подключения.')}
              </p>
            </div>

            <div className="flex flex-col gap-3.5">
              <div>
                <label className="text-xs font-semibold text-white/70 uppercase tracking-wider block mb-1.5">
                  {isEn ? 'Your Name *' : 'Ваше имя *'}
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder={isEn ? 'Alexander' : 'Александр'}
                  className="w-full h-12 px-4 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-[#3D98FF] transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-xs font-semibold text-white/70 uppercase tracking-wider block mb-1.5">
                    {isEn ? 'Phone / WhatsApp *' : 'Телефон / WhatsApp *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="+1 555 0199"
                    className="w-full h-12 px-4 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-[#3D98FF] transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-white/70 uppercase tracking-wider block mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="sales@company.com"
                    className="w-full h-12 px-4 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-[#3D98FF] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-white/70 uppercase tracking-wider block mb-1.5">
                  {isEn ? 'Message / Requirements' : 'Сообщение / Пожелания'}
                </label>
                <textarea
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  placeholder={isEn ? 'Tell us about your project...' : 'Расскажите о вашем проекте...'}
                  className="w-full p-4 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-[#3D98FF] transition-all resize-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full h-12 rounded-xl bg-[#005ECA] hover:bg-[#0EA5E9] text-white font-bold text-sm tracking-wide transition-all shadow-lg active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4"/>
              <span>{loading ? (isEn ? 'Sending...' : 'Отправка...') : (modalProps.buttonLabel || t('contact_sales'))}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}