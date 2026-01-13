// Reusable Input component 
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  actionIcon?: React.ReactNode;
}

export function Input({
  label,
  error,
  helperText,
  icon,
  actionIcon,
  className = '',
  id,
  ...props
}: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="w-full space-y-1">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <div className="relative">
        {/* Left icon */}
        {icon && (
          <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
            {icon}
          </span>
        )}

<input
  id={inputId}
  className={`
    w-full py-2 rounded-md border shadow-sm
    bg-white

    text-gray-900
    placeholder-gray-400

    focus:outline-none
    focus:ring-2 focus:ring-yellow-500
    focus:border-yellow-500

    disabled:bg-gray-100
    disabled:text-gray-400

    ${icon ? 'pl-10' : 'pl-3'}
    ${actionIcon ? 'pr-10' : 'pr-3'}
    ${error ? 'border-red-500 text-red-700 placeholder-red-400' : 'border-gray-300'}

    ${className}
  `}
  {...props}
/>

        {/* Right action icon */}
        {actionIcon && (
          <span className="absolute inset-y-0 right-3 flex items-center">
            {actionIcon}
          </span>
        )}
      </div>

      {error && (
        <p className="text-sm text-pink-500 font-medium">{error}</p>
      )}

      {helperText && !error && (
        <p className="text-sm text-gray-600">{helperText}</p>
      )}
    </div>
  );
}