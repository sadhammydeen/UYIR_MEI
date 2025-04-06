import React from 'react';
import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority';
import { forwardRef } from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'link' | 'default' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  asChild?: boolean;
}

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background',
  {
    variants: {
      variant: {
        default: 'bg-gray-900 text-white hover:bg-gray-700 active:bg-gray-800',
        primary: 'bg-theuyir-pink text-white hover:bg-theuyir-pink/90 active:bg-theuyir-pink',
        secondary: 'bg-theuyir-yellow text-theuyir-darkgrey hover:bg-theuyir-yellow/90 active:bg-theuyir-yellow',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        destructive: 'bg-red-600 text-white hover:bg-red-700',
        link: 'text-theuyir-pink underline-offset-4 hover:underline'
      },
      size: {
        sm: 'h-9 px-3 rounded-md',
        md: 'h-10 py-2 px-4',
        lg: 'h-11 px-8 rounded-md',
        icon: 'h-9 w-9'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'md'
    }
  }
);

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, children, asChild, ...props }, ref) => {
    // If asChild prop is passed, render the child with className applied
    if (asChild && children) {
      const Child = children as React.ReactElement;
      const { className: childClassName, ...childProps } = Child.props;
      
      return React.cloneElement(Child, {
        ...childProps,
        className: `${buttonVariants({ variant, size })} ${className || ''} ${childClassName || ''}`
      });
    }
    
    return (
      <button
        className={`${buttonVariants({ variant, size })} ${className || ''}`}
        ref={ref}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
export default Button;