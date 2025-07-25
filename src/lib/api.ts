import axios from 'axios';

const api = axios.create({
  // Use Vercel proxy in production, direct URL in development
  baseURL: import.meta.env.PROD 
    ? '/api' 
    : 'https://platform-production-f017.up.railway.app',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
