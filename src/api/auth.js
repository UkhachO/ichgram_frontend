import { apiUrl } from '../utils/api.js';

export async function loginApi(emailOrUsername, password) {
  const v = String(emailOrUsername || '').trim();
  const isEmail = v.includes('@');
  const payload = isEmail ? { email: v, password } : { username: v, password };

  const res = await fetch(apiUrl('/auth/login'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    credentials: 'include',
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || 'Login failed');
  return data;
}


export async function forgotPassword(email) {
  const res = await fetch(apiUrl('/auth/password/forgot'), {
    // <- /auth/...
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
    credentials: 'include',
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || 'Failed to send reset email');
  return data;
}

export async function resetPassword({ token, password }) {
  const res = await fetch(apiUrl('/auth/password/reset'), {
    // <- /auth/...
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, password }),
    credentials: 'include',
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || 'Failed to reset password');
  return data;
}
