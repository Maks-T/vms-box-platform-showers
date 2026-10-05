import React, { useState, useEffect } from 'react';
import { Menu, ShieldCheck } from 'lucide-react';
import { Logo } from '@/shared/components/ui/Logo';
import { siteConfig } from '@/shared/config/site';
import { usePage } from '@inertiajs/react';
import LanguageSelect from '@/shared/components/ui/LanguageSelect';
import NavBar from './ui/NavBar';
import MobileMenu from './ui/MobileMenu';
import { checkDevMode } from '@/shared/lib/dev';
import { useTranslation, Locale } from '@/shared/i18n/useTranslation';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t, locale, setLocale } = useTranslation();

  const { auth } = usePage().props as any;
  const isEmployee = !!auth?.employee;
  const isDev = checkDevMode();

  useEffect(() => {
    localStorage.setItem('app_locale', locale);
  }, [locale]);

  const handleLanguageChange = (newLocale: string) => {
    setLocale(newLocale as Locale);
  };

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const handleContactSales = () => {
    if (typeof window !== 'undefined' && (window as any).AppBridge?.leads?.openModal) {
      (window as any).AppBridge.leads.openModal({
        formCode: 'header_contact_sales',
        title: 'Contact Sales',
      });
    }
  };

  return (
    <>
      <header className="w-full z-50 bg-[#16191B] sticky top-0 shadow-lg border-b border-white/5">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 h-20 flex justify-between items-center">
          <Logo />

          <NavBar items={siteConfig.headerNav} />

          <div className="flex items-center gap-4">
            <LanguageSelect
              currentLocale={locale}
              onLocaleChange={handleLanguageChange}
            />

            {(isDev || isEmployee) && (
              <a
                href="/admin"
                target="_blank"
                rel="noreferrer"
                className="hidden xl:flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] text-white text-xs font-medium transition-all"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                {t('admin_panel')}
              </a>
            )}

            <button
              onClick={handleContactSales}
              className="hidden sm:inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-[#005ECA] hover:bg-[#0EA5E9] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-[0.98] cursor-pointer"
            >
              {t('contact_sales')}
            </button>

            <button
              className="lg:hidden p-2 text-white/80 hover:text-white"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        items={siteConfig.headerNav}
        isDev={isDev}
      />
    </>
  );
}