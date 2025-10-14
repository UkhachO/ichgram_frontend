import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function PublicRoute({ children }) {
  const { user, token } = useSelector((s) => s.auth);
  if (token && user) return <Navigate to="/" replace />;
  return children;
}
