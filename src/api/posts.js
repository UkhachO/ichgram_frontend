import { apiFetch } from './client';

export async function fetchPosts({ page = 1, limit = 12, author } = {}) {
  const params = new URLSearchParams();
  params.set('page', String(page));
  params.set('limit', String(limit));
  if (author) params.set('author', String(author));

  const data = await apiFetch(`/posts?${params.toString()}`, {
    credentials: 'include',
  });

  const root = data?.data ?? data ?? {};
  const items = Array.isArray(root.items)
    ? root.items
    : Array.isArray(data?.items)
    ? data.items
    : [];

  const total =
    Number(root.total ?? data?.total ?? items.length) || items.length;
  const pages = Number(root.pages ?? data?.pages ?? 1) || 1;

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
