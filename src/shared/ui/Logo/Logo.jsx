import logoUrl from '../../../assets/ICHGRAM.svg';
import './Logo.module.css';

const Logo = ({
  size = 160,
  className = '',
  title = 'ICHGRAM',
}) => {
  const style = {
    width: typeof size === 'number' ? `${size}px` : size,
    height: 'auto',
  };
  return (
    <img
      src={logoUrl}
      alt={title}
      aria-label={title}
      style={style}
      className={`ich-logo ${className}`}
      loading="lazy"
      decoding="async"
    />
  );
}

export default Logo;