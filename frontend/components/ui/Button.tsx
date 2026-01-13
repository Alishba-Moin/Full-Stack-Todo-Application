// Reusable Button component 

import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  isLoading?: boolean;
  children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: `
    bg-yellow-400 text-gray-900
    hover:bg-yellow-500
    focus:ring-yellow-400
  `,
  secondary: `
    bg-gray-100 text-gray-800
    hover:bg-gray-200
    focus:ring-gray-300
  `,
  danger: `
    bg-pink-500 text-white
    hover:bg-pink-600
    focus:ring-pink-400
  `,
};

export function Button({
  variant = 'primary',
  isLoading = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || isLoading}
      className={`
        inline-flex items-center justify-center gap-2
        px-4 py-2.5 rounded-xl
        font-medium
        transition-all duration-200
        focus:outline-none focus:ring-2
        active:scale-[0.98]
        disabled:opacity-50 disabled:cursor-not-allowed

        ${variantStyles[variant]}
        ${className}
      `}
      {...props}
    >
      {isLoading ? (
        <>
          <span
            className="
              h-4 w-4 rounded-full
              border-2 border-white/40
              border-t-white
              animate-spin
            "
          />
          <span className="text-sm">Loading...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
