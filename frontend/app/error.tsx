'use client';

// Global error boundary 

import { useEffect } from 'react';
import { Button } from '../components/ui/Button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error for debugging / monitoring
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div
        className="
          w-full max-w-md
          bg-white
          border border-gray-100
          rounded-2xl
          shadow-sm
          px-6 py-8 sm:px-8
          text-center
        "
      >
        {/* Icon */}
        <div className="mb-6">
          <div
            className="
              mx-auto
              h-14 w-14
              rounded-full
              bg-yellow-50
              flex items-center justify-center
            "
          >
            <svg
              className="h-7 w-7 text-yellow-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M5.07 19h13.86c1.54 0 2.5-1.67 1.73-3L13.73 4c-.77-1.33-2.69-1.33-3.46 0L3.34 16c-.77 1.33.19 3 1.73 3z"
              />
            </svg>
          </div>
        </div>

        {/* Text */}
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Oops, something broke
        </h2>

        <p className="text-sm text-gray-600 leading-relaxed mb-6">
          This wasn’t supposed to happen.  
          Don’t worry — your data is safe. Try again or head back to your
          dashboard.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={reset} className="w-full sm:w-auto">
            Try again
          </Button>

          <Button
            variant="secondary"
            className="w-full sm:w-auto"
            onClick={() => (window.location.href = '/')}
          >
            Go to dashboard
          </Button>
        </div>

        {/* Optional debug hint (hidden visually, useful for devs) */}
        {process.env.NODE_ENV === 'development' && (
          <p className="mt-6 text-xs text-gray-400 break-all">
            {error.message}
          </p>
        )}
      </div>
    </div>
  );
}
