import { useEffect, useRef } from 'react';

export const useOutsideClicks = <T extends HTMLElement>(onOutside: () => void) => {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onOutside();
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onOutside]);

  return ref;
};
