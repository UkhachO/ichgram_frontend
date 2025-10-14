// src/pages/Home/Home.jsx
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styles from './Home.module.css';

import { fetchPosts } from '../../api/posts';
import CreatePostModal from '../../components/Posts/CreatePostModal/CreatePostModal';
import PostViewer from '../../components/Posts/PostViewer/PostViewer';
import PostSkeleton from '../../components/PostCard/PostSkeleton';
import FeedEnd from '../../components/FeedEnd/FeedEnd';
import PostCard from '../../components/PostCard/PostCard';

const LIMIT = 12;

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const [loading, setLoading] = useState(false);
  const [firstLoad, setFirstLoad] = useState(true);
  const [error, setError] = useState('');

  // модалки
  const [viewerPost, setViewerPost] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [editInit, setEditInit] = useState(null); // { id, imageUrl, description }

  // нескінченний скрол
  const sentinelRef = useRef(null);

  const canLoadMore = useMemo(
    () => page < pages && !loading,
    [page, pages, loading]
  );

  // мердж по id/_id для уникнення дублікатів
  const merge = useCallback((arr) => {
    const map = new Map();
    for (const p of arr) {
      const key = String(p._id ?? p.id);
      map.set(key, { ...(map.get(key) || {}), ...p });
    }
    return Array.from(map.values());
  }, []);

  const load = useCallback(
    async (nextPage = 1) => {
      if (loading) return;
      setLoading(true);
      setError('');
      try {
        const data = await fetchPosts({ page: nextPage, limit: LIMIT });

        const items = data?.items ?? data?.data?.items ?? [];
        const totalPages = Number(data?.pages ?? data?.data?.pages ?? 1) || 1;

        setPosts((prev) =>
          nextPage === 1 ? items : merge([...prev, ...items])
        );
        setPage(nextPage);
        setPages(totalPages);
      } catch (e) {
        setError(e?.message || 'Failed to load feed');
      } finally {
        setLoading(false);
        setFirstLoad(false);
      }
    },
    [loading, merge]
  );

  // перший лоад
  useEffect(() => {
    load(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // нескінченний скрол через IntersectionObserver
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    let pending = false;
    const io = new IntersectionObserver(
      (entries) => {
        const isVisible = entries.some((e) => e.isIntersecting);
        if (isVisible && canLoadMore && !pending) {
          pending = true;
          load(page + 1).finally(() => setTimeout(() => (pending = false), 50));
        }
      },
      { rootMargin: '400px 0px 400px 0px' }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [page, canLoadMore, load]);

  const onRemoveOptimistic = useCallback((removed) => {
    setPosts((prev) =>
      prev.filter(
        (p) => String(p._id ?? p.id) !== String(removed._id ?? removed.id)
      )
    );
  }, []);

  const gridPosts = useMemo(() => posts, [posts]);

  return (
    <div className={styles.wrap}>
      {/* помилка */}
      {error && <div className={styles.error}>{String(error)}</div>}

      {/* порожньо */}
      {!firstLoad && !loading && gridPosts.length === 0 && (
        <div className={styles.empty}>Поки що тут порожньо.</div>
      )}

      {/* сітка карток */}
      <div className={styles.grid}>
        {gridPosts.map((p) => {
          const id = String(p._id ?? p.id);
          return (
            <PostCard
              key={id}
              post={p}
              currentUserId={window.__currentUserId || ''} // заміниш на свій контекст/стор
              onOpen={(post) => setViewerPost(post)}
              onEdit={(post) => {
                setEditInit({
                  id: post._id || post.id,
                  imageUrl: post.imageUrl,
                  description: post.description || '',
                });
                setShowCreate(true); // редагування в модалці
              }}
              onRemoved={(post) => onRemoveOptimistic(post)}
            />
          );
        })}

        {/* перший лоад — реальні скелетони */}
        {firstLoad &&
          Array.from({ length: 6 }).map((_, i) => (
            <PostSkeleton key={`sk-${i}`} />
          ))}
      </div>

      {/* sentinel для нескінченного скролу */}
      <div ref={sentinelRef} className={styles.sentinel} />

      {/* кінець фіда */}
      {!canLoadMore && !firstLoad && <FeedEnd />}

      {/* Модалки */}
      <PostViewer
        open={!!viewerPost}
        post={viewerPost}
        onClose={() => setViewerPost(null)}
      />

      <CreatePostModal
        open={showCreate}
        initial={editInit}
        onClose={() => setShowCreate(false)}
        onDone={() => load(1)}
      />
    </div>
  );
}
