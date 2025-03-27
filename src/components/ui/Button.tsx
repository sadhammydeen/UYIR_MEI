import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  fullWidth?: boolean;
  className?: string;
  isLoading?: boolean;
}

const Button = ({
  variant = 'primary',
  size = 'md',
  children,
  fullWidth = false,
  className,
  isLoading = false,
  disabled,
  ...props
}: ButtonProps) => {
  const baseClasses = "font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none";
  
  const variantClasses = {
    primary: "bg-theuyir-yellow text-black hover:brightness-95 disabled:hover:brightness-100",
    secondary: "bg-theuyir-pink text-white hover:brightness-95 disabled:hover:brightness-100",
    outline: "border border-black text-black hover:bg-black/5 disabled:hover:bg-transparent",
  };
  
  const sizeClasses = {
    sm: "py-1.5 px-4 text-sm",
    md: "py-2.5 px-6",
    lg: "py-3 px-8 text-lg",
  };
  
  const widthClass = fullWidth ? "w-full" : "";
  
  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        widthClass,
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          {children}
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
