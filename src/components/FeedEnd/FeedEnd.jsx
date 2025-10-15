import styles from './FeedEnd.module.css';

export default function FeedEnd() {
  return (
    <div className={styles.wrap}>
      <div className={styles.icon}>✓</div>
      <div className={styles.title}>You’ve seen all the updates</div>
      <div className={styles.sub}>You’re all caught up</div>
    </div>
  );
}
