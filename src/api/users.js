import { apiFetch } from './client';

export async function getMe() {
  return apiFetch('/auth/me');
}

export async function getUserById(id) {
  return apiFetch(`/users/${id}`);
}

export async function updateMe(payload) {
  return apiFetch('/auth/me', {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export async function uploadAvatar(file) {
  const form = new FormData();
  form.append('file', file);
  return apiFetch('/files/avatar', {
    method: 'POST',
    body: form,
  });
}

export async function getUserPosts({ authorId, page = 1, limit = 12 }) {
  return apiFetch(`/posts?author=${authorId}&page=${page}&limit=${limit}`);
}
