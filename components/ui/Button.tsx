'use client'

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'adminRed' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
}

const Button = ({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  className = '',
  ...props 
}: ButtonProps) => {
  const baseStyles = 'inline-flex cursor-pointer items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  
  const variants = {
    primary: 'bg-brown-800 text-white hover:bg-brown-700 active:bg-brown-900',
    secondary: 'bg-sage-700 text-white hover:bg-sage-600 active:bg-sage-800',
    adminRed: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-900',
    outline: 'border border-brown-800 text-brown-800 hover:bg-brown-50 hover:text-brown-800',
    ghost: 'text-brown-800 hover:bg-brown-50 hover:text-brown-900'
  };
  
  const sizes = {
    sm: 'h-9 px-3 rounded-md text-xs',
    md: 'h-10 px-4 py-2 rounded-md text-sm',
    lg: 'h-12 px-6 py-3 rounded-md text-base'
  };
  
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;