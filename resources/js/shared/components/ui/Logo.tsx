import React from 'react';
import {Link} from '@inertiajs/react';
import {cn} from '@/shared/lib/utils';

interface LogoProps {
  className?: string;
  onClick?: () => void;
}

export function Logo({className, onClick}: LogoProps) {
  return (
    <Link
      href="/shower_cabin"
      onClick={onClick}
      className={cn(
        "flex items-center active:scale-[0.98] transition-transform select-none py-1 group",
        className
      )}
    >
      <img
        src="/images/site/logo/logo-instagram.svg"
        alt="Прозрачные решения - Душевые кабины, зеркала, перегородки"
        className="h-12 md:h-14 lg:h-16 w-auto object-contain"
      />
    </Link>
  );
}
