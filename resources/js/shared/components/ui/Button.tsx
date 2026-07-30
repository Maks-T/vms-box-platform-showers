

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { ArrowRight } from "lucide-react";
import { Link } from '@inertiajs/react';
import { cn } from "@/shared/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-200 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none active:scale-[0.98]",
  {
    variants: {
      variant: {
        
        tilda: "bg-[#004F87] text-white border-2 border-[#004F87] rounded-[10px] hover:bg-white hover:text-[#004F87] hover:shadow-[0px_10px_20px_rgba(0,11,48,0.25)] transition-all duration-200 font-semibold",
        tildaOutline: "bg-white text-[#004F87] border-2 border-[#004F87] rounded-[10px] shadow-[0px_10px_20px_rgba(0,11,48,0.25)] hover:bg-[#004F87] hover:text-white transition-all duration-200 font-semibold",
        default: "bg-[#004F87] text-white hover:bg-white hover:text-[#004F87] border-2 border-[#004F87] rounded-[10px]",
        outline: "border-2 border-[#004F87] text-[#004F87] bg-white hover:bg-[#004F87] hover:text-white rounded-[10px]",
        glass: "bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 rounded-[10px]",
      },
      size: {
        default: "h-[45px] px-7 text-[14px]",
        sm: "h-9 px-4 text-xs",
        lg: "h-[50px] px-9 text-[15px]",
      },
    },
    defaultVariants: {
      variant: "tilda",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  withArrow?: boolean;
  href?: string;
  target?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, withArrow = false, href, children, ...props }, ref) => {
    if (href) {
      const isExternal = href.startsWith('http') || props.target === '_blank';
      const Comp = isExternal ? 'a' : Link;

      return (
        // @ts-ignore
        <Comp
          href={href}
          className={cn(buttonVariants({ variant, size, className }))}
          {...props}
        >
          {children}
          {withArrow && <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />}
        </Comp>
      );
    }

    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {asChild ? children : (
          <>
            {children}
            {withArrow && <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />}
          </>
        )}
      </Comp>
    );
  }
);

Button.displayName = "Button";
