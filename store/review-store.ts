import { apiClient } from '@/lib/api/client';
import { Review } from '@/types';
import { create } from 'zustand';

interface ReviewState {
  reviews: Map<string, Review>;
  setReviews: (reviews: Review[]) => void;
  addReview: (review: Review) => Promise<void>;
  fetchReviews: () => Promise<void>;
}

export const useReviewStore = create<ReviewState>((set, get) => ({
  reviews: new Map(),

  // Загрузка отзывов с сервера
  fetchReviews: async () => {
    try {
      // Предполагаем, что у вас есть метод для получения отзывов
      const reviews = await apiClient.getReviews();
      const reviewsMap = new Map(reviews.map((r) => [r.id, r]));
      set({ reviews: reviewsMap });
    } catch (error) {
      console.error('Ошибка при загрузке отзывов:', error);
    }
  },

  setReviews: (reviews: Review[]) => {
    const reviewsMap = new Map(reviews.map((r) => [r.id, r]));
    set({ reviews: reviewsMap });
  },

  // Асинхронное добавление отзыва с сохранением на сервере
  addReview: async (review: Review) => {
    try {
      // Сохраняем отзыв на сервере
      const savedReview = await apiClient.addReview(review);

      // Обновляем локальное состояние
      set((state) => {
        const newReviews = new Map(state.reviews);
        newReviews.set(savedReview.id, savedReview);
        return { reviews: newReviews };
      });
    } catch (error) {
      console.error('Ошибка при сохранении отзыва:', error);
      throw error; // Пробрасываем ошибку для обработки в компоненте
    }
  },
}));
