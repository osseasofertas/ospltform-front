import axios from 'axios';

const api = axios.create({
  baseURL: 'https://platform-production-f017.up.railway.app', // ajuste se necessário
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;