import React, {ElementType, HTMLAttributes} from 'react';
import {cn} from '@/shared/lib/utils';

type StatusBadgeVariant = 'blue' | 'success' | 'warning';

interface StatusBadgeProps extends HTMLAttributes<HTMLElement> {
  variant?: StatusBadgeVariant;
  as?: ElementType;
  href?: string;
}

export default function StatusBadge({
                                      children,
                                      variant = 'blue',
                                      className,
                                      as: Component = 'div',
                                      ...props
                                    }: StatusBadgeProps) {
  const isInteractive = props.href || props.onClick || Component === 'a';

  const variants = {
    blue: "text-[#3D98FF] border-[#3D98FF]/30 bg-[#005ECA]/10 shadow-[0_0_16px_rgba(61,152,255,0.15)] hover:bg-[#005ECA]/15",
    success: "text-emerald-500 border-emerald-500/30 shadow-[inset_0_0_12px_rgba(16,185,129,0.15)] bg-emerald-500/5 hover:bg-emerald-500/10",
    warning: "text-amber-500 border-amber-500/30 shadow-[inset_0_0_12px_rgba(245,158,11,0.15)] bg-amber-500/5 hover:bg-amber-500/10",
  };

  const dotVariants = {
    blue: "bg-[#3D98FF]",
    success: "bg-emerald-500",
    warning: "bg-amber-500",
  };

  return (
    <Component
      className={cn(
        "group inline-flex items-center gap-2.5 px-3.5 py-1.5 md:px-4 md:py-2 rounded-full transition-all duration-300 backdrop-blur-md border",
        isInteractive && "cursor-pointer active:scale-[0.98]",
        variants[variant],
        className
      )}
      {...props}
    >
      <div className="relative flex items-center justify-center w-2 h-2 shrink-0">
        <span className={cn("absolute w-full h-full rounded-full animate-ping opacity-75", dotVariants[variant])}
              style={{animationDuration: '2.5s'}}/>
        <span className={cn("relative w-2 h-2 rounded-full shadow-[0_0_8px_currentColor]", dotVariants[variant])}/>
      </div>
      <span className="text-[12px] md:text-[13px] font-semibold leading-normal font-sans tracking-wide whitespace-nowrap">
        {children}
      </span>
    </Component>
  );
}