// src/components/ui/CloseButton.jsx
import styles from './CloseButton.module.css';

export default function CloseButton({
  onClick,
  className = '',
  title = 'Close',
}) {
  return (
    <button
      type="button"
      aria-label={title}
      title={title}
      onClick={onClick}
      className={`${styles.closeBtn} ${className}`}
    >
      <svg viewBox="0 0 24 24" className={styles.icon} aria-hidden="true">
        <path
          d="M6 6l12 12M18 6L6 18"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
}
