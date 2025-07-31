// src/store/auth.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Ref, ComputedRef } from 'vue';
import apiClient from '@/services/apiClient';
import router from '@/router';
import type { User, LoginCredentials, RegisterData } from '@/types';

export const useAuthStore = defineStore('auth', () => {
  // --- STATE ---
  const user: Ref<User | null> = ref(JSON.parse(localStorage.getItem('user') || 'null'));
  const token: Ref<string | null> = ref(localStorage.getItem('token'));

  // --- GETTERS ---
  const isAuthenticated: ComputedRef<boolean> = computed(() => !!token.value);

  // --- ACTIONS ---
  function setAuthData(userData: User, userToken: string) {
    user.value = userData;
    token.value = userToken;
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', userToken);
  }

  function clearAuthData() {
    user.value = null;
    token.value = null;
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    router.push('/login');
  }

  async function login(credentials: LoginCredentials) {
    const response = await apiClient.post<{ user: User; token: string }>('/auth/login', credentials);
    setAuthData(response.data.user, response.data.token);
    await router.push('/forum');
  }

  async function register(userData: RegisterData) {
    await apiClient.post('/auth/register', userData);
    await router.push('/login');
  }

  function logout() {
    clearAuthData();
  }
  
  async function checkAuthOnLoad() {
    if (!token.value) return;
    try {
      const response = await apiClient.get<User>('/users/me');
      user.value = response.data;
    } catch (error) {
      console.error("Token invalide, déconnexion.", error);
      clearAuthData();
    }
  }

  return { user, token, isAuthenticated, login, register, logout, checkAuthOnLoad };
});