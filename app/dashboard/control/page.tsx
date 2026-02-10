'use client';

import { ProtectedRoute } from '@/components/protected-route';
import { LightControl } from '@/components/controls/light-control';

export default function ControlPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Управление светильником
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Управляйте настройками вашего интеллектуального светильника SunMind
            </p>
          </div>

          <div className="mx-auto max-w-4xl">
            <LightControl />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
