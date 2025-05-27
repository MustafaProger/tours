import axios, { AxiosError } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Интерфейс для ответа API
interface ApiResponse<T> {
  status: 'success' | 'error';
  data?: T;
  error?: string;
}

export interface Booking {
  _id: string;
  tour: {
    _id: string;
    title: string;
    name?: string;
    price: number;
    image?: string;
    imageCover?: string;
    date: string;
    duration: string;
    location: string;
    description?: string;
  };
  user: string;
  price: number;
  createdAt: Date;
  paid: boolean;
  date: Date;
}

export interface PaymentData {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardHolder: string;
  email: string;
  phone: string;
}

// Обработчик ошибок API
const handleApiError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiResponse<any>>;
    if (axiosError.response?.data?.error) {
      throw new Error(axiosError.response.data.error);
    }
    if (axiosError.response?.status === 401) {
      throw new Error('Необходима авторизация');
    }
    if (axiosError.response?.status === 404) {
      throw new Error('Бронирование не найдено');
    }
    if (axiosError.response?.status === 400) {
      throw new Error('Неверные данные для оплаты');
    }
  }
  throw new Error('Произошла ошибка при обработке запроса');
};

export const bookingService = {
  // Создать новое бронирование
  createBooking: async (tourId: string): Promise<ApiResponse<Booking>> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Необходима авторизация');
      }
      const response = await api.post<ApiResponse<Booking>>(
        '/bookings',
        { tourId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Получить все бронирования пользователя
  getMyBookings: async (): Promise<Booking[]> => {
    try {
      console.log('DEBUG: Starting getMyBookings request');
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Необходима авторизация');
      }

      const response = await api.get<ApiResponse<Booking[]>>('/bookings/my-bookings', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('DEBUG: Raw API response:', {
        status: response.data.status,
        hasData: !!response.data.data,
        dataLength: response.data.data?.length
      });

      if (!response.data.data) {
        console.log('DEBUG: No bookings data in response');
        return [];
      }

      const bookings = response.data.data;
      
      console.log('DEBUG: Processed bookings:', {
        total: bookings.length,
        paidBookings: bookings.filter(b => b.paid === true).length,
        unpaidBookings: bookings.filter(b => b.paid === false).length,
        sample: bookings[0] ? {
          id: bookings[0]._id,
          paid: bookings[0].paid,
          tour: bookings[0].tour?.title,
          price: bookings[0].price
        } : null
      });

      return bookings;
    } catch (error) {
      console.error('DEBUG: Error in getMyBookings:', error);
      throw handleApiError(error);
    }
  },

  // Отменить бронирование
  cancelBooking: async (bookingId: string): Promise<ApiResponse<void>> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Необходима авторизация');
      }
      const response = await api.delete<ApiResponse<void>>(`/bookings/${bookingId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Оплатить бронирование
  processPayment: async (bookingId: string, paymentData: PaymentData): Promise<ApiResponse<Booking>> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Необходима авторизация');
      }

      // Валидация данных перед отправкой
      if (!bookingId) {
        throw new Error('Не указан идентификатор бронирования');
      }

      // Удаляем чувствительные данные перед отправкой на сервер
      const { cvv, cardNumber, ...safePaymentData } = paymentData;
      const last4Digits = cardNumber.replace(/\s/g, '').slice(-4);

      const response = await api.post<ApiResponse<Booking>>(
        `/bookings/${bookingId}/pay`,
        {
          ...safePaymentData,
          last4Digits,
          // В реальном приложении здесь должна быть интеграция с платежной системой
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.data || response.data.status === 'error') {
        throw new Error(response.data?.error || 'Ошибка при обработке платежа');
      }

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
}; 