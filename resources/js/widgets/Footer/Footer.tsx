import React from 'react';
import { Logo } from '@/shared/components/ui/Logo';
import { Mail, ArrowRight } from 'lucide-react';
import { useTranslation } from '@/shared/i18n/useTranslation';

export default function Footer() {
  const { t } = useTranslation();

  const handleContactSales = () => {
    if (typeof window !== 'undefined' && (window as any).AppBridge?.leads?.openModal) {
      (window as any).AppBridge.leads.openModal({
        formCode: 'footer_contact_sales',
        title: 'Contact Sales',
      });
    }
  };

  return (
    <footer className="w-full bg-[#16191B] text-white pt-10 pb-8 mt-auto border-t border-white/5">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 flex flex-col gap-8">
        
        {/* Верхняя строка: Логотип и кнопка Contact Sales */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 pb-6 border-b border-white/5">
          <Logo />
          
          <button
            onClick={handleContactSales}
            className="flex items-center gap-2 px-7 py-3 rounded-xl bg-[#005ECA] hover:bg-[#0EA5E9] text-white font-bold text-sm tracking-wide transition-all shadow-lg active:scale-[0.98] cursor-pointer"
          >
            <span>{t('contact_sales')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Нижняя строка: домен и email */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-white/50 text-sm font-medium">
          <span className="hover:text-white transition-colors">
            showers-cpq.tech
          </span>

          <a 
            href="mailto:info@showers-cpq.tech"
            className="flex items-center gap-2 hover:text-[#3D98FF] transition-colors"
          >
            <Mail className="w-4 h-4 opacity-70" />
            <span>info@showers-cpq.tech</span>
          </a>
        </div>
      </div>
    </footer>
  );
}