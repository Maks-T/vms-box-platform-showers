import React, {Fragment} from 'react';
import {Link} from '@inertiajs/react';
import {cn} from '@/shared/lib/utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbsProps {
  variant?: 'base' | 'dark' | 'light';
  items?: BreadcrumbItem[];
  className?: string;
}

const linkStyleVariants = {
  base: 'text-slate-500 hover:text-[#004F87]',
  dark: 'text-slate-500 hover:text-[#004F87]',
  light: 'text-white/70 hover:text-white',
};

const currentLinkStyleVariants = {
  base: 'text-slate-900 font-semibold',
  dark: 'text-slate-900 font-semibold',
  light: 'text-white font-semibold',
};

const arrowStyleVariants = {
  base: 'text-slate-300',
  dark: 'text-slate-300',
  light: 'text-white/40',
};

export default function Breadcrumbs({
                                      variant = 'dark',
                                      items,
                                      className,
                                    }: BreadcrumbsProps) {
  if (!items?.length) return null;

  return (
    <nav aria-label="Breadcrumb"
         className={cn('flex items-center gap-2 overflow-x-auto whitespace-nowrap py-3 font-sans', className)}>
      <Link
        href="/"
        className={cn('text-[14px] transition-colors font-normal', linkStyleVariants[variant])}
      >
        Главная
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <Fragment key={index}>
            <span className={cn('text-[12px] select-none flex items-center', arrowStyleVariants[variant])}>
              <svg
                width="6"
                height="10"
                viewBox="0 0 6 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="shrink-0"
              >
                <path
                  d="M1 9L5 5L1 1"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>

            {item.href && !isLast ? (
              <Link
                href={item.href}
                className={cn(
                  'text-[14px] transition-colors font-normal',
                  linkStyleVariants[variant],
                )}
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={cn('text-[14px] truncate max-w-[200px] sm:max-w-[300px] md:max-w-none', currentLinkStyleVariants[variant])}>
                {item.label}
              </span>
            )}
          </Fragment>
        );
      })}
    </nav>
  );
}