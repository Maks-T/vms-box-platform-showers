import React from 'react';
import {Logo} from '@/shared/components/ui/Logo';
import {siteConfig} from '@/shared/config/site';
import {Link} from '@inertiajs/react';

export default function Footer() {
  const {company, headerNav} = siteConfig;

  return (
    <footer className="w-full bg-[#F2F7FA] text-slate-800 pt-10 pb-8 border-t border-slate-200 mt-auto">
      <div
        className="max-w-[1400px] mx-auto px-4 md:px-8 flex flex-col lg:flex-row justify-between items-center gap-6 lg:gap-8">

        <div className="shrink-0">
          <Logo/>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 md:gap-x-7">
          {headerNav.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-xs md:text-sm font-medium text-slate-700 hover:text-[#024f87] transition-colors whitespace-nowrap"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="text-slate-500 text-xs font-normal text-center lg:text-right shrink-0">
          {company.copyright}
        </div>

      </div>
    </footer>
  );
}
