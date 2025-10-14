// src/api/posts.js
import { apiFetch } from './client';

export async function fetchPosts({ page = 1, limit = 12, author } = {}) {
  const params = new URLSearchParams();
  params.set('page', page);
  params.set('limit', limit);
  if (author) params.set('author', author);

  const data = await apiFetch(`/posts?${params.toString()}`);

  // нормалізація: очікуємо { items, total, pages }
  const items = Array.isArray(data?.items)
    ? data.items
    : Array.isArray(data?.data?.items)
    ? data.data.items
    : Array.isArray(data)
    ? data
    : [];

  const total = Number.isFinite(data?.total)
    ? data.total
    : data?.data?.total ?? items.length;
  const pages = Number.isFinite(data?.pages)
    ? data.pages
    : data?.data?.pages ?? 1;

  return { items, total, pages };
}

const ROOT =
  (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(
    /\/+$/,
    ''
  ) + '/api';

export async function createPost({ file, description }) {
  const fd = new FormData();
  if (file) fd.append('file', file);
  if (description) fd.append('description', description);

  const res = await fetch(`${ROOT}/posts`, {
    method: 'POST',
    body: fd,
    credentials: 'include',
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || 'Failed to create post');
  return data?.data || data;
}

export async function updatePost(id, { file, description }) {
  const fd = new FormData();
  if (file) fd.append('file', file);
  if (typeof description === 'string') fd.append('description', description);

  const res = await fetch(`${ROOT}/posts/${id}`, {
    method: 'PATCH',
    body: fd,
    credentials: 'include',
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || 'Failed to update post');
  return data?.data || data;
}

export async function deletePost(id) {
  const res = await fetch(`${ROOT}/posts/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || 'Failed to delete post');
  return data;
}
