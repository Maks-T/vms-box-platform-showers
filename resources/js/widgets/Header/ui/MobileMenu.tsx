import React from 'react';
import {Link, usePage} from '@inertiajs/react';
import {X, Calculator, Phone} from 'lucide-react';
import {cn} from '@/shared/lib/utils';
import {Logo} from '@/shared/components/ui/Logo';
import {NavItem, siteConfig} from '@/shared/config/site';
import {Button} from '@/shared/components/ui/Button';

interface ExtendedNavItem extends NavItem {
  forceRefresh?: boolean;
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  items: ExtendedNavItem[];
  onOpenLeadModal?: () => void;
}

export default function MobileMenu({isOpen, onClose, items, onOpenLeadModal}: MobileMenuProps) {
  if (!isOpen) return null;

  const {url} = usePage();
  const currentPathname = url.split('?')[0];

  const getPathname = (urlStr: string) => {
    if (!urlStr || urlStr.startsWith('#')) return '';
    try {
      const parsed = new URL(urlStr, window.location.origin);
      return parsed.pathname;
    } catch {
      return urlStr.split('?')[0];
    }
  };

  const {contacts} = siteConfig;

  return (
    <div className={cn(
      "fixed inset-0 z-[100] bg-[#16191B] flex flex-col transition-transform duration-500 ease-in-out lg:hidden",
      isOpen ? "translate-x-0" : "translate-x-full"
    )}>
      <div className="px-6 py-5 border-b border-white/5 flex justify-between items-center shrink-0">
        <Logo variant="dark" onClick={onClose}/>
        <button
          className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center text-white active:scale-90 transition-all border border-white/10 cursor-pointer"
          onClick={onClose}
        >
          <X className="w-6 h-6"/>
        </button>
      </div>

      <nav className="flex flex-col px-6 py-6 flex-1 overflow-y-auto">
        {items.map((item) => {
          if (item.disabled) {
            return (
              <span key={item.label}
                    className="py-4 text-[18px] text-white/30 font-medium border-b border-white/5 cursor-not-allowed select-none">
                {item.label}
              </span>
            );
          }

          const isActive = currentPathname === getPathname(item.href);

          const classes = cn(
            "py-4 text-[18px] border-b border-white/5 transition-colors",
            isActive ? "text-sky-400 font-bold" : "text-white font-medium"
          );

          if (item.forceRefresh) {
            return (
              <a key={item.label} href={item.href} className={classes}>
                {item.label}
              </a>
            );
          }

          return (
            <Link key={item.label} href={item.href} className={classes} onClick={onClose}>
              {item.label}
            </Link>
          );
        })}

        <div className="mt-8 flex flex-col gap-4">
          <a
            href={contacts.phone.href}
            className="flex items-center gap-3 py-3 px-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-base"
          >
            <Phone className="w-5 h-5 text-sky-400"/>
            {contacts.phone.label}
          </a>

          {onOpenLeadModal && (
            <Button
              onClick={() => {
                onClose();
                onOpenLeadModal();
              }}
              className="w-full h-12 text-sm font-bold uppercase tracking-wider rounded-xl"
            >
              <Calculator className="w-5 h-5 mr-2"/>
              Рассчитать стоимость
            </Button>
          )}
        </div>
      </nav>
    </div>
  );
}
