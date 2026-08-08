import React, {useState, ReactNode} from 'react';
import {ChevronDown} from 'lucide-react';
import {cn} from '@/shared/lib/utils';

export interface AccordionItem {
  id: string;
  title: string;
  content: ReactNode;
}

export interface AccordionProps {
  items: AccordionItem[];
  defaultOpenId?: string;
  className?: string;
  theme?: 'dark' | 'light';
}

export function Accordion({
                            items,
                            defaultOpenId,
                            className,
                            theme = 'light',
                          }: AccordionProps) {
  const [openId, setOpenId] = useState<string | null>(defaultOpenId || null);

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  const themeStyles = {
    light: {
      container: "border-b border-border py-4",
      title: "text-foreground font-semibold text-base md:text-lg hover:text-primary",
      icon: "text-muted-foreground",
      content: "text-muted-foreground text-sm leading-relaxed pt-3",
    },
    dark: {
      container: "border-b border-white/10 py-5",
      title: "text-white font-semibold text-base md:text-lg hover:text-sky-400",
      icon: "text-white/50",
      content: "text-white/70 text-sm md:text-base leading-relaxed pt-3",
    },
  };

  const st = themeStyles[theme];

  return (
    <div className={cn("w-full flex flex-col", className)}>
      {items.map((item) => {
        const isOpen = openId === item.id;

        return (
          <div key={item.id} className={st.container}>
            <button
              onClick={() => toggle(item.id)}
              className="w-full flex items-center justify-between text-left gap-4 transition-colors cursor-pointer group"
            >
              <span className={st.title}>{item.title}</span>
              <div
                className={cn(
                  "w-8 h-8 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center shrink-0 transition-transform duration-300",
                  isOpen && "rotate-180 bg-primary/10 text-primary"
                )}
              >
                <ChevronDown className={cn("w-5 h-5", st.icon)}/>
              </div>
            </button>

            {isOpen && (
              <div className={cn("animate-in fade-in-0 slide-in-from-top-1 duration-200", st.content)}>
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
