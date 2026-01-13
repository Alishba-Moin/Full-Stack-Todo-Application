'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, getUserId } from '@/lib/api';
import type { Task } from '@/lib/types';
import DeleteConfirmModal from './DeleteConfirmModal';
import { PencilSquareIcon, TrashIcon, CheckIcon } from '@heroicons/react/24/outline';

interface TaskItemProps {
  task: Task;
  onUpdate: (task: Task) => void;
  onDelete: (taskId: number) => void;
}

export default function TaskItem({ task, onUpdate, onDelete }: TaskItemProps) {
  const router = useRouter();
  const [isToggling, setIsToggling] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleToggleComplete = async () => {
    const userId = getUserId();
    if (!userId) return;

    setIsToggling(true);
    try {
      const updatedTask = await api.patchTask(userId, task.id, {
        completed: !task.completed,
      });
      onUpdate(updatedTask);
    } finally {
      setIsToggling(false);
    }
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
        <div className="flex gap-4 items-start">
          {/* Checkbox */}
          <button
            onClick={handleToggleComplete}
            disabled={isToggling}
            className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition
              ${task.completed
                ? 'bg-yellow-400 border-yellow-400'
                : 'border-gray-300 hover:border-yellow-400'}`}
          >
            {task.completed && <CheckIcon className="w-4 h-4 text-white" />}
          </button>

          {/* Content */}
          <div className="flex-1">
            <h3
              className={`text-lg font-semibold ${
                task.completed ? 'line-through text-gray-400' : 'text-gray-900'
              }`}
            >
              {task.title}
            </h3>

            {task.description && (
              <p className="mt-1 text-sm text-gray-600">
                {task.description}
              </p>
            )}

            <p className="mt-3 text-xs text-gray-400">
              Created {formatDate(task.created_at)}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={() => router.push(`/tasks/${task.id}`)}
              className="p-2 rounded-lg hover:bg-yellow-50 text-yellow-600"
              aria-label="Edit task"
            >
              <PencilSquareIcon className="w-5 h-5" />
            </button>

            <button
              onClick={() => setShowDeleteModal(true)}
              className="p-2 rounded-lg hover:bg-pink-50 text-pink-500"
              aria-label="Delete task"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={async () => {
          const userId = getUserId();
          if (!userId) return;
          await api.deleteTask(userId, task.id);
          onDelete(task.id);
          setShowDeleteModal(false);
        }}
        taskTitle={task.title}
      />
    </>
  );
}
