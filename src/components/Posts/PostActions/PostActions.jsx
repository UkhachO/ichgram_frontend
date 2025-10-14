import { useState } from 'react';
import styles from './PostActions.module.css';
import { deletePost } from '../../../api/posts';

export default function PostActions({ post, canEdit, onEdit, onRemoved }) {
  const [open, setOpen] = useState(false);
  if (!canEdit) return null;

  const remove = async () => {
    if (!confirm('Delete this post?')) return;
    try {
      await deletePost(post._id || post.id);
      onRemoved?.(post);
    } catch (e) {
      alert(e.message || 'Delete failed');
    } finally {
      setOpen(false);
    }
  };

  return (
    <>
      <button
        className={styles.dots}
        onClick={() => setOpen(true)}
        aria-label="More"
      >
        ⋯
      </button>
      {open && (
        <div className={styles.backdrop} onClick={() => setOpen(false)}>
          <div className={styles.sheet} onClick={(e) => e.stopPropagation()}>
            <button className={styles.danger} onClick={remove}>
              Delete
            </button>
            <button
              onClick={() => {
                setOpen(false);
                onEdit?.(post);
              }}
            >
              Edit
            </button>
            <button onClick={() => setOpen(false)}>Cancel</button>
          </div>
        </div>
      )}
    </>
  );
}
