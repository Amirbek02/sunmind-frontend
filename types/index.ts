// Типы пользователей и ролей
export type UserRole = 'guest' | 'admin' | 'instructor' | 'user';

export interface Role {
  id: number;
  role_name: string; // "USER", "ADMIN"
  description: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  roles: Role[];
  created_at?: string;
}

// Настройки светильника
export type LightMode = 'economy' | 'maximum' | 'default' | 'custom';

export interface LightSettings {
  isOn: boolean;
  brightness: number; // 0-100
  mode: LightMode;
  customSettings?: {
    brightness: number;
    colorTemperature?: number;
  };
}

// Данные аналитики
export interface ActivityData {
  date: string;
  activity: number; // количество людей
}

export interface EnergyData {
  date: string;
  energy: number; // кВт·ч
}

export interface PlasticData {
  date: string;
  plastic: number; // кг
}

export interface AnalyticsData {
  activity: ActivityData[];
  energy: EnergyData[];
  plastic: PlasticData[];
}

// Период для фильтрации
export type TimePeriod = 'day' | 'week' | 'month';

// Отзыв
export interface Review {
  id: string;
  author: string;
  text: string;
  rating: number;
  date: string;
}

export interface NewReview {
  author: string;
  text: string;
  rating: number;
  date: string;
}
