import { useState, useLayoutEffect } from 'react';

export const useMatchMedia = (query: number = 620): boolean => {
  const [matches, setMatches] = useState<boolean>(false);

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(`(max-width: ${query}px)`);

    setMatches(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => {
      if (e.matches !== matches) {
        setMatches(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handler);

    return () => {
      mediaQuery.removeEventListener('change', handler);
    };
  }, [matches, query]);

  return matches;
};
