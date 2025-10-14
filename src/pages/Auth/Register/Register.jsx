// src/pages/Auth/Register/Register.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Logo from '../../../shared/ui/Logo/Logo';
import styles from './Register.module.css';

// Безпечний конструктор API root.
const RAW = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(
  /\/+$/,
  ''
);
const API_ROOT = RAW.endsWith('/api') ? RAW : `${RAW}/api`;
const apiUrl = (path) =>
  `${API_ROOT}${path.startsWith('/') ? path : '/' + path}`;

// прості клієнтські перевірки (щоб миттєво підсвічувати поля)
// бекенд все одно зробить свою валідацію
const usernameRe = /^[a-z0-9_]+$/;

export default function Register() {
  const navigate = useNavigate();

  const [values, setValues] = useState({
    email: '',
    fullName: '',
    username: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setValues((s) => ({ ...s, [name]: value }));
    setErrors((s) => ({ ...s, [name]: '' }));
    setServerError('');
  };

  const validateClient = () => {
    const e = {};
    if (!values.email.trim()) e.email = 'Email is required';
    if (!values.fullName.trim()) e.fullName = 'Full name is required';
    if (!values.username.trim()) e.username = 'Username is required';
    if (values.username && !usernameRe.test(values.username))
      e.username = 'Use lowercase letters, digits or underscore';
    if (!values.password) e.password = 'Password is required';
    if (values.password && values.password.length < 8)
      e.password = 'Password must be at least 8 characters';
    return e;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    const client = validateClient();
    if (Object.keys(client).length) {
      setErrors(client);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(apiUrl('/auth/register'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email: values.email.trim(),
          fullName: values.fullName.trim(),
          username: values.username.trim(),
          password: values.password,
        }),
      });

      let data = null;
      try {
        data = await res.json();
      } catch (_) {}

      if (!res.ok) {
        if (data?.details?.length) {
          const fieldErrors = {};
          for (const d of data.details) {
            const path = Array.isArray(d.path) ? d.path[0] : d.path;
            if (path) fieldErrors[path] = d.message;
          }
          setErrors(fieldErrors);
        }
        throw new Error(data?.message || 'Validation error');
      }

      navigate('/login', { replace: true });
    } catch (err) {
      setServerError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <Logo className={styles.logo} />

        <p className={styles.subTitle}>
          Sign up to see photos and videos
          <br />
          from your friends.
        </p>

        {serverError && <div className={styles.serverError}>{serverError}</div>}

        <form onSubmit={onSubmit} className={styles.form} noValidate>
          {/* Email */}
          <input
            className={`${styles.input} ${
              errors.email ? styles.inputError : ''
            }`}
            type="email"
            name="email"
            placeholder="Email"
            value={values.email}
            onChange={onChange}
            autoComplete="email"
          />
          {errors.email && <div className={styles.error}>{errors.email}</div>}

          {/* Full name */}
          <input
            className={`${styles.input} ${
              errors.fullName ? styles.inputError : ''
            }`}
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={values.fullName}
            onChange={onChange}
            autoComplete="name"
          />
          {errors.fullName && (
            <div className={styles.error}>{errors.fullName}</div>
          )}

          {/* Username */}
          <input
            className={`${styles.input} ${
              errors.username ? styles.inputError : ''
            }`}
            type="text"
            name="username"
            placeholder="Username"
            value={values.username}
            onChange={onChange}
            autoComplete="username"
          />
          {errors.username && (
            <div className={styles.error}>{errors.username}</div>
          )}

          {/* Password */}
          <input
            className={`${styles.input} ${
              errors.password ? styles.inputError : ''
            }`}
            type="password"
            name="password"
            placeholder="Password"
            value={values.password}
            onChange={onChange}
            autoComplete="new-password"
          />
          {errors.password && (
            <div className={styles.error}>{errors.password}</div>
          )}

          {/* ці два абзаци ПЕРЕД кнопкою */}
          <p className={styles.muted}>
            People who use our service may have uploaded your contact
            information to Instagram.{' '}
            <a href="#" onClick={(e) => e.preventDefault()}>
              Learn More
            </a>
          </p>

          <p className={styles.legal}>
            By signing up, you agree to our <a href="#">Terms</a>,{' '}
            <a href="#">Privacy Policy</a> and <a href="#">Cookies Policy</a>.
          </p>

          <button disabled={loading} className={styles.btn} type="submit">
            {loading ? 'Signing up…' : 'Sign up'}
          </button>
        </form>

      </div>

      <div className={styles.card}>
        <div className={styles.center}>
          Have an account? <Link to="/login">Log in</Link>
        </div>
      </div>
    </div>
  );
}
