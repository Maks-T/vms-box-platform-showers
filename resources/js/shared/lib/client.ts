import axios, {AxiosInstance, InternalAxiosRequestConfig, AxiosError, AxiosResponse} from 'axios';
import {toast} from 'sonner';
import {t} from '@/shared/i18n/useTranslation';

export interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  skipErrorHandler?: boolean;
}

const client: AxiosInstance = axios.create({
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Accept': 'application/json',
  },
  // withCredentials: true,
});

// Интерцептор запросов (Добавляет заголовки динамически)
client.interceptors.request.use((config: CustomAxiosRequestConfig) => {
  // актуальный язык
  const locale = localStorage.getItem('app_locale') || 'en';

  config.headers['Accept-Language'] = locale;
  config.headers['X-Sales-Channel'] = 'widget'; 

  return config;
});

// Интерцептор ответов (Глобальная обработка ошибок)
client.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    const config = error.config as CustomAxiosRequestConfig;

    // Если при вызове передали { skipErrorHandler: true }, то игнорируем ошибку здесь
    if (config?.skipErrorHandler) {
      return Promise.reject(error);
    }

    // Глобальные уведомления об ошибках через Sonner
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data as any;

      if (status === 404) {
        toast.error(t('error_not_found'));
      } else if (status === 422) {
        toast.error(data.message || t('error_validation'));
      } else if (status >= 500) {
        toast.error(t('error_server'));
      } else {
        toast.error(data.message || t('error_request'));
      }
    } else if (error.request) {
      toast.error(t('error_no_response'));
    } else {
      toast.error(t('error_send'));
    }

    return Promise.reject(error);
  }
);

export default client;
