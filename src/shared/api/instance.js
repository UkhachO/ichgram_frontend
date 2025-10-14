import axios from 'axios';

export const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
});

export const setToken = (token) => {
  if (token) instance.defaults.headers.Authorization = `Bearer ${token}`;
  else delete instance.defaults.headers.Authorization;
};

instance.interceptors.response.use(
  (r) => r,
  (e) => {
    if (e?.response?.status === 401) setToken(null);
    return Promise.reject(e);
  }
);
