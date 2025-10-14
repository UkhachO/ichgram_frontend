import styles from './input.module.css';

export default function Input({ label, error, ...props }) {
  return (
    <div className={styles.input}>
      {label && <label className={styles.label}>{label}</label>}
      <input
        className={`${styles.control} ${error ? styles.isError : ''}`}
        {...props}
      />
      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
}
