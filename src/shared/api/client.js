// src/shared/api/client.js
import axios from 'axios';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
  withCredentials: true, // щоб куки з токеном їхали
});

client.interceptors.response.use(
  (r) => r,
  (err) => {
    const message =
      err.response?.data?.message || err.message || 'Request failed';
    return Promise.reject(new Error(message));
  }
);

export default client;
