'use client';

// Delete confirmation modal - Client Component

import { Button } from './ui/Button';
import { TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  taskTitle: string;
}

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  taskTitle,
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-200 animate-scaleIn">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
          aria-label="Close modal"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>

        {/* Icon */}
        <div className="flex items-center justify-center mt-8">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-pink-100">
            <TrashIcon className="w-8 h-8 text-pink-600" />
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pt-5 pb-6 text-center space-y-3">
          <h3 className="text-xl font-semibold text-gray-900">
            Delete this task?
          </h3>

          <p className="text-sm text-gray-600 leading-relaxed">
            You’re about to permanently delete
            <span className="block mt-1 font-medium text-gray-900">
              “{taskTitle}”
            </span>
          </p>

          {/* Warning badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-medium">
            ⚠ This action cannot be undone
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 flex gap-3">
          <Button
            variant="secondary"
            onClick={onClose}
            className="w-full"
          >
            Cancel
          </Button>

          <Button
            onClick={onConfirm}
            className="w-full bg-pink-600 hover:bg-pink-700 text-white"
          >
            Delete Task
          </Button>
        </div>
      </div>
    </div>
  );
}
