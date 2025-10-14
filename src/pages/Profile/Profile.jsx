// src/pages/Profile/Profile.jsx
import { useEffect, useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import styles from './Profile.module.css';

import { getMe, getUserById } from '../../api/users';
import { getUserPosts } from '../../api/users';
import PostCard from '../../components/PostCard/PostCard';
import PostSkeleton from '../../components/PostCard/PostSkeleton';

export default function Profile() {
  const { id } = useParams(); // /profile або /profile/:id
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [error, setError] = useState('');

  // хто дивиться — свій профіль?
  const isOwn = !id;

  useEffect(() => {
    let alive = true;

    async function loadUser() {
      setLoadingUser(true);
      setError('');
      try {
        const data = isOwn ? await getMe() : await getUserById(id);
        if (!alive) return;
        setUser(data?.user ?? data);
      } catch (e) {
        setError(e?.message || 'Failed to load profile');
      } finally {
        setLoadingUser(false);
      }
    }

    loadUser();
    return () => (alive = false);
  }, [id, isOwn]);

  useEffect(() => {
    let alive = true;
    async function loadPosts() {
      if (!user?._id) return;
      setLoadingPosts(true);
      try {
        const data = await getUserPosts({
          authorId: user._id,
          page: 1,
          limit: 12,
        });
        if (!alive) return;
        setPosts(data?.items ?? data?.data?.items ?? []);
      } catch (e) {
        // мʼяко ігноруємо
      } finally {
        setLoadingPosts(false);
      }
    }
    loadPosts();
    return () => (alive = false);
  }, [user?._id]);

  const counts = useMemo(
    () => ({
      posts: posts.length,
      followers: user?.followersCount ?? 0,
      following: user?.followingCount ?? 0,
    }),
    [posts.length, user]
  );

  if (loadingUser) {
    return <div className={styles.page}>Loading…</div>;
  }

  if (error) {
    return (
      <div className={styles.page}>
        <div className={styles.error}>{error}</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <img className={styles.avatar} src={user.avatarUrl || ''} alt="" />
        <div className={styles.meta}>
          <div className={styles.row}>
            <h1 className={styles.username}>{user.username}</h1>
            {isOwn ? (
              <button
                className={styles.editBtn}
                onClick={() => navigate('/profile/edit')}
              >
                Edit profile
              </button>
            ) : null}
          </div>

          <ul className={styles.counters}>
            <li>
              <strong>{counts.posts}</strong> posts
            </li>
            <li>
              <strong>{counts.followers}</strong> followers
            </li>
            <li>
              <strong>{counts.following}</strong> following
            </li>
          </ul>

          {/* біо + сайт якщо є */}
          <div className={styles.bio}>
            {user?.about ? <p>{user.about}</p> : null}
            {user?.website ? (
              <a href={user.website} target="_blank" rel="noreferrer">
                {user.website}
              </a>
            ) : null}
          </div>
        </div>
      </header>

      <section className={styles.grid}>
        {loadingPosts
          ? Array.from({ length: 6 }).map((_, i) => <PostSkeleton key={i} />)
          : posts.map((p) => <PostCard key={p._id || p.id} post={p} />)}
      </section>
    </div>
  );
}
