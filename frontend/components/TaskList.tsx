'use client';

import { useState, useEffect } from 'react';
import { api, getUserId } from '@/lib/api';
import type { Task } from '@/lib/types';
import TaskItem from './TaskItem';
import { LoadingSpinner } from './ui/LoadingSpinner';
import { ErrorMessage } from './ui/ErrorMessage';
import EmptyState from './EmptyState';

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadTasks = async () => {
    const userId = getUserId();
    if (!userId) {
      setError('User not authenticated');
      setIsLoading(false);
      return;
    }

    try {
      const fetchedTasks = await api.listTasks(userId);
      if (!Array.isArray(fetchedTasks)) {
        setError('Invalid response from server');
        return;
      }
      setTasks(fetchedTasks);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tasks');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleTaskUpdate = (updatedTask: Task) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  };

  const handleTaskDelete = (taskId: number) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  };

  if (isLoading) {
    return (
      <div className="py-16 flex justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (tasks.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onUpdate={handleTaskUpdate}
          onDelete={handleTaskDelete}
        />
      ))}
    </div>
  );
}
