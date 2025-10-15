import { apiFetch } from './client';

export async function toggleLike(postId) {
  if (!postId) throw new Error('postId is required');
  const res = await apiFetch(`/posts/${postId}/likes/toggle`, {
    method: 'POST',
  });
  return res?.data ?? res;
}

export async function listLikes(postId, { page, limit } = {}) {
  if (!postId) throw new Error('postId is required');
  const qs = new URLSearchParams();
  if (page) qs.set('page', page);
  if (limit) qs.set('limit', limit);
  const res = await apiFetch(
    `/posts/${postId}/likes${qs.toString() ? `?${qs}` : ''}`
  );
  return res?.data ?? res;
}

export async function isPostLiked(postId) {
  if (!postId) throw new Error('postId is required');
  const res = await apiFetch(`/posts/${postId}/is-liked`);
  return res?.data ?? res;
}
