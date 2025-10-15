import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

export default function PrivateRoute({ children }) {
  const [ready, setReady] = useState(false);
  const [allowed, setAllowed] = useState(false);
  const loc = useLocation();

  useEffect(() => {
    let canceled = false;
    (async () => {
      try {
        const res = await fetch(
          (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(
            /\/+$/,
            ''
          ) + '/api/auth/me',
          { credentials: 'include' }
        );
        if (!canceled) {
          setAllowed(res.ok);
          setReady(true);
        }
      } catch {
        if (!canceled) {
          setAllowed(false);
          setReady(true);
        }
      }
    })();
    return () => {
      canceled = true;
    };
  }, []);

  if (!ready)
    return <div style={{ padding: 16, textAlign: 'center' }}>Loading…</div>;
  if (!allowed) return <Navigate to="/login" state={{ from: loc }} replace />;
  return children;
}
