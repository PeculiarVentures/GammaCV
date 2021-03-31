import { useState, useLayoutEffect, useEffect } from 'react';

const useEnhancedEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * A hook that returns `true` if the media query matched and `false` if not. This
 * hook will always return `false` when rendering on the server.
 *
 * @param query The media query you want to match against e.g. `"only screen and (min-width: 12em)"`
 */
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEnhancedEffect(() => {
    const media = window.matchMedia(query);

    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = () => {
      setMatches(media.matches);
    };

    media.addListener(listener);

    return () => {
      media.removeListener(listener);
    };
  }, [matches, query]);

  return matches;
}
