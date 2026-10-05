import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

export interface LanguageOption {
  code: string;
  label: string;
  native: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', native: 'English', flag: '🇺🇸' },
  { code: 'de', label: 'German', native: 'Deutsch', flag: '🇩🇪' },
  { code: 'es', label: 'Spanish', native: 'Español', flag: '🇪🇸' },
  { code: 'it', label: 'Italian', native: 'Italiano', flag: '🇮🇹' },
  { code: 'pl', label: 'Polish', native: 'Polski', flag: '🇵🇱' },
  { code: 'tr', label: 'Turkish', native: 'Türkçe', flag: '🇹🇷' },
  { code: 'ru', label: 'Russian', native: 'Русский', flag: '🇷🇺' },
];

interface LanguageSelectProps {
  currentLocale: string;
  onLocaleChange: (locale: string) => void;
  className?: string;
}

export default function LanguageSelect({
                                         currentLocale,
                                         onLocaleChange,
                                         className,
                                       }: LanguageSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeLang =
    SUPPORTED_LANGUAGES.find((lang) => lang.code === currentLocale) ||
    SUPPORTED_LANGUAGES[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleSelect = (code: string) => {
    onLocaleChange(code);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={cn('relative select-none', className)}>
      {/* Кнопка триггера */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer border',
          isOpen
            ? 'bg-white/10 border-white/20 text-white shadow-lg'
            : 'bg-white/[0.04] border-white/10 text-white/80 hover:bg-white/[0.08] hover:text-white'
        )}
      >
        <span className="text-sm">{activeLang.flag}</span>
        <span>{activeLang.code.toUpperCase()}</span>
        <ChevronDown
          className={cn(
            'w-3.5 h-3.5 text-white/50 transition-transform duration-300',
            isOpen && 'rotate-180 text-white'
          )}
        />
      </button>

      {/* Выпадающее меню со скользящей подсветкой */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 p-1.5 rounded-2xl bg-[#16191B]/95 backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex flex-col gap-0.5">
            {SUPPORTED_LANGUAGES.map((lang) => {
              const isSelected = lang.code === currentLocale;

              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleSelect(lang.code)}
                  className={cn(
                    'flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer text-left w-full',
                    isSelected
                      ? 'text-white font-bold bg-[#005ECA]'
                      : 'text-white/70 hover:text-white hover:bg-white/[0.06]'
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm">{lang.flag}</span>
                    <span className="leading-snug">{lang.native}</span>
                  </div>

                  {isSelected && <Check className="w-3.5 h-3.5 text-white stroke-[2.5]" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}