import { create } from 'zustand';
import { apiClient } from '@/lib/axios';
import Cookies from 'js-cookie';

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  
  initialize: () => {
    const token = Cookies.get('token');
    const userStr = Cookies.get('user');
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        set({ user, isAuthenticated: true, isLoading: false });
      } catch(e) {
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    } else {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  updateUser: (updatedUser) => {
    Cookies.set('user', JSON.stringify(updatedUser));
    set({ user: updatedUser });
  },

  login: async (email, password) => {
    const res = await apiClient.post('/auth/login', { email, password });
    return res.data;
  },

  verifyOtp: async (email, otp) => {
    const res = await apiClient.post('/auth/verify-otp', { email, otp });
    const { token, user } = res.data.data;
    Cookies.set('token', token);
    Cookies.set('user', JSON.stringify(user));
    set({ user, isAuthenticated: true });
    return res.data;
  },

  register: async (name, email, password) => {
    const res = await apiClient.post('/auth/register', { name, email, password });
    return res.data;
  },

  logout: async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (e) {
      console.error(e);
    }
    Cookies.remove('token');
    Cookies.remove('user');
    set({ user: null, isAuthenticated: false });
    
    // Redirect to login page
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  }
}));
