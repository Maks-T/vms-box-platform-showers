import React, { useState } from 'react';
import { Menu, Phone } from 'lucide-react';
import { Logo } from '@/shared/components/ui/Logo';
import { siteConfig } from '@/shared/config/site';
import { Button } from '@/shared/components/ui/Button';
import { Link, usePage } from '@inertiajs/react';
import { cn } from '@/shared/lib/utils';
import MobileMenu from './ui/MobileMenu';
import { LeadModal } from '@/features/lead-capture/LeadModal';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);

  const { url } = usePage();
  const currentPathname = url.split('?')[0];

  const { contacts, headerNav } = siteConfig;

  const getPathname = (urlStr: string) => {
    if (!urlStr || urlStr.startsWith('#')) return '';
    try {
      const parsed = new URL(urlStr, window.location.origin);
      return parsed.pathname;
    } catch {
      return urlStr.split('?')[0];
    }
  };

  return (
    <>
      <header className="w-full z-50 bg-white sticky top-0 border-b border-slate-200">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-3.5 flex justify-between items-center">
          <Logo />

          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            <a
              href={contacts.phone.href}
              className="text-slate-800 font-medium text-sm md:text-base hover:text-[#004F87] transition-colors"
            >
              Тел.: <span className="font-semibold">{contacts.phone.label}</span>
            </a>

            <Button
              onClick={() => setIsLeadModalOpen(true)}
              variant="tilda"
              className="px-6 h-[44px]"
            >
              Рассчитать стоимость
            </Button>
          </div>

          <div className="flex items-center gap-3 md:hidden">
            <a
              href={contacts.phone.href}
              className="p-2.5 bg-slate-100 rounded-lg text-[#004F87]"
            >
              <Phone className="w-5 h-5" />
            </a>

            <button
              className="p-2.5 bg-slate-100 rounded-lg text-slate-800 hover:text-black cursor-pointer"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="w-full border-t border-slate-100" />

        <div className="hidden md:block max-w-[1400px] mx-auto px-4 md:px-8">
          <nav className="flex items-center justify-center gap-8 lg:gap-12 py-2">
            {headerNav.map((item) => {
              const isActive = currentPathname === getPathname(item.href);

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "text-sm transition-colors relative py-1.5 cursor-pointer font-sans whitespace-nowrap",
                    isActive
                      ? "text-slate-900 font-bold border-b-2 border-slate-900"
                      : "text-slate-700 hover:text-[#004F87] font-medium"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        items={headerNav}
        onOpenLeadModal={() => setIsLeadModalOpen(true)}
      />

      <LeadModal
        isOpen={isLeadModalOpen}
        onClose={() => setIsLeadModalOpen(false)}
        sourceTitle="Расчет стоимости с шапки сайта"
      />
    </>
  );
}
