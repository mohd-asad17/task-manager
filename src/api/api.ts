import axios from 'axios';

const api = axios.create({
  baseURL: '/',
});

api.interceptors.request.use((config) => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    const { token } = JSON.parse(storedUser);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;
