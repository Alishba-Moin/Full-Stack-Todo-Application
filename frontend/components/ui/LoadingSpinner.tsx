// Loading spinner component 

import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
}

const sizeClasses = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-[3px]',
  lg: 'h-12 w-12 border-4',
};

export function LoadingSpinner({
  size = 'md',
  className = '',
  label,
}: LoadingSpinnerProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 ${className}`}
      role="status"
      aria-live="polite"
    >
      <div
        className={`
          ${sizeClasses[size]}
          rounded-full
          animate-spin
          border-gray-200
          border-t-yellow-500
        `}
      />

      {label && (
        <p className="text-sm text-gray-500 tracking-wide">
          {label}
        </p>
      )}
    </div>
  );
}
