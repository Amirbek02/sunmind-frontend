import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Форматирование даты
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

// Генерация mock данных для аналитики
export function generateMockAnalyticsData(days: number = 30): Array<{
  date: string;
  activity: number;
  energy: number;
  plastic: number;
}> {
  const data: Array<{
    date: string;
    activity: number;
    energy: number;
    plastic: number;
  }> = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toISOString().split('T')[0],
      activity: Math.floor(Math.random() * 50) + 10,
      energy: Math.floor(Math.random() * 20) + 5,
      plastic: Math.floor(Math.random() * 10) + 2,
    });
  }

  return data;
}
