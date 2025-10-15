import { useEffect, useMemo, useRef, useState } from 'react';
import styles from './PostViewer.module.css';

import CloseButton from '../../../shared/ui/CloseButton/CloseButton';
import { toggleLike } from '../../../api/likes';
import { addComment, listComments } from '../../../api/comments';

const CMT_LIMIT = 20;

function Heart({ filled }) {
  return filled ? (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path
        d="M12 21s-6.7-4.2-9.4-7.2C.5 11.5 1 8.5 3 7a5 5 0 0 1 6 0c.4.3.7.6 1 1 .3-.4.6-.7 1-1a5 5 0 0 1 6 0c2 1.5 2.5 4.5.4 6.8C18.7 16.8 12 21 12 21z"
        fill="currentColor"
      />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path
        d="M16.5 3.5a4.9 4.9 0 0 0-3.5 1.5l-1 1-1-1A4.9 4.9 0 0 0 7.5 3.5 5 5 0 0 0 3 8.5c0 1.4.6 2.7 1.6 3.7C7.3 14.9 12 18 12 18s4.8-3.1 7.4-5.8A5.3 5.3 0 0 0 21 8.5a5 5 0 0 0-4.5-5z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CommentIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path
        d="M21 15a4 4 0 0 1-4 4H9l-6 3V5a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v10z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function PostViewer({
  open,
  onClose,
  post: outerPost,
  onUpdated,
}) {
  const [post, setPost] = useState(outerPost);
  useEffect(() => setPost(outerPost), [outerPost?.id || outerPost?._id, open]);

  const [liked, setLiked] = useState(Boolean(outerPost?.isLiked));
  const [likes, setLikes] = useState(Number(outerPost?.likes || 0));
  useEffect(() => {
    setLiked(Boolean(outerPost?.isLiked));
    setLikes(Number(outerPost?.likes || 0));
  }, [outerPost?.isLiked, outerPost?.likes]);

  const [comments, setComments] = useState([]);
  const [cPage, setCPage] = useState(1);
  const [cPages, setCPages] = useState(1);
  const [cLoading, setCLoading] = useState(false);
  const [cError, setCError] = useState('');
  const canLoadMore = cPage < cPages && !cLoading;
  const sentinelRef = useRef(null);

  const postId = useMemo(() => String(post?._id ?? post?.id ?? ''), [post]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open || !postId) return;
    (async () => {
      try {
        setCLoading(true);
        setCError('');
        const data = await listComments(postId, { page: 1, limit: CMT_LIMIT });
        const items = data?.items ?? data?.data?.items ?? [];
        const pages = Number(data?.pages ?? data?.data?.pages ?? 1) || 1;
        setComments(items);
        setCPage(1);
        setCPages(pages);
      } catch (e) {
        setCError(e?.message || 'Failed to load comments');
      } finally {
        setCLoading(false);
      }
    })();
  }, [open, postId]);

  useEffect(() => {
    if (!open || !sentinelRef.current) return;
    const el = sentinelRef.current;
    let pending = false;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.some((e) => e.isIntersecting);
        if (visible && canLoadMore && !pending) {
          pending = true;
          (async () => {
            try {
              setCLoading(true);
              const next = cPage + 1;
              const data = await listComments(postId, {
                page: next,
                limit: CMT_LIMIT,
              });
              const items = data?.items ?? data?.data?.items ?? [];
              setComments((prev) => [...prev, ...items]);
              setCPage(next);
              setCPages(
                Number(data?.pages ?? data?.data?.pages ?? cPages) || cPages
              );
            } catch (e) {
              setCError(e?.message || 'Failed to load comments');
            } finally {
              setCLoading(false);
              setTimeout(() => (pending = false), 50);
            }
          })();
        }
      },
      { rootMargin: '300px 0px 300px 0px' }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [open, cPage, cPages, canLoadMore, postId]);

  const onToggleLike = async () => {
    if (!postId) return;
    const prevLiked = liked;
    const prevLikes = likes;

    setLiked(!prevLiked);
    setLikes((v) => (prevLiked ? Math.max(0, v - 1) : v + 1));
    setPost((p) => ({
      ...p,
      isLiked: !prevLiked,
      likes: prevLiked ? Math.max(0, prevLikes - 1) : prevLikes + 1,
    }));
    onUpdated?.({
      id: postId,
      isLiked: !prevLiked,
      likes: prevLiked ? Math.max(0, prevLikes - 1) : prevLikes + 1,
    });

    try {
      await toggleLike(postId);
    } catch (e) {
      setLiked(prevLiked);
      setLikes(prevLikes);
      setPost((p) => ({ ...p, isLiked: prevLiked, likes: prevLikes }));
      onUpdated?.({ id: postId, isLiked: prevLiked, likes: prevLikes });
    }
  };

  const [draft, setDraft] = useState('');
  const inputRef = useRef(null);

  const submitComment = async () => {
    const text = draft.trim();
    if (!text || !postId) return;

    const optimistic = {
      _id: `tmp_${Date.now()}`,
      postId,
      text,
      createdAt: new Date().toISOString(),
      author: {
        _id: window.__currentUserId || 'me',
        username: window.__currentUsername || 'you',
        avatarUrl: window.__currentAvatar || '',
      },
      _optimistic: true,
    };

    setComments((prev) => [optimistic, ...prev]);
    setDraft('');

    try {
      const data = await addComment(postId, text);
      const saved = data?.comment || data?.data || data;

      setComments((prev) => {
        const copy = [...prev];
        const idx = copy.findIndex((c) => c._id === optimistic._id);
        if (idx !== -1) copy[idx] = saved;
        return copy;
      });
    } catch (e) {
      setComments((prev) => prev.filter((c) => c._id !== optimistic._id));
      setDraft(text);
      inputRef.current?.focus();
    }
  };

  if (!open || !post) return null;

  return (
    <div className={styles.backdrop} onClick={onClose} role="presentation">
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <CloseButton onClick={onClose} className={styles.closeTopRight} />

        <div className={styles.left}>
          <img className={styles.img} src={post.imageUrl} alt="" />
        </div>

        <div className={styles.right}>
          <div className={styles.header}>
            <img
              className={styles.avatar}
              src={post?.author?.avatarUrl}
              alt=""
            />
            <div className={styles.names}>
              <div className={styles.name}>
                {post?.author?.username || 'user'}
              </div>
              <div className={styles.sub}>
                {new Date(post.createdAt).toLocaleString()}
              </div>
            </div>
          </div>

          <div className={styles.commentsArea}>
            {post.description ? (
              <div className={styles.caption}>
                <span className={styles.author}>{post?.author?.username}</span>{' '}
                <span className={styles.text}>{post.description}</span>
              </div>
            ) : null}

            <div className={styles.comments}>
              {comments.map((c) => (
                <div key={c._id} className={styles.comment}>
                  <img
                    className={styles.cAvatar}
                    src={c?.author?.avatarUrl}
                    alt=""
                  />
                  <div className={styles.cBody}>
                    <span className={styles.cAuthor}>
                      {c?.author?.username}
                    </span>{' '}
                    <span className={styles.cText}>{c?.text}</span>
                    <div className={styles.cMeta}>
                      {new Date(c?.createdAt || Date.now()).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}

              <div ref={sentinelRef} />
            </div>

            {cLoading && <div className={styles.cLoading}>Loading…</div>}
            {cError && <div className={styles.cError}>{cError}</div>}
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              className={`${styles.likeBtn} ${liked ? styles.liked : ''}`}
              onClick={onToggleLike}
              aria-pressed={liked}
            >
              <Heart filled={liked} />
            </button>
            <button
              type="button"
              className={styles.commentBtn}
              onClick={() => inputRef.current?.focus()}
            >
              <CommentIcon />
            </button>
          </div>

          <div className={styles.likes}>
            {likes} {likes === 1 ? 'like' : 'likes'}
          </div>

          <div className={styles.addComment}>
            <input
              ref={inputRef}
              className={styles.input}
              type="text"
              placeholder="Add a comment…"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submitComment()}
            />
            <button
              type="button"
              className={styles.postBtn}
              onClick={submitComment}
              disabled={!draft.trim()}
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
