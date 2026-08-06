import React from 'react';
import {Link} from '@inertiajs/react';
import {ChevronRight, Home} from 'lucide-react';

interface Props {
  productName: string;
}

export function ProductBreadcrumbs({productName}: Props) {
  return (
    <nav
      className="flex items-center gap-2 text-xs md:text-sm text-slate-500 py-4 mb-4 overflow-x-auto whitespace-nowrap">
      <Link href="/" className="hover:text-[#004F87] transition-colors flex items-center gap-1">
        <Home className="w-3.5 h-3.5"/>
        <span>Главная</span>
      </Link>
      <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0"/>
      <Link href="/catalog" className="hover:text-[#004F87] transition-colors">
        Каталог
      </Link>
      <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0"/>
      <span className="text-slate-900 font-semibold truncate max-w-[200px] sm:max-w-[300px] md:max-w-none">
        {productName}
      </span>
    </nav>
  );
}