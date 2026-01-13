'use client';

// Global loading state – 2026 theme

import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        {/* Spinner with theme color */}
        <LoadingSpinner size="lg" className="text-yellow-500" />

        {/* Friendly loading message */}
        <p className="mt-4 text-gray-600 text-sm sm:text-base">
          Hang tight, we’re getting everything ready for you...
        </p>

        {/* Optional animated dots for extra flair */}
        <div className="mt-2 flex justify-center space-x-1">
          <span className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce animation-delay-75"></span>
          <span className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce animation-delay-150"></span>
          <span className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce animation-delay-225"></span>
        </div>
      </div>
    </div>
  );
}
