import { useEffect, useState } from 'react';
import { Heart, MessageCircle } from 'lucide-react';
import styles from './PostCard.module.css';

import { toggleLike, isPostLiked } from '../../api/likes';
import { listComments, addComment } from '../../api/comments';
import PostActions from '../Posts/PostActions/PostActions';

export default function PostCard({
  post,
  currentUserId,
  onOpen,
  onRemoved,
  onEdit,
}) {
  const postId = String(post?._id ?? post?.id);
  const authorId = post?.author?._id ?? post?.author?.id;
  const isOwner = Boolean(
    authorId && String(authorId) === String(currentUserId)
  );

  const [likes, setLikes] = useState(Number(post?.likes || 0));
  const [liked, setLiked] = useState(
    typeof post?.liked === 'boolean' ? post.liked : undefined
  );

  const [previewComments, setPreviewComments] = useState([]);
  const [commentsTotal, setCommentsTotal] = useState(0);
  const [loadingComments, setLoadingComments] = useState(true);
  const [commentText, setCommentText] = useState('');

  const formatNumber = (n) =>
    new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(
      Number(n || 0)
    );

  const timeAgo = (isoDate) => {
    const d = new Date(isoDate || Date.now());
    const sec = Math.max(1, Math.floor((Date.now() - d.getTime()) / 1000));
    const map = [
      ['y', 60 * 60 * 24 * 365],
      ['mo', 60 * 60 * 24 * 30],
      ['wk', 60 * 60 * 24 * 7],
      ['d', 60 * 60 * 24],
      ['h', 60 * 60],
      ['m', 60],
    ];
    for (const [label, s] of map) {
      const v = Math.floor(sec / s);
      if (v >= 1) return `${v} ${label}`;
    }
    return 'now';
  };

  const username = post?.author?.username || 'user';
  const createdAtStr = `${timeAgo(post?.createdAt)} `;

  useEffect(() => {
    let ignore = false;
    if (postId && typeof liked !== 'boolean') {
      isPostLiked(postId)
        .then((r) => !ignore && setLiked(Boolean(r?.liked)))
        .catch(() => !ignore && setLiked(false));
    }
    return () => {
      ignore = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  useEffect(() => {
    let ignore = false;
    if (!postId) return;
    (async () => {
      try {
        setLoadingComments(true);
        const data = await listComments(postId, { page: 1, limit: 2 });
        if (!ignore) {
          setPreviewComments(data?.items || []);
          setCommentsTotal(Number(data?.total || 0));
        }
      } catch {
        if (!ignore) {
          setPreviewComments([]);
          setCommentsTotal(0);
        }
      } finally {
        if (!ignore) setLoadingComments(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, [postId]);

  const onLike = async () => {
    const next = !(liked === true);
    setLiked(next);
    setLikes((n) => Math.max(0, n + (next ? 1 : -1)));
    try {
      const res = await toggleLike(postId);
      if (typeof res?.liked === 'boolean' && res.liked !== next) {
        setLiked(res.liked);
        setLikes((n) =>
          Math.max(0, n + (res.liked ? 1 : -1) - (next ? 1 : -1))
        );
      }
    } catch {
      setLiked(!next);
      setLikes((n) => Math.max(0, n + (next ? -1 : +1)));
    }
  };

  const onAddComment = async (e) => {
    e.preventDefault();
    const text = commentText.trim();
    if (!text) return;
    setCommentText('');
    try {
      const created = await addComment(postId, text);

      setPreviewComments((prev) => [created, ...prev].slice(0, 2));
      setCommentsTotal((t) => t + 1);
    } catch (err) {
      alert(err?.message || 'Failed to add comment');
    }
  };

  return (
    <article className={styles.card}>
      <header className={styles.header}>
        <div className={styles.headLeft}>
          <img
            className={styles.avatar}
            src={post?.author?.avatarUrl || ''}
            alt={username}
          />
          <div className={styles.headMeta}>
            <div className={styles.topLine}>
              <span className={styles.author}>{username}</span>
              <span className={styles.dot}>•</span>
              <span className={styles.time}>{createdAtStr}</span>
              <button className={styles.follow} type="button">
                follow
              </button>
            </div>
          </div>
        </div>

        <div className={styles.actionsRight}>
          <PostActions
            post={post}
            canEdit={isOwner}
            onEdit={onEdit}
            onRemoved={onRemoved}
          />
        </div>
      </header>

      <div className={styles.media} onClick={() => onOpen?.(post)}>
        <img
          className={styles.image}
          src={post?.imageUrl || ''}
          alt={post?.description || 'photo'}
          loading="lazy"
        />
      </div>

      <div className={styles.actionsRow}>
        <button
          className={`${styles.iconBtn} ${liked ? styles.liked : ''}`}
          onClick={onLike}
          aria-label="Like"
          type="button"
        >
          <Heart className={styles.icon} strokeWidth={1.8} />
        </button>

        <button
          className={styles.iconBtn}
          onClick={() => onOpen?.(post)}
          aria-label="Comments"
          type="button"
        >
          <MessageCircle className={styles.icon} strokeWidth={1.8} />
        </button>
      </div>

      <div className={styles.likes}>{formatNumber(likes)} likes</div>

      {post?.description && (
        <div className={styles.caption}>
          <span className={styles.author}>{username}</span> {post.description}
        </div>
      )}

      <div className={styles.comments}>
        {commentsTotal > 0 && (
          <button
            className={styles.viewAll}
            type="button"
            onClick={() => onOpen?.(post)}
          >
            View all comments ({commentsTotal})
          </button>
        )}

        {!loadingComments &&
          previewComments.map((c) => (
            <div key={c._id || c.id} className={styles.commentRow}>
              <span className={styles.commentAuthor}>
                {c?.author?.username || 'user'}
              </span>{' '}
              <span>{c.text}</span>
            </div>
          ))}
      </div>

      <form className={styles.addForm} onSubmit={onAddComment}>
        <input
          className={styles.input}
          placeholder="Add a comment…"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <button
          className={styles.postBtn}
          type="submit"
          disabled={!commentText.trim()}
        >
          Post
        </button>
      </form>
    </article>
  );
}
