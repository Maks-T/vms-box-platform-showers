import React from 'react';
import { cn } from '@/shared/lib/utils';

interface ShinyTextProps {
  children: React.ReactNode;
  className?: string;
  shimmerWidth?: number;
  speed?: number;
  disabled?: boolean;
}

export const ShinyText: React.FC<ShinyTextProps> = ({
  children,
  className = '',
  shimmerWidth = 100,
  speed = 4,
  disabled = false,
}) => {
  if (disabled) {
    return <span className={className}>{children}</span>;
  }

  return (
    <span
      style={{
        ['--shiny-speed' as string]: `${speed}s`,
        ['--shiny-width' as string]: `${shimmerWidth}%`,
      }}
      className={cn(
        'relative inline-block bg-[linear-gradient(110deg,currentColor_35%,rgba(255,255,255,0.95)_50%,currentColor_65%)]',
        'bg-[length:200%_100%] bg-clip-text text-transparent animate-[shine_var(--shiny-speed)_infinite_linear]',
        className
      )}
    >
      {children}
    </span>
  );
};