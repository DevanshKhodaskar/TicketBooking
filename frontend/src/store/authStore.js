import { create } from 'zustand';
import api from '../services/api';

const normalizeUser = (user = {}) => ({
  ...user,
  userId: user.userId ?? user.user_id ?? null,
  user_id: user.user_id ?? user.userId ?? null,
});

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  loading: false,
  error: null,

  signup: async (name, password) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/auth/signup', { name, password });
      const token = response.data.data?.token ?? '';
      const normalizedUser = normalizeUser(response.data.data?.user);

      set({ 
        user: normalizedUser,
        token,
        loading: false 
      });
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(normalizedUser));
      return normalizedUser;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Signup failed';
      set({ error: errorMsg, loading: false });
      throw error;
    }
  },

  login: async (name, password) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/auth/login', { name, password });
      const token = response.data.data?.token ?? '';
      const normalizedUser = normalizeUser(response.data.data?.user);

      set({ 
        user: normalizedUser,
        token,
        loading: false 
      });
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(normalizedUser));
      
      return normalizedUser;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Login failed';
      set({ user: null, token: null, error: errorMsg, loading: false });
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      throw error;
    }
  },

  logout: () => {
    set({ user: null, token: null, error: null });
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  checkAuth: async () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (token && user) {
      set({ token, user: normalizeUser(JSON.parse(user)) });
      return;
    }

    if (!token) {
      return;
    }

    try {
      const response = await api.get('/auth/me');
      const normalizedUser = normalizeUser(response.data.data);
      set({ token, user: normalizedUser });
      localStorage.setItem('user', JSON.stringify(normalizedUser));
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      set({ user: null, token: null });
    }
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;
