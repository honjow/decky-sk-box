const CACHE_KEY = "skbox_version_cache";
const CACHE_DURATION = 6 * 60 * 60 * 1000; // 6 hours

export interface VersionCache {
  currentVersion: string;
  latestVersion: string;
  lastCheckTime: number;
  cacheExpiry: number;
}

export const getVersionCache = (): VersionCache | null => {
  const cached = localStorage.getItem(CACHE_KEY);
  if (!cached) return null;

  try {
    const cache: VersionCache = JSON.parse(cached);
    if (Date.now() > cache.cacheExpiry) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
    return cache;
  } catch (e) {
    console.warn("Failed to parse version cache:", e);
    return null;
  }
};

export const setVersionCache = (current: string, latest: string): void => {
  const cache: VersionCache = {
    currentVersion: current,
    latestVersion: latest,
    lastCheckTime: Date.now(),
    cacheExpiry: Date.now() + CACHE_DURATION,
  };
  localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
};

export const getStaleVersionCache = (): VersionCache | null => {
  const cached = localStorage.getItem(CACHE_KEY);
  if (!cached) return null;

  try {
    return JSON.parse(cached);
  } catch (e) {
    console.warn("Failed to parse stale version cache:", e);
    return null;
  }
};
