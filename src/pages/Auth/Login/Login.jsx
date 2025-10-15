import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../../../shared/ui/Logo/Logo';

import s from './Login.module.css';

import phone1 from '../../../assets/phone-1.png';
import phone2 from '../../../assets/phone-2.png';

const RAW = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(
  /\/+$/,
  ''
);
const API_ROOT = RAW.endsWith('/api') ? RAW : `${RAW}/api`;
const apiUrl = (path) =>
  `${API_ROOT}${path.startsWith('/') ? path : '/' + path}`;

const Login = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: { emailOrUsername: '', password: '' },
    mode: 'onSubmit',
  });

  const [isLoading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const res = await fetch(apiUrl('/auth/me'), { credentials: 'include' });
        if (!ignore && res.ok) {
          navigate('/', { replace: true });
        }
      } catch (_) {}
    })();
    return () => {
      ignore = true;
    };
  }, [navigate]);

  const onSubmit = async (values) => {
    setServerError('');
    setLoading(true);

    try {
      const res = await fetch(apiUrl('/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          emailOrUsername: values.emailOrUsername.trim(),
          password: values.password,
        }),
      });

      let data = null;
      try {
        data = await res.json();
      } catch (_) {}

      if (!res.ok) {
        if (data?.details?.length) {
          for (const d of data.details) {
            const path = Array.isArray(d.path) ? d.path[0] : d.path;
            if (path === 'emailOrUsername' || path === 'password') {
              setError(path, { type: 'server', message: d.message });
            }
          }
        }
        throw new Error(
          data?.message || `Request failed with status ${res.status}`
        );
      }

      navigate('/', { replace: true });
    } catch (err) {
      setServerError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`container ${s.page}`}>
      <div className={s.left}>
        <img src={phone1} alt="" className={s.phone} />
        <img src={phone2} alt="" className={`${s.phone} ${s.phoneTop}`} />
      </div>

      <div className={s.right}>
        <div className={s.card}>
          <Logo className={s.logo} />

          <form className={s.form} onSubmit={handleSubmit(onSubmit)} noValidate>
            <input
              className={s.input}
              type="text"
              placeholder="Username, or email"
              {...register('emailOrUsername', { required: 'Required' })}
            />
            {errors.emailOrUsername && (
              <p className={s.err}>{errors.emailOrUsername.message}</p>
            )}

            <input
              className={s.input}
              type="password"
              placeholder="Password"
              {...register('password', {
                required: 'Required',
                minLength: { value: 6, message: 'Min 6 chars' },
              })}
            />
            {errors.password && (
              <p className={s.err}>{errors.password.message}</p>
            )}

            {serverError && <p className={s.err}>{serverError}</p>}

            <button type="submit" className={s.btn} disabled={isLoading}>
              {isLoading ? 'Logging in…' : 'Log in'}
            </button>

            <div className={s.separator}>
              <span>OR</span>
            </div>

            <div className={s.linkRow}>
              <Link to="/reset">Forgot password?</Link>
            </div>
          </form>
        </div>

        <div className={s.cardAlt}>
          <span>Don’t have an account?</span>{' '}
          <Link to="/register" className={s.sign}>
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
