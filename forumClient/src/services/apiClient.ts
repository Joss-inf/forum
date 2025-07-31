// src/services/apiClient.ts
import axios from 'axios';
import { useAuthStore } from '@/stores/auth';
const API_URL = import.meta.env.VITE_API_URL;
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

apiClient.interceptors.request.use(config => {
  // Pinia n'est pas disponible avant que l'app soit montée,
  // donc on ne peut pas l'appeler ici directement.
  // On récupère le token depuis le localStorage, qui est synchrone.
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;