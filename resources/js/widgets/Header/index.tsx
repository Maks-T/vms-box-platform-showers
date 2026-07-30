import React, { useState } from 'react';
import { Menu, Phone, Calculator } from 'lucide-react';
import { Logo } from '@/shared/components/ui/Logo';
import { siteConfig } from '@/shared/config/site';
import { Button } from '@/shared/components/ui/Button';
import NavBar from './ui/NavBar';
import MobileMenu from './ui/MobileMenu';
import { LeadModal } from '@/features/lead-capture/LeadModal';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);

  const { contacts, headerNav } = siteConfig;

  return (
    <>
      <header className="w-full z-50 bg-[#16191B] sticky top-0 shadow-lg border-b border-white/5">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 h-20 flex justify-between items-center">
          <Logo variant="dark" />

          <NavBar items={headerNav} />

          <div className="hidden lg:flex items-center gap-6">
            <a
              href={contacts.phone.href}
              className="flex items-center gap-2 text-white font-bold text-sm hover:text-sky-400 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-sky-400">
                <Phone className="w-4 h-4" />
              </div>
              {contacts.phone.label}
            </a>

            <Button
              onClick={() => setIsLeadModalOpen(true)}
              variant="default"
              size="sm"
              className="h-10 px-5 text-xs font-bold uppercase tracking-wider rounded-xl"
            >
              <Calculator className="w-4 h-4 mr-1.5" />
              Рассчитать стоимость
            </Button>
          </div>

          <div className="flex items-center gap-3 lg:hidden">
            <a
              href={contacts.phone.href}
              className="p-2.5 bg-white/5 rounded-xl border border-white/10 text-white"
            >
              <Phone className="w-5 h-5 text-sky-400" />
            </a>

            <button
              className="p-2.5 bg-white/5 rounded-xl border border-white/10 text-white/80 hover:text-white"
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
