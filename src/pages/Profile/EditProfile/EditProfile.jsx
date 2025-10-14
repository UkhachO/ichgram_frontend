// src/pages/Profile/EditProfile.jsx
import { useEffect, useRef, useState } from 'react';
import styles from './EditProfile.module.css';
import { getMe, updateMe, uploadAvatar } from '../../../api/users'

export default function EditProfile() {
  const [form, setForm] = useState({
    username: '',
    website: '',
    about: '',
    avatarUrl: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getMe();
        const u = data?.user ?? data;
        setForm({
          username: u?.username || '',
          website: u?.website || '',
          about: u?.about || '',
          avatarUrl: u?.avatarUrl || '',
        });
      } catch (e) {
        setError(e?.message || 'Failed to load profile');
      }
    })();
  }, []);

  const onPick = () => fileRef.current?.click();

  const onFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setSaving(true);
      const res = await uploadAvatar(file); // { ok, url }
      if (res?.url) {
        setForm((f) => ({ ...f, avatarUrl: res.url }));
      }
    } catch (err) {
      setError(err?.message || 'Failed to upload avatar');
    } finally {
      setSaving(false);
      e.target.value = '';
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await updateMe({
        username: form.username.trim(),
        website: form.website.trim(),
        about: form.about.trim(),
      });
    } catch (err) {
      setError(err?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Edit profile</h1>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.card}>
        <div className={styles.top}>
          <img className={styles.avatar} src={form.avatarUrl || ''} alt="" />
          <button type="button" className={styles.photoBtn} onClick={onPick}>
            New photo
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={onFile}
            hidden
          />
          <div className={styles.summary}>
            <div className={styles.name}>{form.username || 'username'}</div>
            <div className={styles.gray}>
              {/* тут будь-що коротке про акаунт */}
            </div>
          </div>
        </div>

        <form className={styles.form} onSubmit={onSubmit}>
          <label>
            <span>Username</span>
            <input
              value={form.username}
              onChange={(e) =>
                setForm((f) => ({ ...f, username: e.target.value }))
              }
              maxLength={30}
              required
            />
          </label>

          <label>
            <span>Website</span>
            <input
              value={form.website}
              onChange={(e) =>
                setForm((f) => ({ ...f, website: e.target.value }))
              }
              placeholder="https://…"
            />
          </label>

          <label>
            <span>About</span>
            <textarea
              value={form.about}
              onChange={(e) =>
                setForm((f) => ({ ...f, about: e.target.value }))
              }
              maxLength={150}
              rows={5}
            />
            <div className={styles.counter}>{form.about.length} / 150</div>
          </label>

          <button className={styles.saveBtn} disabled={saving}>
            {saving ? 'Saving…' : 'Save'}
          </button>
        </form>
      </div>
    </div>
  );
}
