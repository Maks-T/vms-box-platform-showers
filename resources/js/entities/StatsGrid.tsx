import React from 'react';
import { Text } from '@/shared/components/ui/Typography';
import { cn } from '@/shared/lib/utils';

export interface StatItem {
  value: string;
  label: string;
}

interface StatsGridProps {
  stats?: StatItem[];
  className?: string;
}

export default function StatsGrid({ stats = [], className }: StatsGridProps) {
  if (!stats.length) return null;

  return (
    <div
      className={cn(
        'w-full mt-16 lg:mt-24 mb-8 lg:mb-12 rounded-[20px] bg-white/[0.01] backdrop-blur-[2.5px] overflow-hidden',
        className,
      )}
      style={{
        boxShadow: 'inset 0px 0px 14px rgba(144, 198, 221, 0.20), 0px 0px 6px rgba(0, 0, 0, 0.25)',
      }}
    >
      <div className={cn('grid', stats.length === 4 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3')}>
        {stats.map((stat, index) => (
          <div key={index} className="px-5 py-4 md:p-6 lg:p-8 flex flex-col justify-center items-center text-center">
            <span className="text-primary-light font-medium text-xl mb-2.5 font-sans">
              {stat.value}
            </span>
            <Text variant="baseWhite" className="text-white/80">
              {stat.label}
            </Text>
          </div>
        ))}
      </div>
    </div>
  );
}