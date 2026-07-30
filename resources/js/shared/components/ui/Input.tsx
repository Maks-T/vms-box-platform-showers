import React, {InputHTMLAttributes, forwardRef} from 'react';
import {cn} from '@/shared/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  icon?: React.ReactNode;
  themeVariant?: 'dark' | 'white' | 'blue';
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({className, error, icon, themeVariant = 'white', ...props}, ref) => {
    const themeStyles = {
      white: "bg-white border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 autofill-white",
      dark: "bg-[#1A1D21] border-white/10 text-white placeholder:text-white/40 focus:border-primary focus:ring-primary/30 autofill-dark",
      blue: "bg-[#005ECA] border-white/20 text-white placeholder:text-white/60 focus:border-white focus:ring-white/30 autofill-blue",
    };

    return (
      <div className="w-full flex flex-col gap-1.5">
        <div className="relative flex items-center">
          {icon && (
            <div
              className="absolute left-3.5 text-muted-foreground pointer-events-none flex items-center justify-center">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              "w-full h-12 px-4 rounded-xl border text-sm font-medium transition-all outline-none focus:ring-2",
              icon && "pl-11",
              themeStyles[themeVariant],
              error && "border-destructive focus:border-destructive focus:ring-destructive/20",
              className
            )}
            {...props}
          />
        </div>
        {error && <span className="text-xs text-destructive font-medium pl-1">{error}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";
