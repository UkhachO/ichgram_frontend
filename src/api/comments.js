// src/api/comments.js
import { apiFetch } from './client';

// GET /api/posts/:id/comments -> { items, total, page, pages, limit }
export async function listComments(postId, { page = 1, limit = 20 } = {}) {
  const qs = new URLSearchParams({ page, limit });
  const res = await apiFetch(`/posts/${postId}/comments?${qs}`);
  return res?.data ?? res;
}

// POST /api/posts/:id/comments -> створений коментар
export async function addComment(postId, text) {
  const res = await apiFetch(`/posts/${postId}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  return res?.data ?? res;
}

// DELETE /api/comments/:commentId
export async function removeComment(commentId) {
  return apiFetch(`/comments/${commentId}`, { method: 'DELETE' });
}

