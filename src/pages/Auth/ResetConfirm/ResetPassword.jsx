import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import styles from './ResetPassword.module.css';
import { resetPassword } from '../../../api/auth';

import Logo from '../../../shared/ui/Logo/Logo';
import lockImg from '../../../assets/lock-img.svg';

export default function ResetPassword() {
  const [sp] = useSearchParams();
  const token = useMemo(() => sp.get('token') || '', [sp]);

  const [password, setPassword] = useState('');
  const [repeat, setRepeat] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token)
      setError('Неверная или отсутствующая ссылка для восстановления.');
  }, [token]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!token) return;
    if (password.length < 8) return setError('Минимум 8 символов');
    if (password !== repeat) return setError('Пароли не совпадают');

    try {
      setLoading(true);
      await resetPassword({ token, password });
      setDone(true);
      setPassword('');
      setRepeat('');
    } catch (err) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <header className={styles.topbar}>
        <Link to="/" className={styles.brand}>
          <Logo className={styles.brandImg} />
        </Link>
      </header>

      <main className={styles.center}>
        <section className={styles.card}>
          {!done ? (
            <>
              <div className={styles.iconRow}>
                <img src={lockImg} className={styles.icon} alt="" aria-hidden />
              </div>

              <h2 className={styles.title}>Set a new password</h2>
              <p className={styles.sub}>Введите новый пароль для аккаунта.</p>

              <form onSubmit={onSubmit} className={styles.form}>
                <input
                  className={styles.input}
                  type="password"
                  placeholder="New password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                />
                <input
                  className={styles.input}
                  type="password"
                  placeholder="Repeat new password"
                  value={repeat}
                  onChange={(e) => setRepeat(e.target.value)}
                  autoComplete="new-password"
                />
                {error && <div className={styles.error}>{error}</div>}

                <button className={styles.btn} disabled={loading || !token}>
                  {loading ? 'Saving…' : 'Save new password'}
                </button>
              </form>

              <div className={styles.divider}>
                <span>OR</span>
              </div>
            </>
          ) : (
            <div className={styles.successBox}>
              <img
                src={lockImg}
                className={styles.bigIcon}
                alt=""
                aria-hidden
              />
              <p className={styles.successText}>Пароль обновлен</p>
              <Link to="/login" className={styles.linkPrimary}>
                Go to login
              </Link>
            </div>
          )}

          <footer className={styles.footer}>
            <Link to="/auth/forgot" className={styles.linkMuted}>
              Request another link
            </Link>
          </footer>
        </section>
      </main>
    </div>
  );
}
