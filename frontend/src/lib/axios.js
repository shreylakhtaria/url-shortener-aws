import axios from 'axios';
import Cookies from 'js-cookie';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getShortLinkBaseUrl = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  return apiUrl.replace('/api', '');
};
apiClient.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const res = await axios.post(
          `${apiClient.defaults.baseURL}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        if (res.data?.data?.token) {
          Cookies.set('token', res.data.data.token);
          apiClient.defaults.headers.common['Authorization'] = `Bearer ${res.data.data.token}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        Cookies.remove('token');
        Cookies.remove('user');
        if (typeof window !== 'undefined') {
            window.location.href = '/auth';
        }
      }
    }
    return Promise.reject(error);
  }
);
