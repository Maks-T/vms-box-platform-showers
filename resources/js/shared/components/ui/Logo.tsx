import React from 'react';
import {Link} from '@inertiajs/react';
import {cn} from '@/shared/lib/utils';

type LogoVariant = 'dark-outline' | 'light-solid' | 'dark-solid' | 'orange-dark';

interface LogoProps {
  variant?: LogoVariant;
  className?: string;
  imgClassName?: string;
  href?: string;
  onClick?: () => void;
}

export function Logo({
                       variant = 'orange-dark',
                       className,
                       imgClassName,
                       href = '/',
                       onClick
                     }: LogoProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "shrink-0 flex items-center active:scale-[0.98] transition-transform select-none",
        className
      )}
    >
      <img
        src="/images/logo-showers-cpq.svg"
        alt="showers-cpq"
        className={cn("h-14 md:h-18 w-auto object-contain", imgClassName)}
      />
    </Link>
  );
}