import { useEffect, useRef, useState } from 'react';
import styles from './CreatePostModal.module.css';
import { createPost, updatePost } from '../../../api/posts';
import CloseButton from '../../../shared/ui/CloseButton/CloseButton';

export default function CreatePostModal({ open, onClose, onDone, initial }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [desc, setDesc] = useState(initial?.description || '');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!open) {
      setFile(null);
      setPreview('');
      setDesc(initial?.description || '');
    }
  }, [open, initial]);

  const onPick = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const onDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
    }
  };

  const submit = async () => {
    if (loading) return;
    try {
      setLoading(true);
      if (initial?.id) {
        await updatePost(initial.id, { file, description: desc });
      } else {
        await createPost({ file, description: desc });
      }
      onDone?.();
      onClose?.();
    } catch (e) {
      alert(e.message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose} className={styles.CloseButton} />
        <div className={styles.header}>
          <div>{initial?.id ? 'Edit post' : 'Create post'}</div>
          <button
            className={styles.submit}
            disabled={loading || (!file && !initial?.id)}
            onClick={submit}
          >
            {loading ? 'Saving…' : 'Publish'}
          </button>
        </div>

        <div className={styles.body}>
          <div
            className={styles.left}
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDrop}
            onClick={() => inputRef.current?.click()}
          >
            {preview || initial?.imageUrl ? (
              <img
                className={styles.img}
                src={preview || initial?.imageUrl}
                alt=""
              />
            ) : (
              <div className={styles.dropzone}>
                <div className={styles.cloud}>☁️</div>
                <div>Drag & drop image or click</div>
              </div>
            )}
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={onPick}
            />
          </div>

          <div className={styles.right}>
            <textarea
              className={styles.textarea}
              placeholder="Write a caption…"
              maxLength={2200}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
