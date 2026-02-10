'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { AnalyticsCharts } from '@/components/charts/analytics-charts';
import type { TimePeriod } from '@/types';

export default function AnalyticsPage() {
  const { user } = useAuthStore();
  const [period, setPeriod] = useState<TimePeriod>('week');

  // Проверка доступа для гостей (только просмотр)
  const canViewFullAnalytics = user?.roles?.some(
    (r) => r.role_name.toLowerCase() === 'admin' || r.role_name.toLowerCase() === 'instructor',
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Аналитика</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Анализ работы светильников и статистика использования
          </p>
        </div>

        {/* Фильтр по периоду */}
        <div className="mb-6 flex flex-wrap gap-4">
          <button
            onClick={() => setPeriod('day')}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              period === 'day'
                ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}>
            День
          </button>
          <button
            onClick={() => setPeriod('week')}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              period === 'week'
                ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}>
            Неделя
          </button>
          <button
            onClick={() => setPeriod('month')}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              period === 'month'
                ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}>
            Месяц
          </button>
        </div>

        {/* Уведомление о правах доступа */}
        {!canViewFullAnalytics && (
          <div className="mb-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              Вы просматриваете базовую аналитику. Для доступа к полной аналитике обратитесь к
              администратору.
            </p>
          </div>
        )}

        <div className="mx-auto max-w-7xl">
          <AnalyticsCharts period={period} />
        </div>
      </div>
    </div>
  );
}
