const RAW = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(
  /\/+$/,
  ''
);
const API_ROOT = RAW.endsWith('/api') ? RAW : `${RAW}/api`;
export const apiUrl = (path) =>
  `${API_ROOT}${path.startsWith('/') ? path : '/' + path}`;
