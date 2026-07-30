import React from 'react';
import { Link } from '@inertiajs/react';
import { cn } from '@/shared/lib/utils';

type LogoVariant = 'dark' | 'light' | 'outline';

interface LogoProps {
  variant?: LogoVariant;
  className?: string;
  onClick?: () => void;
}

export function Logo({ variant = 'dark', className, onClick }: LogoProps) {
  return (
    <Link
      href="/shower_cabin"
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 active:scale-[0.98] transition-transform select-none group",
        className
      )}
    >
      <div className="w-10 h-10 md:w-11 md:h-11 rounded-xl bg-gradient-to-br from-[#005ECA] to-[#003F87] flex items-center justify-center text-white font-black text-xl shadow-md border border-white/10 group-hover:scale-105 transition-transform">
        П
      </div>

      <div className="flex flex-col">
        <span className={cn(
          "text-base md:text-lg font-bold tracking-tight leading-tight transition-colors",
          variant === 'light' ? "text-slate-900" : "text-white group-hover:text-sky-400"
        )}>
          Прозрачные Решения
        </span>
        <span className="text-[10px] uppercase tracking-widest text-sky-400 font-semibold">
          Душевые & Зеркала
        </span>
      </div>
    </Link>
  );
}
