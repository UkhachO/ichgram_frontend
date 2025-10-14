// src/api/client.js
const RAW = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(
  /\/+$/,
  ''
);
export const API_ROOT = RAW.endsWith('/api') ? RAW : `${RAW}/api`;

function safeJsonParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export async function apiFetch(path, options = {}) {
  const url = `${API_ROOT}${path.startsWith('/') ? path : `/${path}`}`;
  const res = await fetch(url, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });

  const contentType = res.headers.get('content-type') || '';
  let data;
  try {
    if (contentType.includes('application/json')) data = await res.json();
    else {
      const text = await res.text();
      data = safeJsonParse(text) ?? { message: text };
    }
  } catch {
    data = { message: 'Failed to parse response' };
  }

  if (!res.ok) {
    // спеціальний код для 401
    if (res.status === 401) throw new Error('AUTH_REQUIRED');
    const msg =
      typeof data === 'string' ? data : data?.message || 'Request failed';
    throw new Error(msg);
  }

  return data;
}
