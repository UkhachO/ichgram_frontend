import styles from './PostCard.module.css';

export default function PostSkeleton() {
  return (
    <div className={styles.card} aria-busy="true">
      <div className={styles.header}>
        <div className={styles.author}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: '#eee',
            }}
          />
          <div>
            <div
              style={{
                width: 120,
                height: 10,
                background: '#eee',
                marginBottom: 6,
              }}
            />
            <div style={{ width: 80, height: 8, background: '#f0f0f0' }} />
          </div>
        </div>
      </div>
      <div className={styles.imageWrap}>
        <div
          style={{ width: '100%', aspectRatio: '1 / 1', background: '#f3f4f6' }}
        />
      </div>
      <div className={styles.actions} />
      <div className={styles.info}>
        <div
          style={{ width: 60, height: 10, background: '#eee', marginBottom: 8 }}
        />
        <div style={{ width: '90%', height: 10, background: '#f0f0f0' }} />
      </div>
    </div>
  );
}
