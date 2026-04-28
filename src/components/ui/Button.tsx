import React from 'react';
import { motion } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', isLoading, children, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 h-10 px-6 py-2";
    
    const variants = {
      primary: "bg-primary text-white hover:bg-primary/90 shadow-md",
      outline: "border-2 border-primary text-primary hover:bg-primary/10",
      ghost: "hover:bg-primary/10 text-primary",
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(baseStyles, variants[variant], className)}
        {...props}
      >
        {isLoading ? <span className="animate-spin mr-2 border-2 border-current border-t-transparent rounded-full w-4 h-4" /> : null}
        {children}
      </motion.button>
    );
  }
);
Button.displayName = "Button";