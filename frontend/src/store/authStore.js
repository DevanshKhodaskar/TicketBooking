import { create } from 'zustand';
import api from '../services/api';

const normalizeUser = (user = {}) => ({
  ...user,
  userId: user.userId ?? user.user_id ?? null,
  user_id: user.user_id ?? user.userId ?? null,
});

const extractUserIdFromToken = (token = '') => {
  if (!token) {
    return '';
  }

  return token.startsWith('jwt-token-') ? token.slice('jwt-token-'.length) : token;
};

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  loading: false,
  error: null,

  signup: async (name, password) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/auth/signup', { name, password });
      const normalizedUser = normalizeUser(response.data.data);

      set({ 
        user: normalizedUser,
        token: normalizedUser.userId,
        loading: false 
      });
      localStorage.setItem('token', normalizedUser.userId ?? '');
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
      const token = response.data.data;
      const userId = extractUserIdFromToken(token);

      set({ 
        token,
        loading: false 
      });
      localStorage.setItem('token', token);

      const userResponse = await api.get(`/auth/user/${userId}`);
      const normalizedUser = normalizeUser(userResponse.data.data);

      set({ user: normalizedUser });
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

  checkAuth: () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      set({ token, user: normalizeUser(JSON.parse(user)) });
    }
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;
