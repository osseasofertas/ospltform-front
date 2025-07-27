import axios from 'axios';

const api = axios.create({
  baseURL: 'https://platform-production-f017.up.railway.app',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // If error is 401 (Unauthorized), handle token expiration
    if (error.response?.status === 401) {
      console.log('Token expired, logging out user');
      
      // Clear tokens
      localStorage.removeItem('access_token');
      
      // Dispatch custom event to notify app about logout
      window.dispatchEvent(new CustomEvent('tokenExpired', {
        detail: { message: 'Your session has expired. Please log in again.' }
      }));
    }

    return Promise.reject(error);
  }
);

export default api;
