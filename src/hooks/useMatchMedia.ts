import { useState, useLayoutEffect, useCallback } from 'react';

const staticQueries = [
  '(max-width: 620px)',
  '(max-width: 768px)',
  '(min-width: 1024px)',
];

export const useMatchMedia = (): Record<
  'isMobile' | 'isTablet' | 'isDesktop',
  boolean
> => {
  const mediaQueries = staticQueries.map((query) => matchMedia(query));
  const getMatches = useCallback(
    () => mediaQueries.map((mediaQuery) => mediaQuery.matches),
    [mediaQueries]
  );

  const [matches, setMatches] = useState<boolean[]>(getMatches);

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;

    const handler = () => setMatches(getMatches);

    mediaQueries.forEach((mediaQuery) =>
      mediaQuery.addEventListener('change', handler)
    );

    return () => {
      mediaQueries.forEach((mediaQuery) =>
        mediaQuery.removeEventListener('change', handler)
      );
    };
  }, [getMatches, mediaQueries]);

  return ['isMobile', 'isTablet', 'isDesktop'].reduce(
    (acc, key, index) => ({
      ...acc,
      [key]: matches[index],
    }),
    {} as Record<'isMobile' | 'isTablet' | 'isDesktop', boolean>
  );
};
