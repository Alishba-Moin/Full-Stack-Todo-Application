'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { isAuthenticated } from '@/lib/auth';
import TaskList from '@/components/TaskList';
import { Button } from '@/components/ui/Button';

export default function DashboardPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Ensure client-only rendering
  useEffect(() => {
    setMounted(true);

    if (!isAuthenticated()) {
      router.push('/login');
    }
  }, [router]);

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex justify-between items-center">

          {/* Title */}
          <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center relative shadow-md">
  {/* Animated star inside circle */}
  <svg
    className="w-6 h-6 text-yellow-600 animate-pulse"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z" />
  </svg>

  {/* Optional sparkles */}
  <svg
    className="absolute top-0 left-0 w-2 h-2 text-yellow-400 animate-bounce"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path d="M10 0l1.176 3.618h3.805l-3.08 2.236 1.177 3.618-3.078-2.236-3.079 2.236 1.177-3.618-3.079-2.236h3.804L10 0z" />
  </svg>
</div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              My Tasks
            </h1>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Link href="/tasks/new">
              <Button className="bg-yellow-400 hover:bg-yellow-500 text-black shadow-sm">
                + New Task
              </Button>
            </Link>

            <Button
              variant="secondary"
              className="border border-pink-300 text-pink-600 hover:bg-pink-50"
              onClick={() => {
                const { logout } = require('@/lib/auth');
                logout();
              }}
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* ================= MAIN ================= */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <TaskList />
      </main>
    </div>
  );
}
