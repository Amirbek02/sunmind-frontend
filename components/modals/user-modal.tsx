'use client';

import { User } from '@/types';

interface UserModalProps {
  user: User;
  onClose: () => void;
  onLogout: () => void;
}

const roleLabels: Record<User['role'], string> = {
  guest: 'Гость',
  admin: 'Администратор',
  instructor: 'Инструктор',
};

export function UserModal({ user, onClose, onLogout }: UserModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end-safe justify-end bg-black/50 p-4"
      onClick={onClose}>
      <div
        className="w-full mt-10 max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800"
        onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Профиль пользователя
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700">
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Имя</label>
            <p className="mt-1 text-gray-900 dark:text-white">{user.name}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <p className="mt-1 text-gray-900 dark:text-white">{user.email}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Роль</label>
            <p className="mt-1 text-gray-900 dark:text-white">{roleLabels[user.role]}</p>
          </div>

          <div className="pt-4">
            <button
              onClick={onLogout}
              className="w-full rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700">
              Выход
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
