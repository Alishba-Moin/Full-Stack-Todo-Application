'use client';

import Link from 'next/link';
import { PlusIcon, SparklesIcon } from '@heroicons/react/24/outline';

export default function EmptyState() {
  return (
    <div
      className="
        flex flex-col items-center justify-center
        px-4 text-center space-y-6
        overflow-hidden
      "
    >
      {/* Icon */}
      <div className="flex items-center justify-center w-24 h-24 rounded-2xl bg-yellow-500 shadow-md">
        <SparklesIcon className="w-10 h-10 text-white" />
      </div>

      {/* Heading */}
      <h3 className="text-2xl font-bold text-gray-900">
        No tasks yet
      </h3>

      {/* Text */}
      <p className="text-gray-600 max-w-md">
        You haven’t created any tasks yet. Start organizing your day and stay productive.
      </p>

      {/* Button */}
      <Link
        href="/tasks/new"
        className="
          inline-flex items-center gap-2
          px-6 py-3 rounded-xl
          bg-yellow-500 hover:bg-yellow-600
          text-white font-semibold
          transition
        "
      >
        <PlusIcon className="w-5 h-5" />
        Create your first task
      </Link>

      <p className="text-sm text-gray-400">
        ✨ Small steps lead to big wins
      </p>
    </div>
  );
}
