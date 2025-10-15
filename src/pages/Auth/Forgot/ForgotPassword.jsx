import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './ForgotPassword.module.css';
import { forgotPassword } from '../../../api/auth';

import Logo from '../../../shared/ui/Logo/Logo';
import lockImg from '../../../assets/lock-img.svg';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    setError('');
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Введите корректный email');
      return;
    }
    try {
      setLoading(true);
      await forgotPassword(email.trim());
      setMsg(
        'Письмо для восстановления отправлено. Проверьте почту (действует 1 час).'
      );
      setEmail('');
    } catch (e) {
      setError(e.message);
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

      <main className={styles.wrap}>
        <section className={styles.card}>
          <img src={lockImg} alt="" aria-hidden className={styles.icon} />

          <h2 className={styles.title}>Trouble logging in?</h2>
          <p className={styles.sub}>
            Enter your email, phone, or username and we'll send you a link to
            get back into your account.
          </p>

          <form onSubmit={onSubmit} className={styles.form}>
            <input
              className={styles.input}
              type="email"
              placeholder="Email or Username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
            {error && <div className={styles.error}>{error}</div>}
            {msg && <div className={styles.success}>{msg}</div>}

            <button className={styles.btn} disabled={loading}>
              {loading ? 'Sending…' : 'Reset your password'}
            </button>
          </form>

          <div className={styles.divider}>
            <span>OR</span>
          </div>

          <Link to="/register" className={styles.linkMuted}>
            Create new account
          </Link>

          <footer className={styles.footer}>
            <Link to="/login" className={styles.linkBack}>
              Back to login
            </Link>
          </footer>
        </section>
      </main>
    </div>
  );
}
