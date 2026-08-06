import React, {useEffect, ReactNode} from 'react';
import {createPortal} from 'react-dom';
import {X} from 'lucide-react';
import {cn} from '@/shared/lib/utils';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | 'full';
  className?: string;
  overlayClassName?: string;
}

const maxWidthMap = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl',
  full: 'max-w-full m-4',
};

export function Modal({
                        isOpen,
                        onClose,
                        title,
                        description,
                        children,
                        maxWidth = 'lg',
                        className,
                        overlayClassName,
                      }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
      <div
        onClick={onClose}
        className={cn(
          "fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in-0",
          overlayClassName
        )}
      />

      <div
        className={cn(
          "relative w-full bg-[#16191B] border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl z-10 text-white animate-in zoom-in-95 duration-200",
          maxWidthMap[maxWidth],
          className
        )}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all active:scale-95 cursor-pointer"
          aria-label="Закрыть"
        >
          <X className="w-5 h-5"/>
        </button>

        {(title || description) && (
          <div className="mb-6 pr-8">
            {title && (
              <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight leading-snug">
                {title}
              </h3>
            )}
            {description && (
              <p className="mt-2 text-sm text-white/60 leading-relaxed">
                {description}
              </p>
            )}
          </div>
        )}

        <div>{children}</div>
      </div>
    </div>,
    document.body
  );
}
