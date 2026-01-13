'use client';

// Create new task page 

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { isAuthenticated } from '@/lib/auth';
import TaskForm from '@/components/TaskForm';

export default function NewTaskPage() {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
    }
  }, [router]);

  if (!isAuthenticated()) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="
                p-2 rounded-lg
                text-gray-500 hover:text-gray-900
                hover:bg-gray-100
                transition
              "
            >
              <svg
                className="w-5 h-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>

            <h1 className="text-xl font-semibold text-gray-900">
              Create New Task
            </h1>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-10">
        <div
          className="
            bg-white rounded-2xl
            border border-gray-100
            shadow-sm
            p-6 sm:p-8
          "
        >
          <TaskForm />
        </div>
      </main>
    </div>
  );
}
