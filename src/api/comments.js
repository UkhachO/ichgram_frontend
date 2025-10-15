import { apiFetch } from './client';

export async function listComments(postId, { page = 1, limit = 20 } = {}) {
  const qs = new URLSearchParams({ page, limit });
  const res = await apiFetch(`/posts/${postId}/comments?${qs}`);
  return res?.data ?? res;
}

export async function addComment(postId, text) {
  const res = await apiFetch(`/posts/${postId}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  return res?.data ?? res;
}

export async function removeComment(commentId) {
  return apiFetch(`/comments/${commentId}`, { method: 'DELETE' });
}
