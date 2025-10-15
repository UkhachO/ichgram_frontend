import CreatePostModal from '../../components/Posts/CreatePostModal/CreatePostModal';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Create() {
  const navigate = useNavigate();
  const location = useLocation();

  const initial = location.state?.editInit || null;

  const close = () => navigate(-1);
  const done = () =>
    navigate('/', { replace: true, state: { refreshFeed: Date.now() } });

  return (
    <CreatePostModal
      open={true}
      initial={initial}
      onClose={close}
      onDone={done}
    />
  );
}
