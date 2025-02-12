import React from 'react';
import { cn } from '../utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

export function Button({ 
  children, 
  variant = 'primary', 
  className, 
  disabled,
  ...props 
}: ButtonProps) {
  return (
    <button
      className={cn(
        'px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-logiciel',
        variant === 'primary' 
          ? 'bg-[#B91C1C] text-white hover:bg-[#991b1b] disabled:bg-gray-300 disabled:cursor-not-allowed disabled:hover:bg-gray-300' 
          : 'bg-white text-gray-800 hover:bg-gray-50 border border-gray-100 disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-200 disabled:cursor-not-allowed disabled:hover:bg-gray-100',
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
