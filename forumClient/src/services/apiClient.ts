// src/services/apiClient.ts
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

function getCookie(name: string) {
  const cookie = document.cookie
    .split('; ')
    .find(row => row.startsWith(name + '='));
  return cookie ? decodeURIComponent(cookie.split('=')[1]) : null;
}

apiClient.interceptors.request.use(config => {
  const csrfToken = getCookie('csrf_token');
  if (csrfToken && config.method && config.method.toLowerCase() !== 'get') {
    config.headers['X-CSRF-Token'] = csrfToken;
    
  }
  return config;
});

export default apiClient;