import { useState, useEffect } from "react";

/**
 * Custom hook to dynamically resolve asset paths.
 * If an asset fails to load, it cycles through candidate directories:
 * - root (e.g., /profile.png)
 * - /assets/
 * - /public/assets/
 * - /public/asset/
 * - /src/
 * - /src/assets/
 * - /src/assets/logo/
 * 
 * Supports relative paths to ensure compatibility with GitHub Pages (subdirectory deploys) and surge.sh.
 */
export function useAssetResolver(filename: string, fallbackSrc?: string) {
  // Clean filename to remove leading slash for relative matching
  const cleanName = filename.replace(/^\//, "");

  // Generate candidate paths (absolute, relative, and nested)
  const candidates = Array.from(new Set([
    filename, // e.g., "/profile.png" or "profile.png"
    `/${cleanName}`,
    `./${cleanName}`,
    `${cleanName}`,
    `/assets/${cleanName}`,
    `assets/${cleanName}`,
    `./assets/${cleanName}`,
    `/public/assets/${cleanName}`,
    `public/assets/${cleanName}`,
    `./public/assets/${cleanName}`,
    `/public/asset/${cleanName}`,
    `public/asset/${cleanName}`,
    `./public/asset/${cleanName}`,
    `/src/${cleanName}`,
    `src/${cleanName}`,
    `./src/${cleanName}`,
    `/src/assets/${cleanName}`,
    `src/assets/${cleanName}`,
    `./src/assets/${cleanName}`,
    `/src/assets/logo/${cleanName}`,
    `src/assets/logo/${cleanName}`,
    `./src/assets/logo/${cleanName}`,
  ]));

  const [currentIdx, setCurrentIdx] = useState(0);
  const [resolvedSrc, setResolvedSrc] = useState(candidates[0]);
  const [hasFailedAll, setHasFailedAll] = useState(false);

  // Sync state if filename changes
  useEffect(() => {
    setCurrentIdx(0);
    setResolvedSrc(candidates[0]);
    setHasFailedAll(false);
  }, [filename]);

  const handleError = () => {
    if (currentIdx < candidates.length - 1) {
      const nextIdx = currentIdx + 1;
      setCurrentIdx(nextIdx);
      setResolvedSrc(candidates[nextIdx]);
    } else {
      setHasFailedAll(true);
      if (fallbackSrc) {
        setResolvedSrc(fallbackSrc);
      }
    }
  };

  return {
    src: resolvedSrc,
    handleError,
    hasFailedAll,
    candidates,
    currentIdx
  };
}
