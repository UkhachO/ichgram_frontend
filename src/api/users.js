// src/api/users.js
import { apiFetch } from './client';

// Я: поточний користувач
export async function getMe() {
  return apiFetch('/me');
}

// Інший користувач (для /profile/:id)
export async function getUserById(id) {
  return apiFetch(`/users/${id}`);
}

// Оновлення власного профілю
export async function updateMe(payload) {
  return apiFetch('/me', {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

// Аплоуд аватара -> повертає { ok, url, publicId }
export async function uploadAvatar(file) {
  const form = new FormData();
  form.append('file', file);
  return apiFetch('/files/avatar', {
    method: 'POST',
    body: form,
  });
}

// Пости користувача
export async function getUserPosts({ authorId, page = 1, limit = 12 }) {
  return apiFetch(`/posts?author=${authorId}&page=${page}&limit=${limit}`);
}
