'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api, getUserId } from '@/lib/api';
import type { Task, TaskCreateRequest, TaskUpdateRequest } from '@/lib/types';
import { Input } from './ui/Input';
import { ErrorMessage } from './ui/ErrorMessage';
import { PlusIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface TaskFormProps {
  task?: Task;
  onSuccess?: () => void;
}

export default function TaskForm({ task, onSuccess }: TaskFormProps) {
  const router = useRouter();
  const isEditMode = !!task;

  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [generalError, setGeneralError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
    }
  }, [task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError('');

    const userId = getUserId();
    if (!userId) {
      setGeneralError('User not authenticated');
      return;
    }

    setIsLoading(true);

    try {
      if (isEditMode && task) {
        const updateData: TaskUpdateRequest = {
          title: title.trim(),
          description: description.trim() || null,
          completed: task.completed,
        };
        await api.updateTask(userId, task.id, updateData);
      } else {
        const createData: TaskCreateRequest = {
          title: title.trim(),
          description: description.trim() || undefined,
        };
        await api.createTask(userId, createData);
      }

      onSuccess ? onSuccess() : router.push('/');
    } catch (err) {
      setGeneralError('Failed to save task');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm space-y-6"
    >
      {generalError && <ErrorMessage message={generalError} />}

      <Input
        label="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="What needs to be done?"
        disabled={isLoading}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description (optional)
        </label>
        <textarea
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
          placeholder="Add more details…"
        />
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => router.push('/')}
          className="px-5 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 rounded-xl bg-yellow-500 hover:bg-yellow-600 text-white font-semibold flex items-center gap-2"
        >
          {isEditMode ? (
            <>
              <CheckCircleIcon className="w-5 h-5" /> Save Changes
            </>
          ) : (
            <>
              <PlusIcon className="w-5 h-5" /> Create Task
            </>
          )}
        </button>
      </div>
    </form>
  );
}
