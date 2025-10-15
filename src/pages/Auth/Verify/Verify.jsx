import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Verify.module.css';
import Logo from '../../../shared/ui/Logo/Logo';

const RAW = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(
  /\/+$/,
  ''
);
const API_ROOT = RAW.endsWith('/api') ? RAW : `${RAW}/api`;

export default function Verify() {
  const [state, setState] = useState({
    status: 'loading',
    message: 'Verifying…',
  });

  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const id = sp.get('id');
    const token = sp.get('token');

    if (!id || !token) {
      setState({ status: 'error', message: 'Missing id or token.' });
      return;
    }

    const url = `${API_ROOT}/auth/verify?id=${encodeURIComponent(
      id
    )}&token=${encodeURIComponent(token)}`;

    (async () => {
      try {
        const res = await fetch(url, { credentials: 'include' });

        if (res.ok) {
          setState({ status: 'ok', message: 'Verification successful.' });
        } else {
          let msg = 'Verification failed';
          try {
            const data = await res.json();
            msg = data?.message || msg;
          } catch (_) {}
          setState({ status: 'error', message: msg });
        }
      } catch (e) {
        setState({ status: 'error', message: 'Network error' });
      }
    })();
  }, []);

  return (
    <div className={styles.page}>
      <header className={styles.topbar}>
        <Link to="/" className={styles.brand}>
          <Logo className={styles.brandImg} />
        </Link>
      </header>

      <main className={styles.center}>
        <section className={styles.card}>
          <h2 className={styles.title}>Email verification</h2>

          <p
            className={
              state.status === 'ok'
                ? styles.success
                : state.status === 'error'
                ? styles.error
                : styles.sub
            }
          >
            {state.message}
          </p>

          <div className={styles.actions}>
            {state.status === 'ok' ? (
              <Link to="/login" className={styles.btnPrimary}>
                Go to login
              </Link>
            ) : state.status === 'loading' ? (
              <span className={styles.spinner} aria-hidden />
            ) : (
              <>
                <Link to="/register" className={styles.btnPrimary}>
                  Create account
                </Link>
                <Link to="/login" className={styles.linkMuted}>
                  Back to login
                </Link>
              </>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
