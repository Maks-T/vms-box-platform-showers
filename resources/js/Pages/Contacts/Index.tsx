import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import MainLayout from '@/layouts/MainLayout';
import SectionLayout from '@/shared/components/layouts/SectionLayout';
import { HeroCover } from '@/shared/components/blocks/HeroCover';
import { FaqAccordion } from '@/shared/components/blocks/FaqAccordion';
import { Input } from '@/shared/components/ui/Input';
import { PhoneInput } from '@/shared/components/ui/PhoneInput';
import { Button } from '@/shared/components/ui/Button';
import { siteConfig } from '@/shared/config/site';
import { siteAssets } from '@/shared/config/site-assets';
import { Phone, Mail, MapPin, Clock, Send, User, CheckCircle2 } from 'lucide-react';
import client from '@/shared/lib/client';
import { toast } from 'sonner';

export default function ContactsIndex() {
  const { contacts, socials } = siteConfig;

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (!phone || phone.length < 10) {
      toast.error('Пожалуйста, введите корректный номер телефона');
      return;
    }

    setIsLoading(true);

    try {
      await client.post('/api/v1/order/save', {
        customer: {
          name: name || 'Клиент со страницы контактов',
          phone: phone,
        },
        grand_total: 0,
        currency: 'BYN',
        customer_comment: `Заявка со страницы контактов. ${comment ? 'Комментарий: ' + comment : ''}`,
        results: [
          {
            title: 'Консультация со страницы Контакты',
            price: { total: 0, grand_total: 0 },
          }
        ]
      });

      setIsSuccess(true);
      toast.success('Заявка успешно отправлена! Менеджер свяжется с вами в ближайшее время.');
    } catch (error) {
      console.error('Ошибка отправки формы:', error);
      toast.error('Произошла ошибка при отправке заявки.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout headerOverlaps={false}>
      <Head title="Контакты - Прозрачные решения" />

      <HeroCover
        title={<>Контактная <span className="text-[#024f87]">информация</span></>}
        description="Получите профессиональную консультацию экспертов, запишитесь на бесплатный замер или пришлите ваши эскизы и чертежи для предварительного расчета."
        bgImage={siteAssets.hero.contacts}
      />

      <SectionLayout className="py-12 md:py-20 bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-14 items-start w-full max-w-[1240px] mx-auto">
          <div className="lg:col-span-6 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-slate-900 tracking-tight">
                Наши <span className="text-[#024f87]">контакты</span>
              </h2>
              <p className="text-slate-600 text-sm md:text-base font-normal leading-relaxed">
                Мы работаем без выходных. Свяжитесь с нами удобным для вас способом или приезжайте в наш офис для ознакомления с образцами стекол и фурнитуры.
              </p>
            </div>

            <div className="flex flex-col gap-3.5 mt-2">
              <a
                href={contacts.phone.href}
                className="flex items-center gap-4 p-4 rounded-2xl bg-[#F2F7FA] border border-slate-200/60 hover:border-[#024f87]/40 transition-all group shadow-none"
              >
                <div className="w-11 h-11 rounded-xl bg-white text-[#024f87] flex items-center justify-center shrink-0 border border-slate-100">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">Телефон</span>
                  <span className="text-base md:text-lg font-bold text-slate-900 group-hover:text-[#024f87] transition-colors">
                    {contacts.phone.label}
                  </span>
                </div>
              </a>

              <a
                href={contacts.email.href}
                className="flex items-center gap-4 p-4 rounded-2xl bg-[#F2F7FA] border border-slate-200/60 hover:border-[#024f87]/40 transition-all group shadow-none"
              >
                <div className="w-11 h-11 rounded-xl bg-white text-[#024f87] flex items-center justify-center shrink-0 border border-slate-100">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">E-mail</span>
                  <span className="text-base md:text-lg font-bold text-slate-900 group-hover:text-[#024f87] transition-colors">
                    {contacts.email.label}
                  </span>
                </div>
              </a>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#F2F7FA] border border-slate-200/60 shadow-none">
                <div className="w-11 h-11 rounded-xl bg-white text-[#024f87] flex items-center justify-center shrink-0 border border-slate-100">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">Адрес</span>
                  <span className="text-base md:text-lg font-bold text-slate-900">{contacts.address}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#F2F7FA] border border-slate-200/60 shadow-none">
                <div className="w-11 h-11 rounded-xl bg-white text-[#024f87] flex items-center justify-center shrink-0 border border-slate-100">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">Режим работы</span>
                  <span className="text-base md:text-lg font-bold text-slate-900">{contacts.workingHours}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 mt-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Мы в мессенджерах:
              </span>
              <div className="flex flex-wrap items-center gap-3">
                {socials.map((social) => (
                  <a
                    key={social.id}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-[#F2F7FA] border border-slate-200 hover:bg-[#024f87] hover:text-white hover:border-[#024f87] transition-all text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer text-slate-800 shadow-none"
                  >
                    {social.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-[#F2F7FA] border border-slate-200/80 p-6 sm:p-8 md:p-10 rounded-2xl text-slate-900 shadow-none">
            <h3 className="text-xl md:text-2xl font-bold tracking-tight mb-2 text-slate-900">
              Форма обратной связи
            </h3>
            <p className="text-slate-600 text-xs md:text-sm mb-6 leading-relaxed">
              Заполните форму, и наш менеджер оперативно сделает предварительный расчет вашего заказа.
            </p>

            {isSuccess ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-2">Заявка успешно отправлена!</h4>
                <p className="text-slate-600 text-sm mb-6 max-w-sm">
                  Мы свяжемся с вами в ближайшее время.
                </p>
                <Button onClick={() => setIsSuccess(false)} variant="tilda">
                  Отправить еще одну заявку
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <Input
                  themeVariant="white"
                  placeholder="Ваше имя"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  icon={<User className="w-4 h-4 text-slate-400" />}
                />

                <PhoneInput
                  themeVariant="white"
                  value={phone}
                  onChange={setPhone}
                  required
                />

                <textarea
                  className="w-full min-h-[110px] p-3.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm placeholder:text-slate-400 focus:border-[#024f87] focus:ring-2 focus:ring-[#024f87]/20 outline-none transition-all resize-none autofill-white"
                  placeholder="Опишите ваше изделие, примерные размеры или задайте вопрос..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />

                <Button
                  type="submit"
                  disabled={isLoading}
                  variant="tilda"
                  className="w-full h-12 text-sm font-bold uppercase tracking-widest mt-2 cursor-pointer"
                >
                  {isLoading ? 'Отправка...' : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Получить расчет
                    </>
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </SectionLayout>

      <FaqAccordion />
    </MainLayout>
  );
}

ContactsIndex.layout = (page: any) => page;