'use client';

import { useState } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { TimePeriod } from '@/types';
import { generateMockAnalyticsData } from '@/lib/utils';

const COLORS = ['#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ef4444'];

interface AnalyticsChartsProps {
  period: TimePeriod;
}

export function AnalyticsCharts({ period }: AnalyticsChartsProps) {
  const days = period === 'day' ? 1 : period === 'week' ? 7 : 30;
  const data = generateMockAnalyticsData(days);

  // Данные для круговой диаграммы (суммарные значения)
  const pieData = [
    {
      name: 'Энергия',
      value: data.reduce((sum, d) => sum + d.energy, 0),
    },
    {
      name: 'Пластик',
      value: data.reduce((sum, d) => sum + d.plastic, 0),
    },
    {
      name: 'Активность',
      value: data.reduce((sum, d) => sum + d.activity, 0),
    },
  ];

  return (
    <div className="space-y-8">
      {/* График активности людей */}
      <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Активность людей
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="date"
              stroke="#6b7280"
              fontSize={12}
              tickFormatter={(value) => {
                const date = new Date(value);
                return period === 'day'
                  ? date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
                  : date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
              }}
            />
            <YAxis stroke="#6b7280" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="activity"
              stroke="#3b82f6"
              strokeWidth={2}
              name="Активность"
              dot={{ fill: '#3b82f6', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* График экономии энергии */}
      <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Экономия энергии (кВт·ч)
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="date"
              stroke="#6b7280"
              fontSize={12}
              tickFormatter={(value) => {
                const date = new Date(value);
                return period === 'day'
                  ? date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
                  : date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
              }}
            />
            <YAxis stroke="#6b7280" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Bar dataKey="energy" fill="#10b981" name="Энергия (кВт·ч)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* График переработанного пластика */}
      <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Переработанный пластик (кг)
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="date"
              stroke="#6b7280"
              fontSize={12}
              tickFormatter={(value) => {
                const date = new Date(value);
                return period === 'day'
                  ? date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
                  : date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
              }}
            />
            <YAxis stroke="#6b7280" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="plastic"
              stroke="#8b5cf6"
              strokeWidth={2}
              name="Пластик (кг)"
              dot={{ fill: '#8b5cf6', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Круговая диаграмма сравнения */}
      <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Сравнение показателей
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) =>
                `${name} ${((percent || 0) * 100).toFixed(0)}%`
              }
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
