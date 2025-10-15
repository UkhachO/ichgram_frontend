import { useEffect, useRef } from 'react';

export default function useInfiniteScroll({
  disabled,
  onIntersect,
  rootMargin = '400px',
}) {
  const ref = useRef(null);

  useEffect(() => {
    if (disabled) return;
    const elem = ref.current;
    if (!elem) return;

    const io = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) onIntersect?.();
      },
      { root: null, rootMargin, threshold: 0 }
    );

    io.observe(elem);
    return () => io.disconnect();
  }, [disabled, onIntersect, rootMargin]);

  return ref;
}
